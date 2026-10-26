import type { AboutContent, AboutLayout } from "@/lib/placeholder/about";
import styles from "./AboutHero.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = { layout: AboutLayout; content: AboutContent };

function Portrait({ c, className }: { c: AboutContent; className: string }) {
  return c.portraitVideo ? (
    <video className={className} src={c.portraitVideo} poster={c.portraitImage} autoPlay muted loop playsInline aria-hidden />
  ) : (
    <div className={className} style={{ backgroundImage: bgImage(c.portraitImage) }} aria-hidden />
  );
}

// Intro: heading with a hand-drawn mark, intro line, freelance badge, portrait.
export function AboutHero({ layout, content: c }: Props) {
  return layout === "sketchbook" ? <Sketchbook c={c} /> : <Editorial c={c} />;
}

function Sketchbook({ c }: { c: AboutContent }) {
  return (
    <section data-component="AboutHero" data-guide="0" className={styles.sk}>
      <div data-reveal="" className={styles.skText}>
        <span className={styles.skLabel}>{c.heroLabel}</span>
        <h1 className={styles.skH1}>
          {c.heroGreeting} — {c.heroHeading}{" "}
          <span className={styles.accent}>
            {c.heroHeadingAccent}
            <svg data-draw="" viewBox="0 0 300 26" preserveAspectRatio="none" className={styles.skUnderline} aria-hidden>
              <path pathLength={1} d="M4 16 C 40 4, 70 24, 110 12 S 180 2, 220 14 S 276 20, 296 8" />
            </svg>
          </span>
        </h1>
        <p className={styles.skIntro}>{c.heroIntro}</p>
        <div className={styles.pills}>
          {c.openForFreelance && (
            <span className={styles.freelance}>
              <span data-motion="" className={styles.freelanceDot} />
              open for freelance
            </span>
          )}
          <span className={styles.city}>{c.city}</span>
        </div>
      </div>
      <div data-reveal="" className={styles.skVisual}>
        <div className={styles.polaroid}>
          <span className={styles.tape} />
          <div className={styles.skFrame}>
            <Portrait c={c} className={styles.media} />
          </div>
          <span className={styles.caption}>{c.portraitCaption}</span>
          <svg data-draw="" viewBox="0 0 40 40" className={styles.star} aria-hidden>
            <path pathLength={1} d="M20 3 L24 15 L37 20 L24 25 L20 37 L16 25 L3 20 L16 15 Z" />
          </svg>
          <svg data-draw="" viewBox="0 0 100 60" className={styles.arrow} aria-hidden>
            <path pathLength={1} d="M6 12 C 30 0, 56 40, 30 46 C 12 50, 14 26, 40 30 S 78 50, 92 42 M92 42 L80 40 M92 42 L88 30" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function Editorial({ c }: { c: AboutContent }) {
  const meta = [
    { k: "based in", v: c.city, live: false },
    ...(c.openForFreelance ? [{ k: "currently", v: "open for freelance", live: true }] : []),
    { k: "makes", v: c.makes, live: false },
  ];

  return (
    <section data-component="AboutHero" className={styles.ed}>
      <div data-reveal="" className={styles.edTop}>
        <span>about</span>
        <span>{c.heroRole}</span>
      </div>
      <h1 data-reveal="" className={styles.edH1}>
        {c.heroHeading}{" "}
        <span className={styles.accent}>
          {c.heroHeadingAccent}
          <svg data-draw="" viewBox="0 0 400 160" preserveAspectRatio="none" className={styles.edCircle} aria-hidden>
            <path pathLength={1} d="M210 10 C 90 4, 10 40, 14 84 C 18 132, 140 154, 250 148 C 350 142, 396 108, 388 70 C 380 30, 300 8, 180 16" />
          </svg>
        </span>
      </h1>
      <div className={styles.edRow}>
        <div data-reveal="" className={styles.edVisual}>
          <div className={styles.edFrame}>
            <Portrait c={c} className={styles.media} />
            <span className={styles.loop}>
              <span data-motion="" className={styles.loopDot} />
              loop
            </span>
          </div>
        </div>
        <div data-reveal="" className={styles.edText}>
          <h2 className={styles.edH2}>{c.heroGreeting}.</h2>
          <p className={styles.edIntro}>{c.heroIntro}</p>
          <dl className={styles.meta}>
            {meta.map((r) => (
              <div key={r.k} className={styles.metaRow}>
                <dt>{r.k}</dt>
                <dd>
                  {r.live && <span data-motion="" className={styles.liveDot} />}
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
