import Link from "next/link";
import type { AboutClient, AboutContent, AboutCopy, AboutLayout } from "@/lib/placeholder/about";
import t from "../aboutType.module.css";
import styles from "./ClientsList.module.css";

type Props = { layout: AboutLayout; content: AboutContent; copy: AboutCopy };

const ROT = ["-2deg", "1.5deg", "-1deg", "2.5deg", "-1.5deg"];

/** Client links leave the site; "#" means the URL isn't known yet. */
const external = (c: AboutClient) =>
  c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function ClientsList({ layout, content: c, copy }: Props) {
  const cta = c.clientsCta;

  if (layout === "editorial") {
    return (
      <section data-component="ClientsList" className={`${styles.ed} ${t.edRule}`}>
        <div className={styles.edWrap}>
          <div data-reveal="" className={`${t.edHead} ${styles.edAside}`}>
            <span className={t.label}>{copy.clients.label}</span>
            <h2 className={t.edH2}>{copy.clients.heading}</h2>
          </div>
          <div className={styles.edList}>
            {c.clients.map((cl, i) => (
              <div key={cl.name} data-reveal="" style={{ transitionDelay: `${i * 70}ms` }}>
                <a href={cl.href} {...external(cl)} data-cursor="visit" className={styles.edRow}>
                  <span className={styles.edName}>{cl.name}</span>
                  <span className={styles.edKind}>
                    {cl.kind}
                    <span className={styles.edArrow}>↗</span>
                  </span>
                </a>
              </div>
            ))}
            <Link href={cta.href} data-cursor={cta.cursor} className={`${styles.edRow} ${styles.edCta}`}>
              <span className={styles.edName}>{cta.label}</span>
              <span className={styles.edCtaArrow}>→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-component="ClientsList" data-guide="6" className={styles.sk}>
      <header data-reveal="" className={`${t.skHead} ${styles.skHeader}`}>
        <span className={t.label}>{copy.clients.label}</span>
        <h2 className={t.skH2}>{copy.clients.heading}</h2>
      </header>
      <div data-reveal="" className={styles.skList}>
        {c.clients.map((cl, i) => (
          <a
            key={cl.name}
            href={cl.href}
            {...external(cl)}
            data-cursor="visit"
            className={styles.pill}
            style={{ transform: `rotate(${ROT[i % ROT.length]})` }}
          >
            <span className={styles.pillName}>{cl.name} ↗</span>
            <span className={styles.pillKind}>{cl.kind}</span>
          </a>
        ))}
        <Link href={cta.href} data-cursor={cta.cursor} className={styles.pillCta}>
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
