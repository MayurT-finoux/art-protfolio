"use client";

import { useSyncExternalStore } from "react";

// Current minute on the client. The server (and hydration) render `null`, so no
// `Date.now()` runs during prerender; components show a stable placeholder until mount.
const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 5000);
  return () => window.clearInterval(id);
};
const minute = () => Math.floor(Date.now() / 60000);
const none = () => null;

const TZ = "Asia/Kolkata";

/** Mumbai time: clock ("4:05 pm"), awake (9:00–24:00) and postmark date ("19 OCT 26"). */
export function useMumbaiTime() {
  const m = useSyncExternalStore(subscribe, minute, none);
  if (m === null) return null;
  const d = new Date(m * 60000);
  const clock = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true })
    .formatToParts(d)
    .map((p) => p.value)
    .join("")
    .replace(/\s?(am|pm)/i, (x) => " " + x.trim().toLowerCase());
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hour12: false }).format(d));
  const postDate = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "2-digit", month: "short", year: "2-digit" })
    .format(d)
    .toUpperCase();
  return { clock, awake: hour >= 9 && hour < 24, postDate };
}
