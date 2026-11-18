"use client";

import { useState } from "react";
import { saveMicrocopy } from "@/app/admin/actions";
import type { MicrocopyContent } from "@/lib/content/types";
import { AdminPage } from "../AdminPage/AdminPage";
import { Panel, TextInput } from "../ui/AdminUI";
import styles from "./MicrocopyEditor.module.css";

const GROUPS: { name: string; fields: { key: keyof MicrocopyContent; label: string; where: string }[] }[] = [
  {
    name: "Little lines",
    fields: [
      { key: "scrollHint", label: "scroll hint", where: "Home hero, under the intro" },
      { key: "scrollHintMobile", label: "scroll hint · mobile", where: "Home hero on phones" },
      { key: "emptyCategory", label: "empty category", where: "Gallery, when a filter has nothing" },
    ],
  },
];

// Saved as site_content "microcopy". (The design's "Cursor labels" group is left
// out: the site uses the normal system cursor — Yurix's change, 2026-10-11.)
export function MicrocopyEditor({ initial }: { initial: MicrocopyContent }) {
  const [values, setValues] = useState(initial);

  const save = async () => {
    const result = await saveMicrocopy(values);
    if (!result.ok) return result.error;
  };

  return (
    <AdminPage title="Microcopy" onSave={save}>
      <div data-component="MicrocopyEditor" className={styles.editor}>
        <span className={styles.intro}>Little lines across the site. Keep them short.</span>
        {GROUPS.map((group) => (
          <Panel key={group.name} title={group.name} gap={14}>
            {group.fields.map((f) => (
              <div key={f.key} className={styles.row}>
                <span className={styles.what}>
                  <span className={styles.label}>{f.label}</span>
                  <span className={styles.where}>{f.where}</span>
                </span>
                <TextInput aria-label={f.label} value={values[f.key]} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
              </div>
            ))}
          </Panel>
        ))}
      </div>
    </AdminPage>
  );
}
