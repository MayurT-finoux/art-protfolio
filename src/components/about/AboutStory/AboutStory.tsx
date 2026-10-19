import type { CSSProperties } from "react";
import type { AboutContent, AboutCopy, AboutLayout } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./AboutStory.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

// Editorial margin marks, one per paragraph (cycled).
const MARKS = [
  "M20 4 L20 36 M6 12 L34 28 M34 12 L6 28",
  "M4 22 C 10 8, 18 8, 20 20 S 30 32, 36 18",
  "M20 6 C 30 6, 34 14, 34 20 C 34 30, 26 34, 20 34 C 12 34, 6 28, 6 20 C 6 14, 12 10, 18 12",
  "M6 20 L34 20 M24 10 L34 20 L24 30",
];
const SKETCH_ROT = ["-4deg", "3deg", "-2deg"];

export function AboutStory({ layout, content: c, copy }: Props) {
  if (layout === "editorial") {
    return (
      <section data-component="AboutStory" className={`${styles.ed} ${t.edRule}`}>
        <div className={styles.edAside}>
          <div data-reveal="" className={styles.edSticky}>
            <span className={t.label}>{copy.story.label}</span>
            <p className={styles.quote}>&quot;{c.storyQuote}&quot;</p>
          </div>
        </div>
        <div className={styles.edBody}>
          {c.storyParagraphs.map((p, i) => (
            <div key={p.lead} data-reveal="" className={styles.edPara}>
              <svg data-draw="" viewBox="0 0 40 40" className={styles.mark} aria-hidden>
                <path pathLength={1} d={MARKS[i % MARKS.length]} />
              </svg>
              <p className={styles.edText}>
                <strong>{p.lead}</strong> {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section data-component="AboutStory" data-guide="1" className={styles.sk}>
      <div className={styles.skBody}>
        <div data-reveal="" className={t.skHead}>
          <span className={t.label}>{copy.story.label}</span>
          <h2 className={t.skH2}>{copy.story.heading}</h2>
        </div>
        {c.storyParagraphs.map((p) => (
          <div key={p.lead} data-reveal="" className={styles.skPara}>
            <p className={styles.skText}>
              <strong>{p.lead}</strong> {p.text}
            </p>
            {p.doodle && (
              <svg data-draw="" viewBox="0 0 240 30" className={styles.doodle} aria-hidden>
                <path pathLength={1} d="M4 15 C 24 2, 34 28, 54 15 S 84 2, 104 15 S 134 28, 154 15 S 184 2, 204 15 L 236 15" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className={styles.sketches}>
        {c.storySketches.map((s, i) => (
          <div
            key={s.caption}
            data-reveal=""
            className={styles.sketch}
            style={{ "--w": s.width, transitionDelay: `${i * 120}ms` } as CSSProperties}
          >
            <div className={styles.polaroid} style={{ transform: `rotate(${SKETCH_ROT[i % SKETCH_ROT.length]})` }}>
              <span className={styles.tape} />
              <div
                className={styles.frame}
                style={{ aspectRatio: s.ratio, backgroundImage: bgImage(s.image), backgroundPosition: s.position }}
                aria-hidden
              />
              <span className={styles.caption}>{s.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
