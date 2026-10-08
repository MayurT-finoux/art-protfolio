"use client";

import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

// Desktop cursor: a 16px white dot (mix-blend-mode: difference) that grows
// into an 84px purple disc with a label over any [data-cursor] element.
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const root = rootRef.current!;
    const blob = blobRef.current!;
    const label = labelRef.current!;
    const html = document.documentElement;
    html.dataset.cursor = "on";

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      root.style.opacity = "1";
      root.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const target = e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
      const text = target?.getAttribute("data-cursor") ?? "";
      blob.dataset.active = text ? "true" : "false";
      if (text) label.textContent = text;
    };
    const onLeave = () => {
      root.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    html.addEventListener("pointerleave", onLeave);
    return () => {
      delete html.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
      html.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden>
      <div ref={blobRef} className={styles.blob} data-active="false">
        <span ref={labelRef} className={styles.label} />
      </div>
    </div>
  );
}
