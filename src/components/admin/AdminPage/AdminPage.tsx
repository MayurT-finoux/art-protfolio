"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "../AdminProvider/AdminProvider";
import styles from "./AdminPage.module.css";

type Props = {
  title: string;
  /** Editors: back button + breadcrumb to the list. */
  back?: { href: string; label: string };
  /** Editors: draft/live segmented control. */
  status?: { draft: boolean; onChange: (draft: boolean) => void };
  /** Saves the screen. Return an error message to show instead of the "saved" toast. */
  onSave?: () => Promise<string | void>;
  children: React.ReactNode;
};

// 68px header (title, draft/live, view site, save) + the scrolling content area.
export function AdminPage({ title, back, status, onSave, children }: Props) {
  const { save } = useAdmin();
  const [saving, setSaving] = useState(false);

  const onSaveClick = async () => {
    if (!onSave) return save();
    setSaving(true);
    try {
      const error = await onSave();
      if (error) window.alert(error);
      else save();
    } catch (e) {
      window.alert((e as Error).message || "Couldn't save.");
    } finally {
      setSaving(false);
    }
  };

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
          <button type="button" className={styles.save} onClick={onSaveClick} disabled={saving}>
            {saving ? "saving…" : "save"}
          </button>
        </div>
      </header>
      <div className={styles.content}>{children}</div>
    </>
  );
}
