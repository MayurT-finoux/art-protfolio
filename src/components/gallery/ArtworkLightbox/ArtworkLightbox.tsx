"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery, useReducedMotion } from "../GalleryPage/useMediaQuery";
import { isAnimation, type GalleryItem } from "../GalleryPage/types";
import styles from "./ArtworkLightbox.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = {
  art: GalleryItem;
  view: number;
  position: string;
  onView: (view: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Desktop: centred window over a blurred backdrop. Mobile: full-screen sheet.
// Esc closes, ← → step through the current filter, background scroll is locked.
export function ArtworkLightbox({ art, view, position, onView, onPrev, onNext, onClose }: Props) {
  const mobile = useMediaQuery("(max-width: 767px)");
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const keys = useRef({ onPrev, onNext, onClose });
  useEffect(() => {
    keys.current = { onPrev, onNext, onClose };
  });

  // Scroll lock + focus in / focus back.
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = prevOverflow;
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") keys.current.onClose();
      else if (e.key === "ArrowRight") keys.current.onNext();
      else if (e.key === "ArrowLeft") keys.current.onPrev();
      else if (e.key === "Tab" && dialogRef.current) {
        // Keep focus inside the dialog.
        const nodes = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const inside = dialogRef.current.contains(document.activeElement);
        if (e.shiftKey && (document.activeElement === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Keep the close button focused when the layout switches.
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, [mobile]);

  const anim = isAnimation(art);
  const image = art.images[view];
  const showVideo = anim && !!art.previewUrl && view === 0 && !reduced;

  const media = (
    <>
      {showVideo ? (
        <video
          className={styles.video}
          src={art.previewUrl!}
          poster={image.url}
          autoPlay
          muted
          loop
          playsInline
          aria-label={`${art.title} · muted loop`}
        />
      ) : (
        <div
          className={anim ? `${styles.image} ${styles.boil}` : styles.image}
          style={{ backgroundImage: bgImage(image.url) }}
          role="img"
          aria-label={image.label ? `${art.title} · ${image.label}` : art.title}
        />
      )}
      {anim && !mobile && (
        <span className={styles.loop}>
          <span className={styles.dot} />
          muted loop
        </span>
      )}
      {image.label && <span className={styles.viewLabel}>{image.label}</span>}
    </>
  );

  const thumbs = art.images.map((im, j) => (
    <button
      key={j}
      type="button"
      className={styles.thumb}
      aria-label={im.label || `image ${j + 1}`}
      aria-pressed={j === view}
      onClick={() => onView(j)}
    >
      <span
        className={j === view ? `${styles.thumbImg} ${styles.thumbOn}` : styles.thumbImg}
        style={{ backgroundImage: bgImage(im.url), backgroundPosition: im.focus }}
      />
      {!mobile && im.label && <span className={styles.thumbLabel}>{im.label}</span>}
    </button>
  ));

  const tag = (
    <span className={styles.tag}>
      {art.category}
      {art.year ? ` · ${art.year}` : ""}
    </span>
  );

  const materials = art.materials.length > 0 && (
    <div className={styles.group}>
      <span className={styles.groupLabel}>materials</span>
      <div className={styles.materials}>
        {art.materials.map((m) => (
          <span key={m} className={styles.material}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );

  const links = art.links.map((l) => (
    <a
      key={l.label}
      href={l.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
      data-cursor={mobile ? undefined : "open"}
    >
      {l.label} ↗
    </a>
  ));

  const close = (
    <button ref={closeRef} type="button" className={styles.close} aria-label="Close" data-cursor="close" onClick={onClose}>
      <span />
      <span />
    </button>
  );

  if (mobile) {
    return (
      <div
        ref={dialogRef}
        data-component="ArtworkLightbox"
        role="dialog"
        aria-modal="true"
        aria-label={art.title}
        className={styles.sheet}
      >
        <div className={styles.sheetHead}>
          <span className={styles.position}>{position}</span>
          {close}
        </div>
        <div className={styles.sheetBody}>
          <div className={styles.sheetMedia}>{media}</div>
          <div className={styles.sheetThumbs}>{thumbs}</div>
          <div className={styles.sheetInfo}>
            {tag}
            <h2 className={styles.title}>{art.title}</h2>
            {art.description && <p className={styles.desc}>{art.description}</p>}
            {materials}
            {links.length > 0 && <div className={styles.sheetLinks}>{links}</div>}
            <div className={styles.steps}>
              <button type="button" className={styles.prev} onClick={onPrev}>
                ← prev
              </button>
              <button type="button" className={styles.next} onClick={onNext}>
                next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-component="ArtworkLightbox" className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={art.title} className={styles.dialog}>
        <div className={styles.mediaCol}>
          <div className={styles.stage}>
            {media}
            <button type="button" className={`${styles.arrow} ${styles.arrowPrev}`} aria-label="Previous artwork" data-cursor="prev" onClick={onPrev}>
              ←
            </button>
            <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} aria-label="Next artwork" data-cursor="next" onClick={onNext}>
              →
            </button>
          </div>
          <div className={styles.thumbs}>{thumbs}</div>
        </div>
        <aside className={styles.aside}>
          {close}
          {tag}
          <h2 className={styles.title}>{art.title}</h2>
          {art.description && <p className={styles.desc}>{art.description}</p>}
          {materials}
          {links.length > 0 && (
            <div className={styles.group}>
              <span className={styles.groupLabel}>also on</span>
              <div className={styles.links}>{links}</div>
            </div>
          )}
          <span className={styles.position}>{position}</span>
        </aside>
      </div>
    </div>
  );
}
