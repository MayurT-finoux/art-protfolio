"use client";

import { useState } from "react";
import { MICROCOPY } from "@/lib/placeholder/admin";
import { Panel, TextInput } from "../ui/AdminUI";
import styles from "./MicrocopyEditor.module.css";

export function MicrocopyEditor() {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(MICROCOPY.flatMap((g) => g.fields.map((f) => [f.key, f.value]))),
  );

  return (
    <div data-component="MicrocopyEditor" className={styles.editor}>
      <span className={styles.intro}>Little lines across the site. Keep them short.</span>
      {MICROCOPY.map((group) => (
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
  );
}
