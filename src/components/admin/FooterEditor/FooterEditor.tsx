"use client";

import { useState } from "react";
import { saveFooter } from "@/app/admin/actions";
import { instagramHandle, type FooterContent } from "@/lib/content/types";
import { FOOTER_PAGES } from "@/lib/placeholder/admin";
import { AdminPage } from "../AdminPage/AdminPage";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { Field, FieldLabel, Panel, PanelTitle, StatusDot, TextInput } from "../ui/AdminUI";
import styles from "./FooterEditor.module.css";

const FIELDS: { key: keyof FooterContent; label: string }[] = [
  { key: "wordmark", label: "wordmark" },
  { key: "sayHiLabel", label: "say hi label" },
  { key: "location", label: "location" },
  { key: "email", label: "email" },
  { key: "copyright", label: "copyright" },
];

const SOCIAL: { key: "instagram" | "behance" | "youtube"; name: string; placeholder: string }[] = [
  { key: "instagram", name: "Instagram", placeholder: "instagram.com/yourname" },
  { key: "behance", name: "Behance", placeholder: "behance.net/yourname" },
  { key: "youtube", name: "YouTube", placeholder: "youtube.com/@yourname" },
];

/** Shown without "https://", like the design ("instagram.com/yurix.draws"). */
const bare = (url: string) => url.replace(/^https?:\/\//i, "");

// Footer fields + social links are saved (site_content "footer"); the Instagram
// connection panel stays a placeholder until the Instagram API is connected.
export function FooterEditor({ initial }: { initial: FooterContent }) {
  const { ig, syncInstagram } = useAdmin();
  const [c, setC] = useState<FooterContent>({
    ...initial,
    instagram: bare(initial.instagram),
    behance: bare(initial.behance),
    youtube: bare(initial.youtube),
  });

  const failed = ig === "fail";
  const handle = instagramHandle(`https://${c.instagram}`) || "not connected";

  const save = async () => {
    const result = await saveFooter(c);
    if (!result.ok) return result.error;
  };

  return (
    <AdminPage title="Footer & social" onSave={save}>
    <div data-component="FooterEditor" className={styles.editor}>
      <Panel title="Footer" gap={14}>
        {FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <TextInput value={c[f.key]} onChange={(e) => setC({ ...c, [f.key]: e.target.value })} />
          </Field>
        ))}
        <div className={styles.stack8}>
          <FieldLabel>page links</FieldLabel>
          <div className={styles.pages}>
            {FOOTER_PAGES.map((p) => (
              <span key={p} className={styles.page}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </Panel>

      <div className={styles.column}>
        <Panel gap={14}>
          <div className={styles.igHead}>
            <PanelTitle>Instagram</PanelTitle>
            <StatusDot color={failed ? "var(--error)" : "var(--ok)"} mono>
              {failed ? "sync failed" : "connected"}
            </StatusDot>
          </div>
          <div className={styles.igAccount}>
            <span className={styles.avatar}>y</span>
            <span className={styles.igText}>
              <span className={styles.handle}>{handle}</span>
              <span className={styles.sync}>
                {failed
                  ? "couldn't reach Instagram · site still shows the last 3 posts"
                  : ig === "syncing"
                    ? "syncing…"
                    : "last synced 12 min ago"}
              </span>
            </span>
            <button type="button" className={styles.syncButton} onClick={syncInstagram}>
              {failed ? "retry" : "sync now"}
            </button>
          </div>
          <span className={styles.note}>Newest 3 posts fill the Home Fresh strip. If a sync fails, the site keeps the last posts it got.</span>
        </Panel>

        <Panel title="Social links" gap={14}>
          {SOCIAL.map((s) => (
            <div key={s.key} className={styles.social}>
              <span className={styles.socialName}>{s.name}</span>
              <TextInput
                mono
                aria-label={`${s.name} URL`}
                placeholder={s.placeholder}
                value={c[s.key]}
                onChange={(e) => setC({ ...c, [s.key]: e.target.value })}
              />
            </div>
          ))}
        </Panel>
      </div>
    </div>
    </AdminPage>
  );
}
