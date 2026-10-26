// Outgoing email (Resend). Server only.
// Without RESEND_API_KEY nothing is sent: the email is printed to the server log
// instead (fine for local dev; set the key on Vercel to really send).
import { Resend } from "resend";

type Email = { to: string; subject: string; text: string; html?: string; replyTo?: string };

/** "Yurix <onboarding@resend.dev>" works without a domain, but only delivers to the Resend account's own email. */
const from = () => process.env.EMAIL_FROM || "Yurix <onboarding@resend.dev>";

export async function sendEmail({ to, subject, text, html, replyTo }: Email) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email · not sent, no RESEND_API_KEY] to: ${to} · ${subject}\n${text}`);
    return { sent: false as const };
  }
  const { error } = await new Resend(key).emails.send({ from: from(), to, subject, text, html, replyTo });
  if (error) throw new Error(`Email failed: ${error.message}`);
  return { sent: true as const };
}

/** Where admin notifications (contact messages) go. */
export const notifyEmail = () => process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || "";
