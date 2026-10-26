// Placeholder content for the Contact page, copied from the design
// (design/design_handoff_yurix_site/designs/ContactPage.dc.html).
// Rates and availability dates are placeholders (see the handoff README).
// Email and Instagram come from the Home `site` settings (hey@yurix.art, @yurix.draws).
import { site, social } from "./home";

export type ContactTopicKey = "commission" | "animation" | "custom" | "order" | "collab" | "hi" | "other";

export type ContactTopic = {
  key: ContactTopicKey;
  label: string;
  /** textarea placeholder for this topic */
  hint: string;
  /** shows the budget + timing chips */
  budget?: boolean;
  /** shows the order number field */
  order?: boolean;
};

export const TOPIC_KEYS = ["commission", "animation", "custom", "order", "collab", "hi", "other"] as const;

export const CONTACT_TOPICS: ContactTopic[] = [
  { key: "commission", label: "illustration commission", budget: true, hint: "who it's for, where it'll live, the vibe you're after…" },
  { key: "animation", label: "animation / music video", budget: true, hint: "the song or idea, how long, when it needs to be out…" },
  { key: "custom", label: "custom object", budget: true, hint: "what's the object, who it's for, colours they love…" },
  { key: "order", label: "a shop order", order: true, hint: "what you ordered and what you need help with…" },
  { key: "collab", label: "collab / press", hint: "who you are and what we could make together…" },
  { key: "hi", label: "just saying hi", hint: "hello is plenty." },
  { key: "other", label: "other", hint: "tell me what's on your mind…" },
];

export const BUDGET_OPTIONS = ["under ₹10k", "₹10–25k", "₹25–50k", "₹50k+", "not sure yet"];
export const TIMING_OPTIONS = ["no rush", "within a month", "it's urgent"];

export type Availability = "open" | "booked";

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  open: "open for commissions · booking november",
  booked: "booked until january · hellos still welcome",
};

export type ContactFact = { title: string; text: string };

export type ContactContent = {
  label: string;
  heading: string;
  intro: string;
  availability: Availability;
  availabilityLabel: string;
  topics: ContactTopic[];
  budgetOptions: string[];
  timingOptions: string[];
  email: string;
  instagramHandle: string;
  instagramHref: string;
  replyNote: string;
  facts: ContactFact[];
};

const availability: Availability = "open";

export const CONTACT_CONTENT: ContactContent = {
  label: "contact · mumbai, IN",
  heading: "say hi",
  intro:
    "Commissions, music videos, a thing you want painted, or just a hello. Tell me what it's about and I'll know where to start.",
  availability,
  availabilityLabel: AVAILABILITY_LABELS[availability],
  topics: CONTACT_TOPICS,
  budgetOptions: BUDGET_OPTIONS,
  timingOptions: TIMING_OPTIONS,
  email: site.email,
  instagramHandle: `@${site.instagramHandle}`,
  instagramHref: social[0].href,
  replyNote: "I reply to everything, Monday to Saturday. Agencies and studios: a brief or a deck helps a lot.",
  facts: [
    {
      title: "rates",
      text: "Illustrations start around ₹8,000. Animation is quoted per second of finished footage. [your rates]",
    },
    {
      title: "turnaround",
      text: "Illustrations take 1–2 weeks, animation 3–8. Rush jobs are possible if the calendar allows. Ask.",
    },
    {
      title: "usage",
      text: "You get the rights your project needs. I keep the right to show the work in my portfolio, unless we agree otherwise.",
    },
  ],
};
