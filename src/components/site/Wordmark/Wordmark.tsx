"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import styles from "./Wordmark.module.css";

const CLICKS = 3;
const WINDOW_MS = 600;

// Hidden shortcut: 3 quick clicks on the footer wordmark open /admin.
// Not a security measure; /admin is protected by its own login.
export function Wordmark({ text }: { text: string }) {
  const router = useRouter();
  const clicks = useRef<number[]>([]);

  const onClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < WINDOW_MS), now];
    if (clicks.current.length >= CLICKS) {
      clicks.current = [];
      router.push("/admin");
    }
  };

  return (
    <div data-component="Wordmark" className={styles.wrap} aria-hidden>
      <div className={styles.text} onClick={onClick}>
        {text}
      </div>
    </div>
  );
}
