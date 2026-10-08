import styles from "./HeroIntro.module.css";

type Props = {
  label: string;
  heading: string;
  intro: string;
  scrollHint: string;
  scrollHintMobile: string;
};

// Intro text over the hero; fades and lifts away with --p.
export function HeroIntro({ label, heading, intro, scrollHint, scrollHintMobile }: Props) {
  return (
    <div data-component="HeroIntro" className={styles.intro}>
      <div className={styles.scrim} aria-hidden />
      <div className={styles.text}>
        <div className={styles.label}>{label}</div>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.body}>{intro}</p>
      </div>
      <div className={styles.hint} aria-hidden>
        <span className={styles.mouse}>
          <span className={styles.dot} />
        </span>
        <span className={styles.hintText}>
          <span className={styles.desktopOnly}>{scrollHint}</span>
          <span className={styles.mobileOnly}>{scrollHintMobile}</span>
        </span>
      </div>
    </div>
  );
}
