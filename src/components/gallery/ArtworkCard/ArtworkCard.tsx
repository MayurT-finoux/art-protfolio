"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "../GalleryPage/useMediaQuery";
import { isAnimation, type GalleryItem } from "../GalleryPage/types";
import styles from "./ArtworkCard.module.css";

type Props = { art: GalleryItem; onOpen: () => void };

// Image + title + category. Animation pieces preview while ≥40% in view or hovered.
export function ArtworkCard({ art, onOpen }: Props) {
  const anim = isAnimation(art);
  const cover = art.images[0];
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const playVideo = anim && !!art.previewUrl && !reduced;
  const playing = inView || hover;

  useEffect(() => {
    const node = ref.current;
    if (!anim || !node || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([en]) => setInView(en.isIntersecting), { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [anim]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, playVideo]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  const bg = { backgroundImage: `url("${cover.url}")`, backgroundPosition: cover.focus };

  return (
    <article
      ref={ref}
      data-component="ArtworkCard"
      data-cursor={anim ? "play" : "view"}
      data-inview={anim && inView ? "1" : "0"}
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={art.title}
      onClick={onOpen}
      onKeyDown={onKey}
      onMouseEnter={anim ? () => setHover(true) : undefined}
      onMouseLeave={anim ? () => setHover(false) : undefined}
    >
      <div className={styles.frame} style={{ aspectRatio: art.ratio }}>
        {anim ? (
          <>
            {playVideo ? (
              <video
                ref={videoRef}
                className={styles.video}
                src={art.previewUrl!}
                poster={cover.url}
                style={{ objectPosition: cover.focus }}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
            ) : (
              <div className={styles.preview} style={bg} />
            )}
            <span className={styles.badge}>
              <span className={styles.dot} />
              preview
            </span>
          </>
        ) : (
          <div className={styles.still} style={bg} />
        )}
        {art.images.length > 1 && <span className={styles.multi}>1/{art.images.length}</span>}
      </div>
      <div className={styles.caption}>
        <span className={styles.title}>{art.title}</span>
        <span className={styles.cat}>{art.category}</span>
      </div>
    </article>
  );
}
