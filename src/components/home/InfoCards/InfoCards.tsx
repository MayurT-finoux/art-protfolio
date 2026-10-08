import Link from "next/link";
import type { InfoCard } from "@/lib/placeholder/home";
import styles from "./InfoCards.module.css";

export function InfoCards({ cards }: { cards: InfoCard[] }) {
  return (
    <section data-component="InfoCards" className={styles.section}>
      {cards.map((card) => (
        <Link key={card.label} href={card.href} className={styles.card} data-cursor={card.cursor}>
          <span className={styles.label}>{card.label}</span>
          <span className={styles.title}>{card.title}</span>
          <span className={styles.text}>{card.text}</span>
        </Link>
      ))}
    </section>
  );
}
