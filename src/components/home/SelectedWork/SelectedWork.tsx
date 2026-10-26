import Link from "next/link";
import type { SelectedArtwork } from "@/lib/placeholder/home";
import { SelectedWorkCard } from "./SelectedWorkCard";
import styles from "./SelectedWork.module.css";

type Props = {
  label: string;
  labelMobile: string;
  heading: string;
  button: { label: string; href: string };
  items: SelectedArtwork[];
};

// Featured artworks (6–8, in featuredOrder) as a Pinterest-style masonry.
export function SelectedWork({ label, labelMobile, heading, button, items }: Props) {
  const count = String(items.length).padStart(2, "0");

  return (
    <section data-component="SelectedWork" data-anchor="selected" className={styles.section}>
      <header className={styles.header}>
        <div className={styles.titles}>
          <span className={styles.label}>
            {count} pieces · <span className={styles.desktopOnly}>{label}</span>
            <span className={styles.mobileOnly}>{labelMobile}</span>
          </span>
          <h2 className={styles.heading}>{heading}</h2>
        </div>
        <Link href={button.href} className={styles.button} data-cursor="go">
          {button.label}
        </Link>
      </header>

      <div className={styles.grid}>
        {items.map((item, i) => (
          <SelectedWorkCard key={item.title} item={item} n={String(i + 1).padStart(2, "0")} />
        ))}
      </div>

      <Link href={button.href} className={styles.buttonMobile}>
        {button.label}
      </Link>
    </section>
  );
}
