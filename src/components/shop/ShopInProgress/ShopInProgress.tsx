import Link from "next/link";
import styles from "./ShopInProgress.module.css";

type Props = { label: string; heading: string; intro: string; button: { label: string; href: string } };

// Placeholder until the Shop (ShopStudioTable design) is built — Yurix's request (2026-11-18).
// Not in the design: it reuses the Work page header styles so it looks like the rest of the site.
export function ShopInProgress({ label, heading, intro, button }: Props) {
  return (
    <section data-component="ShopInProgress" className={styles.section}>
      <span className={styles.label}>{label}</span>
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.intro}>{intro}</p>
      <Link href={button.href} className={styles.button}>
        {button.label}
      </Link>
    </section>
  );
}
