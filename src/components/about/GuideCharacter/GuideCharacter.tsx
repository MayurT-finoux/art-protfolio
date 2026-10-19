"use client";

import { useEffect, useState } from "react";
import styles from "./GuideCharacter.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = { image: string; lines: string[] };

// Sketchbook only: a character in the bottom-left corner whose speech bubble
// follows the section in the middle of the viewport (sections carry
// data-guide="<index>", one line per section).
export function GuideCharacter({ image, lines }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setIndex(Number(e.target.getAttribute("data-guide")) || 0);
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-guide]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div data-component="GuideCharacter" className={styles.guide} aria-hidden>
      <div data-motion="" className={styles.avatar} style={{ backgroundImage: bgImage(image) }} />
      <div className={styles.bubble}>{lines[index] ?? lines[0]}</div>
    </div>
  );
}
