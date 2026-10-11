import Link from "next/link";
import type { Project, projectPage } from "@/lib/placeholder/work";
import { ProjectVideo } from "@/components/work/ProjectVideo/ProjectVideo";
import styles from "./ProjectPage.module.css";

type Props = {
  project: Project;
  /** 1-based position in the Work list */
  n: number;
  next: Project;
  copy: typeof projectPage;
};

const pad = (n: number) => String(n).padStart(2, "0");
const bg = (url: string, position: string) => ({ backgroundImage: `url("${url}")`, backgroundPosition: position });

export function ProjectPage({ project: p, n, next, copy }: Props) {
  const meta = [
    { k: "client", v: p.client },
    { k: "role", v: p.role },
    { k: "tools", v: p.tools },
    { k: "year", v: p.year },
  ];
  const metaRows = meta.map((m) => (
    <div key={m.k} className={styles.metaRow}>
      <span className={styles.metaKey}>{m.k}</span>
      <span className={styles.metaValue}>{m.v}</span>
    </div>
  ));

  return (
    <article data-component="ProjectPage" className={styles.page}>
      <div className={styles.top}>
        <Link href="/work" className={styles.back} data-cursor="back">
          {copy.back}
        </Link>
        <header className={styles.header}>
          <div className={styles.titles}>
            <span className={styles.label}>
              {pad(n)} · {p.kind} · {p.year}
            </span>
            <h1 className={styles.title}>{p.title}</h1>
          </div>
          <div className={styles.metaDesktop}>
            {metaRows}
            {p.behanceUrl && (
              <a href={p.behanceUrl} className={styles.behancePill} data-cursor="open" target="_blank" rel="noopener noreferrer">
                {copy.behanceButton}
              </a>
            )}
          </div>
        </header>
      </div>

      <div className={styles.cover}>
        <div className={styles.coverImage} style={bg(p.cover.url, p.cover.position)} role="img" aria-label={p.title} />
      </div>

      <div className={styles.metaMobile}>{metaRows}</div>

      <section className={styles.story}>
        <span className={styles.label}>{copy.storyLabel}</span>
        <div className={styles.storyText}>
          {p.story.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>{copy.processHeading}</h2>
          <span className={styles.hint}>{copy.processHint}</span>
        </div>
        <div className={styles.steps}>
          {p.process.map((s, i) => (
            <figure key={s.label} className={styles.step}>
              <div className={styles.stepFrame}>
                <div className={styles.stepImage} style={{ ...bg(s.url, s.position), filter: s.filter }} />
              </div>
              <figcaption className={styles.stepCaption}>
                <span className={styles.stepN}>{pad(i + 1)}</span> {s.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {p.youtubeId && (
        <ProjectVideo
          heading={copy.videoHeading}
          hint={copy.videoHint}
          title={p.title}
          youtubeId={p.youtubeId}
          poster={p.cover}
        />
      )}

      <section className={styles.finals}>
        <h2 className={`${styles.h2} ${styles.finalsHeading}`}>{copy.finalsHeading}</h2>
        <div className={styles.finalsGrid}>
          {p.finals.map((f, i) => (
            <div
              key={i}
              className={`${styles.final} ${f.span === 2 ? styles.finalWide : ""}`}
              style={{ aspectRatio: f.ratio }}
            >
              <div className={styles.finalImage} style={bg(f.url, f.position)} />
            </div>
          ))}
        </div>
      </section>

      {p.behanceUrl && (
        <section className={styles.behance}>
          <div className={styles.behanceText}>
            <span className={styles.behanceHeading}>{copy.behanceHeading}</span>
            <span className={styles.behanceLine}>{copy.behanceText}</span>
          </div>
          <a href={p.behanceUrl} className={styles.behanceButton} data-cursor="open" target="_blank" rel="noopener noreferrer">
            {copy.behanceButton}
          </a>
        </section>
      )}

      <Link href={`/work/${next.slug}`} className={styles.next} data-cursor="next">
        <span className={styles.nextText}>
          <span className={styles.nextLabel}>{copy.next}</span>
          <span className={styles.nextTitle}>
            {next.title}
            <span className={styles.mobileOnly}> →</span>
          </span>
        </span>
        <span className={styles.nextArrow} aria-hidden>
          →
        </span>
      </Link>
    </article>
  );
}
