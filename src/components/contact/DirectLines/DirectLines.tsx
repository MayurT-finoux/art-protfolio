"use client";

import { useEffect, useRef, useState } from "react";
import { useMumbaiTime } from "../ContactPage/useMumbaiTime";
import styles from "./DirectLines.module.css";

type Props = { email: string; instagramHandle: string; instagramHref: string; note: string };

// "or skip the form": email (copy), Instagram DM, studio with the live Mumbai clock.
export function DirectLines({ email, instagramHandle, instagramHref, note }: Props) {
  const time = useMumbaiTime();
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const timers = useRef<{ copy?: number; toast?: number }>({});

  useEffect(() => {
    const t = timers.current;
    return () => {
      window.clearTimeout(t.copy);
      window.clearTimeout(t.toast);
    };
  }, []);

  const copyEmail = () => {
    try {
      void navigator.clipboard?.writeText(email).catch(() => {});
    } catch {}
    const t = timers.current;
    window.clearTimeout(t.copy);
    window.clearTimeout(t.toast);
    setCopied(true);
    setToast("email copied");
    t.copy = window.setTimeout(() => setCopied(false), 2000);
    t.toast = window.setTimeout(() => setToast(""), 2000);
  };

  return (
    <aside data-component="DirectLines" className={styles.lines}>
      <h2 className={styles.heading}>or skip the form</h2>
      <div className={styles.list}>
        <div className={styles.row}>
          <span className={styles.col}>
            <span className={styles.label}>email</span>
            <a href={`mailto:${email}`} className={styles.value}>
              {email}
            </a>
          </span>
          <button type="button" onClick={copyEmail} data-cursor="copy" className={styles.copy}>
            {copied ? "copied ✓" : "copy"}
          </button>
        </div>
        <a href={instagramHref} target="_blank" rel="noopener noreferrer" data-cursor="dm" className={`${styles.row} ${styles.link}`}>
          <span className={styles.col}>
            <span className={styles.label}>instagram · DMs open, a bit slower</span>
            <span className={styles.value}>{instagramHandle}</span>
          </span>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </a>
        <div className={`${styles.row} ${styles.last}`}>
          <span className={styles.col}>
            <span className={styles.label}>studio · mumbai, IN</span>
            <span className={styles.value}>it&apos;s {time ? time.clock : "…"} here</span>
          </span>
          <span className={styles.awake} data-awake={time ? (time.awake ? "1" : "0") : undefined}>
            <span className={styles.awakeDot} />
            {time ? (time.awake ? "awake, probably drawing" : "asleep · replies at 9") : "awake, probably drawing"}
          </span>
        </div>
      </div>
      <p className={styles.note}>{note}</p>
      {toast && (
        <div role="status" className={styles.toast}>
          <span className={styles.toastDot} />
          {toast}
        </div>
      )}
    </aside>
  );
}
