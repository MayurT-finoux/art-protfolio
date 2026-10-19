"use client";

import { useState } from "react";
import type { ProjectImage } from "@/lib/placeholder/work";
import styles from "./ProjectVideo.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = {
  heading: string;
  hint: string;
  title: string;
  youtubeId: string;
  poster: ProjectImage;
};

// YouTube embed: a poster with a play button; the youtube-nocookie iframe
// only loads after a click.
export function ProjectVideo({ heading, hint, title, youtubeId, poster }: Props) {
  const [on, setOn] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`;

  return (
    <section data-component="ProjectVideo" className={styles.section}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.frame}>
        {on ? (
          <iframe
            className={styles.iframe}
            src={src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={styles.play}
            onClick={() => setOn(true)}
            data-cursor="play"
            aria-label="Play video"
          >
            <span
              className={styles.poster}
              style={{ backgroundImage: bgImage(poster.url), backgroundPosition: poster.position }}
            />
            <span className={styles.circle}>
              <svg className={styles.icon} viewBox="0 0 14 14" aria-hidden>
                <path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z" fill="#131316" />
              </svg>
            </span>
            <span className={styles.caption}>
              {title} · {hint}
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
