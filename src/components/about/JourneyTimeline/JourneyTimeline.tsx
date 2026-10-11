import type { AboutContent, AboutCopy, AboutLayout } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./JourneyTimeline.module.css";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

const NOTE_BG = ["var(--white)", "var(--accent-tint)", "var(--surface-card)"];

// Year markers on a line: horizontal on desktop, vertical on mobile.
export function JourneyTimeline({ layout, content: c, copy }: Props) {
  const last = c.timeline.length - 1;

  if (layout === "editorial") {
    return (
      <section data-component="JourneyTimeline" className={`${styles.ed} ${t.edRule}`}>
        <header data-reveal="" className={styles.edHeader}>
          <div className={t.edHead}>
            <span className={t.label}>{copy.timeline.label}</span>
            <h2 className={t.edH2}>{copy.timeline.heading}</h2>
          </div>
        </header>
        <div className={styles.edTrack}>
          <div className={styles.edLine} aria-hidden />
          {c.timeline.map((e, i) => (
            <div
              key={e.year + e.title}
              data-reveal=""
              className={styles.edItem}
              data-current={i === last || undefined}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className={styles.edYear}>{e.year}</span>
              <span className={styles.edDot} />
              <div className={styles.edText}>
                <span className={styles.edTitle}>{e.title}</span>
                <span className={styles.edDesc}>{e.line}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section data-component="JourneyTimeline" data-guide="5" className={styles.sk}>
      <header data-reveal="" className={styles.skHeader}>
        <div className={t.skHead}>
          <span className={t.label}>{copy.timeline.label}</span>
          <h2 className={t.skH2}>{copy.timeline.heading}</h2>
        </div>
      </header>
      <div className={styles.skTrack}>
        <div className={styles.skLine} aria-hidden />
        {c.timeline.map((e, i) => (
          <div
            key={e.year + e.title}
            data-reveal=""
            className={styles.skItem}
            data-odd={i % 2 === 1 || undefined}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <span className={styles.skYear}>{e.year}</span>
            <span className={styles.skDot} />
            <div className={styles.skNote} style={{ background: NOTE_BG[i % NOTE_BG.length] }}>
              <span className={styles.skTape} />
              <div className={styles.skTitle}>{e.title}</div>
              <p className={styles.skDesc}>{e.line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
