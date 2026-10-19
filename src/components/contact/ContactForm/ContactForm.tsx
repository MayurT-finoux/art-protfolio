"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { sendContactMessage, type ContactField } from "@/app/(site)/contact/actions";
import type { ContactTopic, ContactTopicKey } from "@/lib/placeholder/contact";
import { useMumbaiTime } from "../ContactPage/useMumbaiTime";
import styles from "./ContactForm.module.css";

type Props = { topics: ContactTopic[]; budgetOptions: string[]; timingOptions: string[] };

type Form = {
  topic: ContactTopicKey | "";
  message: string;
  name: string;
  email: string;
  budget: string;
  timing: string;
  orderNo: string;
  /** honeypot */
  website: string;
};

type Status = "idle" | "sending" | "failed" | "sent";
type Errors = Partial<Record<ContactField, string>>;

const blank = (): Form => ({ topic: "", message: "", name: "", email: "", budget: "", timing: "", orderNo: "", website: "" });

/** Inline validation, copied from the design. */
function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.topic) e.topic = "pick one, so I know where to start";
  if (f.message.trim().length < (f.topic === "hi" ? 2 : 10))
    e.message = f.topic === "hi" ? "even a “hi” works" : "a sentence or two, please";
  if (!f.name.trim()) e.name = "what should I call you?";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim()))
    e.email = f.email ? "that email looks unfinished. check for a typo?" : "I need this to write back";
  return e;
}

const FIX_ABOVE = "A couple of things to fix above, then it's ready to go.";

// The postcard on the cutting mat. Saves to the inbox (admin) via a server action.
export function ContactForm({ topics, budgetOptions, timingOptions }: Props) {
  const time = useMumbaiTime();
  const [form, setForm] = useState<Form>(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  /** network / server error (input is kept) */
  const [sendError, setSendError] = useState("");

  const topic = topics.find((t) => t.key === form.topic);

  const setF = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      if (!(k in e)) return e;
      const next = { ...e };
      delete next[k as ContactField];
      return next;
    });
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === "sending") return;
    const e = validate(form);
    setSendError("");
    if (Object.keys(e).length) {
      setErrors(e);
      setStatus("failed");
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await sendContactMessage({
        topic: form.topic,
        message: form.message,
        name: form.name,
        email: form.email,
        budget: topic?.budget ? form.budget : undefined,
        timing: topic?.budget ? form.timing : undefined,
        orderNo: topic?.order ? form.orderNo : undefined,
        website: form.website,
      });
      if (res.ok) {
        setStatus("sent");
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      if (res.fieldErrors && Object.keys(res.fieldErrors).length) setErrors(res.fieldErrors);
      else setSendError(res.error);
      setStatus("failed");
    } catch {
      setSendError("Couldn't reach the inbox. Check your connection and try again — your message is still here.");
      setStatus("failed");
    }
  };

  const again = () => {
    setForm(blank());
    setErrors({});
    setSendError("");
    setStatus("idle");
  };

  const hasErrors = Object.keys(errors).length > 0;
  const alert = status === "failed" ? (hasErrors ? FIX_ABOVE : sendError) : "";

  const chips = (key: "budget" | "timing", options: string[]) =>
    options.map((v) => {
      const on = form[key] === v;
      return (
        <button
          key={v}
          type="button"
          aria-pressed={on}
          data-on={on ? "1" : undefined}
          onClick={() => setF(key, on ? "" : v)}
          className={styles.chip}
        >
          {v}
        </button>
      );
    });

  const summary = [
    ["about", topic?.label ?? ""],
    ["budget", topic?.budget ? form.budget : ""],
    ["when", topic?.budget ? form.timing : ""],
    ["order", topic?.order ? form.orderNo : ""],
  ].filter((x) => x[1].trim());

  return (
    <div data-component="ContactForm" className={styles.mat}>
      <div className={styles.card}>
        <span className={`${styles.tape} ${styles.tapeLeft}`} />
        <span className={`${styles.tape} ${styles.tapeRight}`} />

        {status !== "sent" ? (
          <form onSubmit={submit} noValidate className={styles.form}>
            <div className={styles.left}>
              <div className={styles.group}>
                <span className={styles.label}>what&apos;s it about?</span>
                <div role="radiogroup" aria-label="Topic" className={styles.topics}>
                  {topics.map((t) => {
                    const on = form.topic === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        data-on={on ? "1" : undefined}
                        data-invalid={errors.topic ? "1" : undefined}
                        onClick={() => setF("topic", t.key)}
                        className={styles.topic}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                {errors.topic && <span className={styles.error}>{errors.topic}</span>}
              </div>
              <label className={styles.field}>
                <span className={styles.label}>your message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={(e) => setF("message", e.target.value)}
                  rows={6}
                  maxLength={5000}
                  placeholder={topic ? topic.hint : "pick a topic above, then tell me everything…"}
                  aria-invalid={errors.message ? true : undefined}
                  className={styles.message}
                />
                {errors.message && <span className={styles.error}>{errors.message}</span>}
              </label>
            </div>

            <div className={styles.vDivider} />
            <div className={styles.hDivider} />

            <div className={styles.right}>
              <div className={styles.stamps}>
                <span aria-hidden="true" className={styles.postmark}>
                  <span>
                    mumbai
                    <br />
                    {time ? time.postDate : " "}
                  </span>
                </span>
                <span aria-hidden="true" className={styles.stamp}>
                  <span className={styles.stampImage} />
                  <span className={styles.stampText}>₹5 · yurix</span>
                </span>
              </div>
              <label className={styles.lined}>
                <span className={styles.label}>from</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => setF("name", e.target.value)}
                  autoComplete="name"
                  maxLength={120}
                  placeholder="your name"
                  aria-invalid={errors.name ? true : undefined}
                  className={styles.input}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </label>
              <label className={styles.lined}>
                <span className={styles.label}>reply to</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setF("email", e.target.value)}
                  autoComplete="email"
                  maxLength={254}
                  placeholder="you@email.com"
                  aria-invalid={errors.email ? true : undefined}
                  className={styles.input}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </label>

              {topic?.budget && (
                <div className={`${styles.extra} ${styles.fade}`}>
                  <div className={styles.chipGroup}>
                    <span className={styles.label}>budget</span>
                    <div className={styles.chips}>{chips("budget", budgetOptions)}</div>
                  </div>
                  <div className={styles.chipGroup}>
                    <span className={styles.label}>when do you need it?</span>
                    <div className={styles.chips}>{chips("timing", timingOptions)}</div>
                  </div>
                </div>
              )}
              {topic?.order && (
                <label className={`${styles.lined} ${styles.fade}`}>
                  <span className={styles.label}>order number · optional</span>
                  <input
                    name="orderNo"
                    value={form.orderNo}
                    onChange={(e) => setF("orderNo", e.target.value)}
                    maxLength={120}
                    placeholder="from your confirmation email"
                    className={`${styles.input} ${styles.mono}`}
                  />
                  <span className={styles.hint}>
                    Shipping and returns are in the shop&apos;s <Link href="/shop">small print</Link>.
                  </span>
                </label>
              )}

              {/* Spam guard: people never see or fill this. */}
              <div className={styles.honeypot} aria-hidden="true">
                <label>
                  website
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  />
                </label>
              </div>

              <div className={styles.send}>
                {alert && (
                  <div role="alert" className={styles.alert}>
                    <span className={styles.alertIcon}>!</span>
                    <span>{alert}</span>
                  </div>
                )}
                <button
                  type="submit"
                  data-cursor="send"
                  data-sending={status === "sending" ? "1" : undefined}
                  className={styles.submit}
                >
                  {status === "sending" ? "sending…" : "send it →"}
                </button>
                <span className={styles.footnote}>goes straight to my inbox · reply within a day</span>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.form}>
            <div className={styles.sentLeft}>
              <span className={styles.sentPill}>
                <span className={styles.sentDot} />
                sent
              </span>
              <h2 className={styles.sentHeading}>postcard&apos;s in the mail, {form.name.trim() || "friend"}.</h2>
              <p className={styles.sentText}>
                I&apos;ll write back to {form.email.trim() || "your email"} within a day. If it&apos;s a commission,
                I&apos;ll come back with questions, a rough timeline and a quote.
              </p>
              <div className={styles.sentActions}>
                <button type="button" onClick={again} className={styles.again}>
                  write another
                </button>
                <Link href="/gallery" data-cursor="open" className={styles.galleryLink}>
                  meanwhile, the gallery →
                </Link>
              </div>
            </div>
            <div className={styles.vDivider} />
            <div className={styles.hDivider} />
            <div className={styles.sentRight}>
              <span aria-hidden="true" className={styles.sentStamp}>
                sent!
              </span>
              <dl className={styles.summary}>
                {summary.map(([k, v]) => (
                  <div key={k} className={styles.summaryRow}>
                    <dt className={styles.summaryKey}>{k}</dt>
                    <dd className={styles.summaryValue}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
