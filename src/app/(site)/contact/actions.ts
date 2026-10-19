"use server";

// Contact page postcard → contact_messages (+ a notification email).
// Public: no auth. Spam guard = a hidden honeypot field + server-side validation.
import { z } from "zod";
import { db, hasDatabase } from "@/db";
import { contactMessages } from "@/db/schema";
import { notifyEmail, sendEmail } from "@/lib/email";
import { CONTACT_TOPICS, TOPIC_KEYS } from "@/lib/placeholder/contact";

export type ContactField = "topic" | "message" | "name" | "email";

export type ContactInput = {
  topic: string;
  message: string;
  name: string;
  email: string;
  budget?: string;
  timing?: string;
  orderNo?: string;
  /** honeypot: a hidden field people never see; bots fill it in */
  website?: string;
};

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<ContactField, string>> };

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || null);

const contactInput = z.object({
  topic: z.enum(TOPIC_KEYS, { error: "pick one, so I know where to start" }),
  message: z.string().trim().min(1, "a sentence or two, please").max(5000, "that's a lot. keep it under 5000 characters"),
  name: z.string().trim().min(1, "what should I call you?").max(120, "a shorter name, please"),
  email: z
    .string()
    .trim()
    .min(1, "I need this to write back")
    .max(254, "that email looks unfinished. check for a typo?")
    .regex(/^\S+@\S+\.\S+$/, "that email looks unfinished. check for a typo?"),
  budget: optional(60),
  timing: optional(60),
  orderNo: optional(120),
});

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  // Honeypot filled → pretend it worked, store nothing.
  if (typeof input?.website === "string" && input.website.trim() !== "") return { ok: true };

  const parsed = contactInput.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "topic" || key === "message" || key === "name" || key === "email") && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "A couple of things to fix above, then it's ready to go.", fieldErrors };
  }

  const data = parsed.data;
  const topic = CONTACT_TOPICS.find((t) => t.key === data.topic)!;
  // Budget / timing / order number are only kept for the topics that ask for them.
  const budget = topic.budget ? data.budget : null;
  const timing = topic.budget ? data.timing : null;
  const orderNo = topic.order ? data.orderNo : null;

  if (!hasDatabase()) return { ok: false, error: "The inbox isn't connected right now. Please email me instead." };

  try {
    await db().insert(contactMessages).values({
      topic: data.topic,
      message: data.message,
      name: data.name,
      email: data.email,
      budget,
      timing,
      orderNo,
    });
  } catch (error) {
    console.error("[contact] saving the message failed", error);
    return { ok: false, error: "Couldn't send that one. Please try again." };
  }

  // Notification email. A failure here must not fail the submission.
  const to = notifyEmail();
  if (to) {
    const lines = [
      `about: ${topic.label}`,
      `from: ${data.name} <${data.email}>`,
      budget && `budget: ${budget}`,
      timing && `when: ${timing}`,
      orderNo && `order: ${orderNo}`,
      "",
      data.message,
    ].filter((l) => l !== null && l !== undefined);
    try {
      await sendEmail({ to, subject: `New message · ${topic.label}`, text: lines.join("\n"), replyTo: data.email });
    } catch (error) {
      console.error("[contact] notification email failed", error);
    }
  }

  return { ok: true };
}
