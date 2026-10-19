import styles from "./HeroAnimation.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = {
  /** Looping MP4 (1920×1080). Until one is uploaded, the still is shown. */
  video: string | null;
  /** Still frame: video poster and the reduced-motion image. */
  still: string;
};

// Full-screen background behind all content. Blurs and scales with --p,
// then washes to white further down the page (--w).
export function HeroAnimation({ video, still }: Props) {
  return (
    <div data-component="HeroAnimation" className={styles.hero} aria-hidden>
      <div className={styles.motion}>
        <div className={video ? styles.stillUnderVideo : styles.still} style={{ backgroundImage: bgImage(still) }} />
        {video && (
          <video className={styles.video} src={video} poster={still || undefined} autoPlay muted loop playsInline preload="auto" />
        )}
      </div>
      <div className={styles.wash} />
    </div>
  );
}
