import Link from "next/link";
import styles from "./AboutSection.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = {
  video: string | null;
  still: string;
  windowLabel: string;
  label: string;
  paragraphs: string[];
  buttons: { label: string; href: string; cursor: string }[];
};

// Floating, tilted "window" with a muted loop, next to a short bio.
export function AboutSection({ video, still, windowLabel, label, paragraphs, buttons }: Props) {
  const [primary, secondary] = buttons;

  return (
    <section data-component="AboutSection" data-anchor="about" className={styles.section}>
      <div className={styles.tilt}>
        <div className={styles.window}>
          <div className={styles.titleBar}>
            <span>{windowLabel}</span>
            <span className={styles.loop}>
              <span className={styles.loopDot} />
              loop
            </span>
          </div>
          {video ? (
            <video className={styles.media} src={video} poster={still || undefined} autoPlay muted loop playsInline aria-hidden />
          ) : (
            <div className={`${styles.media} ${styles.still}`} style={{ backgroundImage: bgImage(still) }} aria-hidden />
          )}
        </div>
      </div>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {paragraphs.map((p) => (
          <p key={p} className={styles.paragraph}>
            {p}
          </p>
        ))}
        <div className={styles.buttons}>
          <Link href={primary.href} className={styles.primary} data-cursor={primary.cursor}>
            {primary.label}
          </Link>
          <Link href={secondary.href} className={styles.secondary} data-cursor={secondary.cursor}>
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
