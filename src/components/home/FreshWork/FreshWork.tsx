import type { FreshItem } from "@/lib/placeholder/home";
import { FreshWorkCard } from "./FreshWorkCard";
import styles from "./FreshWork.module.css";

type Props = {
  label: string;
  heading: string;
  followButton: string;
  followHref: string;
  items: FreshItem[];
};

// The 3 newest live artworks + the 3 newest Instagram posts.
export function FreshWork({ label, heading, followButton, followHref, items }: Props) {
  return (
    <section data-component="FreshWork" data-anchor="fresh" className={styles.section}>
      <header className={styles.header}>
        <div className={styles.titles}>
          <span className={styles.label}>{label}</span>
          <h2 className={styles.heading}>{heading}</h2>
        </div>
        <a href={followHref} target="_blank" rel="noopener noreferrer" className={styles.follow} data-cursor="follow">
          {followButton}
        </a>
      </header>
      <div className={styles.grid}>
        {items.map((item, i) => (
          <FreshWorkCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}
