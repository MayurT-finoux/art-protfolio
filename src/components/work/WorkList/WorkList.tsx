import Link from "next/link";
import type { Project } from "@/lib/placeholder/work";
import styles from "./WorkList.module.css";
import { bgImage } from "@/lib/bgImage";

type Props = {
  label: string;
  heading: string;
  intro: string;
  projects: Project[];
};

const pad = (n: number) => String(n).padStart(2, "0");

// All projects in CMS order. The first card spans both columns at 21/9.
export function WorkList({ label, heading, intro, projects }: Props) {
  return (
    <section data-component="WorkList" className={styles.section}>
      <header className={styles.header}>
        <div className={styles.titles}>
          <span className={styles.label}>
            {label} · {pad(projects.length)}
          </span>
          <h1 className={styles.heading}>{heading}</h1>
        </div>
        <p className={styles.intro}>{intro}</p>
      </header>

      <div className={styles.grid}>
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className={`${styles.card} ${i === 0 ? styles.wide : ""}`}
            data-cursor="open"
          >
            <article className={styles.article}>
              <div className={styles.frame}>
                <div
                  className={styles.image}
                  style={{ backgroundImage: bgImage(p.thumb.url), backgroundPosition: p.thumb.position }}
                  role="img"
                  aria-label={p.title}
                />
                <span className={styles.kind}>{p.kind}</span>
                {p.youtubeId && (
                  <span className={styles.video}>
                    <span className={styles.videoDot} />
                    video
                  </span>
                )}
              </div>
              <div className={styles.caption}>
                <span className={styles.captionTitle}>
                  <span className={styles.n}>{pad(i + 1)}</span>
                  <span className={styles.title}>{p.title}</span>
                </span>
                <span className={styles.meta}>
                  <span className={styles.desktopOnly}>{p.client} · </span>
                  {p.year}
                </span>
              </div>
              <p className={styles.teaser}>{p.teaser}</p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
