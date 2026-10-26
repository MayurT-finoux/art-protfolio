"use client";

import { useState } from "react";
import { FOOTER_FIELDS, FOOTER_PAGES, SOCIALS } from "@/lib/placeholder/admin";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { Field, FieldLabel, Panel, PanelTitle, StatusDot, TextInput } from "../ui/AdminUI";
import styles from "./FooterEditor.module.css";

export function FooterEditor() {
  const { ig, syncInstagram } = useAdmin();
  const [fields, setFields] = useState<Record<string, string>>(() => Object.fromEntries(FOOTER_FIELDS.map((f) => [f.key, f.value])));
  const [socials, setSocials] = useState(SOCIALS);

  const failed = ig === "fail";

  return (
    <div data-component="FooterEditor" className={styles.editor}>
      <Panel title="Footer" gap={14}>
        {FOOTER_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <TextInput value={fields[f.key]} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
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
              <span className={styles.handle}>@yurix.draws</span>
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
          {socials.map((s, i) => (
            <div key={s.name} className={styles.social}>
              <span className={styles.socialName}>{s.name}</span>
              <TextInput
                mono
                aria-label={`${s.name} URL`}
                value={s.url}
                onChange={(e) => setSocials(socials.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
              />
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
