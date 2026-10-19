import type { AboutContent, AboutCopy, AboutLayout } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./FunFacts.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

const NOTE_BG = ["var(--accent-tint)", "var(--white)", "var(--surface-card)", "var(--accent-tint)"];
const NOTE_ROT = ["-2deg", "1.5deg", "1deg", "-1.5deg"];

// Workspace photo + question/answer notes.
export function FunFacts({ layout, content: c, copy }: Props) {
  const desk = { backgroundImage: bgImage(c.deskImage) };

  if (layout === "editorial") {
    return (
      <section data-component="FunFacts" className={`${styles.ed} ${t.edRule}`}>
        <header data-reveal="" className={`${styles.header} ${styles.edHeader}`}>
          <div className={t.edHead}>
            <span className={t.label}>{copy.facts.label}</span>
            <h2 className={t.edH2}>{copy.facts.heading}</h2>
          </div>
        </header>
        <div className={styles.edRow}>
          <div data-reveal="" className={styles.edPhoto}>
            <div className={styles.edFrame} style={desk} aria-hidden />
          </div>
          <dl className={styles.edList}>
            {c.facts.map((f, i) => (
              <div key={f.q} data-reveal="" className={styles.edFact} style={{ transitionDelay: `${i * 90}ms` }}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }

  return (
    <section data-component="FunFacts" data-guide="7" className={styles.sk}>
      <header data-reveal="" className={`${styles.header} ${styles.skHeader}`}>
        <div className={t.skHead}>
          <span className={t.label}>{copy.facts.label}</span>
          <h2 className={t.skH2}>{copy.facts.heading}</h2>
        </div>
      </header>
      <div className={styles.skRow}>
        <div data-reveal="" className={styles.skPhoto}>
          <div className={styles.polaroid}>
            <span className={`${styles.tape} ${styles.tapeLeft}`} />
            <span className={`${styles.tape} ${styles.tapeRight}`} />
            <div className={styles.skFrame} style={desk} aria-hidden />
            <span className={styles.caption}>{c.deskCaption}</span>
          </div>
        </div>
        <div className={styles.notes}>
          {c.facts.map((f, i) => (
            <div key={f.q} data-reveal="" style={{ transitionDelay: `${i * 90}ms` }}>
              <div
                className={styles.note}
                style={{ background: NOTE_BG[i % NOTE_BG.length], transform: `rotate(${NOTE_ROT[i % NOTE_ROT.length]})` }}
              >
                <span className={styles.noteTape} />
                <span className={styles.q}>{f.q}</span>
                <span className={styles.a}>{f.a}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
