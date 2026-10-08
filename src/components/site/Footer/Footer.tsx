import Link from "next/link";
import type { NavItem, SocialLink } from "@/lib/placeholder/home";
import { Wordmark } from "../Wordmark/Wordmark";
import styles from "./Footer.module.css";

type Props = {
  wordmark: string;
  sayHiLabel: string;
  location: string;
  email: string;
  copyright: string;
  pageLinks: NavItem[];
  social: SocialLink[];
};

export function Footer({ wordmark, sayHiLabel, location, email, copyright, pageLinks, social }: Props) {
  return (
    <div className={styles.wrap}>
      <Wordmark text={wordmark} />
      <footer data-component="Footer" className={styles.footer}>
        <div className={styles.contact}>
          <div className={styles.sayHi}>{sayHiLabel}</div>
          <div className={styles.location}>
            {location} · <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
        <div className={styles.links}>
          <div className={styles.pageLinks}>
            {pageLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.pageLink}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles.social}>
            {social.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className={styles.copyright}>{copyright}</div>
      </footer>
    </div>
  );
}
