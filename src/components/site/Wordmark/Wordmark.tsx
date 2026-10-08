import styles from "./Wordmark.module.css";

export function Wordmark({ text }: { text: string }) {
  return (
    <div data-component="Wordmark" className={styles.wrap} aria-hidden>
      <div className={styles.text}>{text}</div>
    </div>
  );
}
