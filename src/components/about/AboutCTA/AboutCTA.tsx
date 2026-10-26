import Link from "next/link";
import type { AboutContent, AboutCopy, AboutLayout } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./AboutCTA.module.css";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

// Closing call to action → contact page.
export function AboutCTA({ layout, content: c, copy }: Props) {
  const [button] = c.ctaButtons;

  if (layout === "editorial") {
    return (
      <section data-component="AboutCTA" className={styles.ed}>
        <div className={styles.panel}>
          <span data-reveal="" className={`${t.label} ${styles.edLabel}`}>
            {copy.cta.label}
          </span>
          <h2 data-reveal="" className={styles.edH2}>
            {c.ctaHeading} {c.ctaHeadingAccent}.
          </h2>
          <div data-reveal="" className={styles.edRow}>
            <p className={styles.edText}>{c.ctaText}</p>
            <Link href={button.href} data-cursor={button.cursor} className={styles.edButton}>
              {button.label}
            </Link>
          </div>
          <svg data-motion="" viewBox="0 0 100 100" className={styles.spin} aria-hidden>
            <path d="M50 4 L58 38 L94 50 L58 62 L50 96 L42 62 L6 50 L42 38 Z" />
          </svg>
        </div>
      </section>
    );
  }

  return (
    <section data-component="AboutCTA" data-guide="9" className={styles.sk}>
      <div data-reveal="" className={styles.skInner}>
        <span className={t.label}>{copy.cta.label}</span>
        <h2 className={styles.skH2}>
          {c.ctaHeading}{" "}
          <span className={styles.accent}>
            {c.ctaHeadingAccent}
            <svg data-draw="" viewBox="0 0 300 26" preserveAspectRatio="none" className={styles.underline} aria-hidden>
              <path pathLength={1} d="M4 12 C 50 22, 90 2, 140 14 S 230 22, 296 8" />
            </svg>
          </span>
        </h2>
        <p className={styles.skText}>{c.ctaText}</p>
        <Link href={button.href} data-cursor={button.cursor} className={styles.skButton}>
          {button.label}
        </Link>
        <span className={styles.note}>{c.ctaNote}</span>
      </div>
    </section>
  );
}
