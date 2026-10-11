import Link from "next/link";
import type { CSSProperties } from "react";
import type { AboutContent, AboutCopy, AboutLayout, AboutMedium } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./MediumsShowcase.module.css";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

const ROT = ["-2deg", "1.5deg", "-1deg", "2.2deg", "-1.6deg", "1deg"];
const num = (i: number) => `0${i + 1}`;
const bg = (m: AboutMedium) => ({ backgroundImage: `url("${m.image}")`, backgroundPosition: m.position });

// One card / row per medium. Mediums flagged `soon` show a tag and no link.
export function MediumsShowcase({ layout, content: c, copy }: Props) {
  return layout === "sketchbook" ? (
    <Sketchbook mediums={c.mediums} copy={copy} />
  ) : (
    <Editorial mediums={c.mediums} copy={copy} />
  );
}

function Sketchbook({ mediums, copy }: { mediums: AboutMedium[]; copy: AboutCopy }) {
  return (
    <section data-component="MediumsShowcase" data-guide="2" className={styles.sk}>
      <header data-reveal="" className={styles.header}>
        <div className={t.skHead}>
          <span className={t.label}>{copy.mediums.label}</span>
          <h2 className={t.skH2}>{copy.mediums.heading}</h2>
        </div>
      </header>
      <div data-scroller="" className={styles.skGrid}>
        {mediums.map((m, i) => (
          <div
            key={m.name}
            data-reveal=""
            className={styles.skItem}
            style={{ "--rot": ROT[i % ROT.length], "--rotM": i % 2 ? "1.5deg" : "-1.5deg", transitionDelay: `${(i % 3) * 80}ms` } as CSSProperties}
          >
            {m.soon ? (
              <div className={styles.skSoon}>
                <span className={styles.skSoonName}>{m.name}</span>
                <span className={styles.stamp}>coming soon</span>
                <span className={styles.skSoonLine}>{m.line}</span>
              </div>
            ) : (
              <Link href={m.href} data-cursor="view" className={styles.skCard}>
                <span className={styles.skTape} />
                <div className={styles.skFrame}>
                  <div data-jitter="" className={styles.jitter} style={bg(m)} aria-hidden />
                  {m.animated && (
                    <span className={styles.skLoop}>
                      <span data-motion="" className={styles.skLoopDot} />
                      loop
                    </span>
                  )}
                </div>
                <div className={styles.skNameRow}>
                  <span className={styles.skName}>{m.name}</span>
                  <span className={styles.skWhat}>{m.what}</span>
                </div>
                <p className={styles.skLine}>{m.line}</p>
                <span className={styles.skCount}>{m.count} pieces in the gallery →</span>
              </Link>
            )}
          </div>
        ))}
      </div>
      <span className={`${t.swipe} ${styles.skSwipe}`}>{copy.swipe}</span>
    </section>
  );
}

function Editorial({ mediums, copy }: { mediums: AboutMedium[]; copy: AboutCopy }) {
  return (
    <section data-component="MediumsShowcase" className={`${styles.ed} ${t.edRule}`}>
      <header data-reveal="" className={`${styles.header} ${styles.edHeader}`}>
        <div className={t.edHead}>
          <span className={t.label}>{copy.mediums.label}</span>
          <h2 className={t.edH2}>{copy.mediums.heading}</h2>
        </div>
      </header>

      {/* Desktop: index rows */}
      <div className={styles.edRows}>
        {mediums.map((m, i) =>
          m.soon ? (
            <div key={m.name} data-reveal="">
              <div className={`${styles.edRow} ${styles.edRowSoon}`}>
                <span className={styles.edNumSoon}>{num(i)}</span>
                <span className={`${styles.edName} ${styles.edNameSoon}`}>{m.name}</span>
                <span className={styles.edLineSoon}>{m.line}</span>
                <span className={styles.edThumbSoon} />
                <span className={styles.soonTag}>soon</span>
              </div>
            </div>
          ) : (
            <div key={m.name} data-reveal="">
              <Link href={m.href} data-cursor="view" className={styles.edRow}>
                <span className={styles.edNum}>{num(i)}</span>
                <span className={styles.edName}>{m.name}</span>
                <span className={styles.edInfo}>
                  <span className={styles.edWhat}>{m.what}</span>
                  <span className={styles.edLine}>{m.line}</span>
                </span>
                <span className={styles.edThumb}>
                  <span data-jitter="" className={styles.jitter} style={bg(m)} aria-hidden />
                </span>
                <span className={styles.edCount}>{m.count} pieces →</span>
              </Link>
            </div>
          ),
        )}
      </div>

      {/* Mobile: swipe row */}
      <div data-scroller="" className={styles.edScroller}>
        {mediums.map((m, i) => (
          <div key={m.name} data-reveal="" className={styles.edCardWrap} style={{ transitionDelay: `${i * 80}ms` }}>
            {m.soon ? (
              <div className={styles.edCard}>
                <span className={styles.edCardSoon}>soon</span>
                <span className={`${styles.edCardName} ${styles.edCardNameSoon}`}>{m.name}</span>
              </div>
            ) : (
              <Link href={m.href} className={styles.edCard}>
                <span className={styles.edCardImg} style={bg(m)} aria-hidden />
                <span className={styles.edCardRow}>
                  <span className={styles.edCardName}>{m.name}</span>
                  <span className={styles.edCardNum}>{num(i)}</span>
                </span>
                <span className={styles.edCardLine}>{m.line}</span>
                <span className={styles.edCardCount}>{m.count} pieces in the gallery →</span>
              </Link>
            )}
          </div>
        ))}
      </div>
      <span className={`${t.swipe} ${styles.edSwipe}`}>{copy.swipe}</span>
    </section>
  );
}
