"use client";

import type { FreshItem } from "@/lib/placeholder/home";
import { useImageReady } from "@/lib/hooks/useImageReady";
import styles from "./FreshWork.module.css";

export function FreshWorkCard({ item }: { item: FreshItem }) {
  const ready = useImageReady(item.image);

  const content = (
    <>
      <div className={styles.frame}>
        {ready ? (
          <>
            <div
              className={styles.image}
              style={{ backgroundImage: `url("${item.image}")`, backgroundPosition: item.position }}
              role="img"
              aria-label={item.title}
            />
            {item.isNew && <span className={styles.new}>new</span>}
            {item.instagram && (
              <span className={styles.ig}>
                <span className={styles.desktopOnly}>instagram ↗</span>
                <span className={styles.mobileOnly}>IG ↗</span>
              </span>
            )}
          </>
        ) : (
          <div className={styles.skeleton} />
        )}
      </div>
      {ready ? (
        <div className={styles.caption}>
          <span className={styles.title}>{item.title}</span>
          <span className={styles.when}>{item.when}</span>
        </div>
      ) : (
        <span className={styles.captionSkeleton} />
      )}
    </>
  );

  if (item.instagram && item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.card} data-cursor="open">
        {content}
      </a>
    );
  }
  return (
    <article className={styles.card} data-cursor="view">
      {content}
    </article>
  );
}
