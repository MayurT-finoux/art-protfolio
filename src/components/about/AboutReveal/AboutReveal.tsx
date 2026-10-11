"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { AboutLayout } from "@/lib/placeholder/about";
import styles from "./AboutReveal.module.css";

type Props = { layout: AboutLayout; className?: string; children: ReactNode };

// Page wrapper for both About layouts. It is the `cqw` container, and it runs
// the designs' scroll reveal: once mounted it sets data-ready (which hides
// every [data-reveal]), then marks each one data-in="1" as it enters the
// viewport. [data-draw] SVG paths inside a revealed element draw themselves in.
export function AboutReveal({ layout, className, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    root.setAttribute("data-ready", "1");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "1");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    root.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`${styles.root} ${styles[layout]} ${className ?? ""}`}>
      {children}
    </div>
  );
}
