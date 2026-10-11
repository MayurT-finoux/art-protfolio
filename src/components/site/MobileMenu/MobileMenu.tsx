"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { NavItem, SocialLink } from "@/lib/placeholder/home";
import { MusicPlayer } from "../MusicPlayer/MusicPlayer";
import styles from "./MobileMenu.module.css";

type Props = {
  items: NavItem[];
  /** Current page's nav href, shown in purple. */
  activeHref?: string;
  wordmark: string;
  email: string;
  instagram: SocialLink;
  track: string;
  onClose: () => void;
};

export function MobileMenu({ items, activeHref, wordmark, email, instagram, track, onClose }: Props) {
  // Lock page scroll and close on Escape while open.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div data-component="MobileMenu" className={styles.menu} role="dialog" aria-modal="true" aria-label="Menu">
      <div className={styles.header}>
        <span className={styles.wordmark}>{wordmark}</span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close menu">
          <span className={styles.closeLine} style={{ transform: "rotate(45deg)" }} />
          <span className={styles.closeLine} style={{ transform: "rotate(-45deg)" }} />
        </button>
      </div>

      <nav className={styles.items}>
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.item}
            data-active={item.href === activeHref || undefined}
            aria-current={item.href === activeHref ? "page" : undefined}
            onClick={onClose}
            style={{ animationDelay: `${60 + i * 60}ms` }}
          >
            {item.label}
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.pills}>
          <a href={instagram.href} target="_blank" rel="noopener noreferrer" className={styles.pill}>
            instagram ↗
          </a>
          <a href={`mailto:${email}`} className={styles.pill}>
            {email}
          </a>
        </div>
        <MusicPlayer track={track} />
      </div>
    </div>
  );
}
