import type { AboutContent, AboutCopy, AboutLayout, AboutSocial } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./SocialLinks.module.css";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

/** Social links leave the site; "#" means the URL isn't known yet. */
const external = (s: AboutSocial) =>
  s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function SocialLinks({ layout, content: c, copy }: Props) {
  if (layout === "editorial") {
    return (
      <section data-component="SocialLinks" className={`${styles.ed} ${t.edRule}`}>
        <span data-reveal="" className={`${t.label} ${styles.edLabel}`}>
          {copy.social.label}
        </span>
        <div className={styles.edList}>
          {c.social.map((s, i) => (
            <div key={s.name} data-reveal="" style={{ transitionDelay: `${i * 80}ms` }}>
              <a href={s.href} {...external(s)} data-cursor="follow" className={styles.edRow}>
                <span className={styles.edName}>{s.name}</span>
                <span className={styles.edLine}>{s.line}</span>
                <span className={styles.edHandle}>
                  {s.handle}
                  <span className={styles.edArrow}>↗</span>
                </span>
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section data-component="SocialLinks" data-guide="8" className={styles.sk}>
      <header data-reveal="" className={`${t.skHead} ${styles.skHeader}`}>
        <span className={t.label}>{copy.social.label}</span>
        <h2 className={t.skH2}>{copy.social.heading}</h2>
      </header>
      <div className={styles.grid}>
        {c.social.map((s, i) => (
          <div key={s.name} data-reveal="" style={{ transitionDelay: `${i * 80}ms` }}>
            <a href={s.href} {...external(s)} data-cursor="follow" className={styles.card}>
              <span className={styles.cardArrow}>↗</span>
              <span className={styles.cardName}>{s.name}</span>
              <span className={styles.cardHandle}>{s.handle}</span>
              <p className={styles.cardLine}>{s.line}</p>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
