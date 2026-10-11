import type { AboutContent, AboutCopy, AboutLayout } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./ProcessSteps.module.css";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

const ROT = ["-2deg", "1.5deg", "-1deg", "2.2deg", "-1.6deg", "1deg"];
const num = (i: number) => `0${i + 1}`;

// Sketch → line art → colour → animation, one image per step.
export function ProcessSteps({ layout, content: c, copy }: Props) {
  if (layout === "editorial") {
    return (
      <section data-component="ProcessSteps" className={`${styles.ed} ${t.edRule}`}>
        <header data-reveal="" className={`${t.edHead} ${styles.edHeader}`}>
          <span className={t.label}>{copy.process.label}</span>
          <h2 className={t.edH2}>{copy.process.heading}</h2>
        </header>
        <div data-scroller="" className={styles.edGrid}>
          {c.process.map((p, i) => (
            <div key={p.title} data-reveal="" className={styles.edStep} style={{ transitionDelay: `${i * 110}ms` }}>
              <div className={styles.edTop}>
                <span className={styles.edNum}>{num(i)}</span>
                <span className={styles.edTitle}>{p.title}</span>
              </div>
              <div
                className={styles.edFrame}
                style={{ backgroundImage: `url("${p.image}")`, backgroundPosition: p.position }}
                aria-hidden
              />
              <p className={styles.edLine}>{p.line}</p>
            </div>
          ))}
        </div>
        <span className={`${t.swipe} ${styles.edSwipe}`}>{copy.swipe}</span>
      </section>
    );
  }

  return (
    <section data-component="ProcessSteps" data-guide="3" className={styles.sk}>
      <header data-reveal="" className={`${t.skHead} ${styles.skHeader}`}>
        <span className={t.label}>{copy.process.label}</span>
        <h2 className={t.skH2}>{copy.process.heading}</h2>
      </header>
      <div className={styles.skRow}>
        <div data-reveal="" className={styles.path} aria-hidden>
          <svg data-draw="" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path pathLength={1} d="M0 30 C 150 0, 250 60, 400 30 S 650 0, 800 30 S 1050 60, 1200 30" />
          </svg>
        </div>
        {c.process.map((p, i) => (
          <div key={p.title} data-reveal="" className={styles.skStep} style={{ transitionDelay: `${i * 110}ms` }}>
            <div className={styles.skCard} style={{ transform: `rotate(${ROT[(i + 1) % ROT.length]})` }}>
              <span className={styles.skTape} />
              <div
                className={styles.skFrame}
                style={{ backgroundImage: `url("${p.image}")`, backgroundPosition: p.position }}
                aria-hidden
              />
              <div className={styles.skTitleRow}>
                <span className={styles.skNum}>{num(i)}</span>
                <span className={styles.skTitle}>{p.title}</span>
              </div>
              <p className={styles.skLine}>{p.line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
