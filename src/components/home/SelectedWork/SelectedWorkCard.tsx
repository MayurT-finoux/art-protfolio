"use client";

import type { SelectedArtwork } from "@/lib/placeholder/home";
import { useImageReady } from "@/lib/hooks/useImageReady";
import styles from "./SelectedWork.module.css";
import { bgImage } from "@/lib/bgImage";

export function SelectedWorkCard({ item, n }: { item: SelectedArtwork; n: string }) {
  const ready = useImageReady(item.image);

  return (
    <article className={styles.card} data-cursor={item.animated ? "play" : "view"}>
      <div className={styles.frame} style={{ aspectRatio: item.pin }}>
        {ready ? (
          <>
            <div
              className={styles.image}
              style={{ backgroundImage: bgImage(item.image), backgroundPosition: item.position }}
              role="img"
              aria-label={item.title}
            />
            <span className={styles.kind}>{item.kind}</span>
            {item.animated && (
              <span className={styles.loop}>
                <span className={styles.loopDot} />
                loop
              </span>
            )}
          </>
        ) : (
          <>
            <div className={styles.skeleton} />
            <span className={styles.inking}>inking frame {n}…</span>
          </>
        )}
      </div>
      {ready ? (
        <div className={styles.caption}>
          <span className={styles.captionTitle}>
            <span className={styles.n}>{n}</span>
            <span className={styles.title}>{item.title}</span>
          </span>
          <span className={styles.year}>{item.year}</span>
        </div>
      ) : (
        <div className={styles.captionSkeleton}>
          <span className={styles.barTitle} />
          <span className={styles.barYear} />
        </div>
      )}
    </article>
  );
}
