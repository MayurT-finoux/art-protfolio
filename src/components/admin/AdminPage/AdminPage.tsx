"use client";

import Link from "next/link";
import { useAdmin } from "../AdminProvider/AdminProvider";
import styles from "./AdminPage.module.css";

type Props = {
  title: string;
  /** Editors: back button + breadcrumb to the list. */
  back?: { href: string; label: string };
  /** Editors: draft/live segmented control. */
  status?: { draft: boolean; onChange: (draft: boolean) => void };
  children: React.ReactNode;
};

// 68px header (title, draft/live, view site, save) + the scrolling content area.
export function AdminPage({ title, back, status, children }: Props) {
  const { save } = useAdmin();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          {back && (
            <>
              <Link href={back.href} aria-label="Back" className={styles.back}>
                ←
              </Link>
              <span className={styles.crumb}>{back.label}</span>
              <span className={styles.slash}>/</span>
            </>
          )}
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.actions}>
          {status && (
            <div className={styles.segment}>
              <button type="button" data-active={status.draft || undefined} onClick={() => status.onChange(true)}>
                draft
              </button>
              <button type="button" data-active={!status.draft || undefined} data-live onClick={() => status.onChange(false)}>
                live
              </button>
            </div>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.viewSite}>
            view site ↗
          </a>
          <button type="button" className={styles.save} onClick={save}>
            save
          </button>
        </div>
      </header>
      <div className={styles.content}>{children}</div>
    </>
  );
}
