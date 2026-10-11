"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem, SocialLink } from "@/lib/placeholder/home";
import { MobileMenu } from "../MobileMenu/MobileMenu";
import styles from "./MainNav.module.css";

type Props = {
  items: NavItem[];
  wordmark: string;
  email: string;
  instagram: SocialLink;
  track: string;
};

// Items fade and drop in as the Home hero completes (--p, see globals.css).
// Desktop item i starts at p = 0.40 + 0.05·i; the mobile button at p = 0.50.
export function MainNav({ items, wordmark, email, instagram, track }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Current section: "/work/moth-lullaby" → "/work".
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav data-component="MainNav" className={styles.nav}>
        <div className={styles.blur} aria-hidden />
        <div className={styles.bar}>
          <div className={styles.items}>
            {items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.item}
                data-active={isActive(item.href) || undefined}
                aria-current={isActive(item.href) ? "page" : undefined}
                data-cursor={isActive(item.href) ? undefined : "go"}
                style={{ "--start": 0.4 + i * 0.05 } as React.CSSProperties}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className={styles.menuLineTop} />
            <span className={styles.menuLineBottom} />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <MobileMenu
          items={items}
          activeHref={items.find((i) => isActive(i.href))?.href}
          wordmark={wordmark}
          email={email}
          instagram={instagram}
          track={track}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
