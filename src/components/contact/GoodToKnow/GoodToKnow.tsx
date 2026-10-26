import type { ContactFact } from "@/lib/placeholder/contact";
import styles from "./GoodToKnow.module.css";

type Props = { facts: ContactFact[] };

export function GoodToKnow({ facts }: Props) {
  return (
    <section data-component="GoodToKnow" className={styles.section}>
      <h2 className={styles.heading}>before you write</h2>
      <div className={styles.grid}>
        {facts.map((x, i) => (
          <div key={x.title} className={styles.fact}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.title}>{x.title}</span>
            <span className={styles.text}>{x.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
