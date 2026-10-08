"use client";

import Link from "next/link";
import { useState } from "react";
import type { AboutListKey, ListItem } from "@/lib/placeholder/admin";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { FieldLabel, SoonTag, TextArea, Thumb } from "../ui/AdminUI";
import styles from "./SectionAccordion.module.css";

export type SectionField =
  | { kind: "text"; label: string; value: string }
  | { kind: "file"; label: string; value: string; hint: string; image: string }
  | { kind: "auto"; label: string; value: string; cta: string; href: string }
  | { kind: "list"; label: string; list: AboutListKey; addLabel: string; blank: ListItem };

export type Section = { name: string; summary: string; fields: SectionField[] };

// HomeEditor / AboutEditor accordion: one section open at a time.
export function SectionAccordion({ sections, defaultOpen }: { sections: Section[]; defaultOpen: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);

  return (
    <>
      {sections.map((section, i) => {
        const isOpen = open === section.name;
        return (
          <div key={section.name} className={styles.section} data-open={isOpen || undefined}>
            <button type="button" className={styles.head} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : section.name)}>
              <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.titles}>
                <span className={styles.name}>{section.name}</span>
                <span className={styles.summary}>{section.summary}</span>
              </span>
              <span className={styles.chev}>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className={styles.body}>
                {section.fields.map((f) => (
                  <div key={f.label} className={styles.field}>
                    <FieldLabel>{f.label}</FieldLabel>
                    <FieldControl field={f} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function FieldControl({ field }: { field: SectionField }) {
  switch (field.kind) {
    case "text":
      return <TextField initial={field.value} label={field.label} />;
    case "file":
      return (
        <div className={styles.file}>
          <Thumb src={field.image} position="center" className={styles.fileThumb} />
          <span className={styles.fileText}>
            <span className={styles.fileName}>{field.value}</span>
            <span className={styles.fileHint}>{field.hint}</span>
          </span>
          <button type="button" className={styles.replace}>
            replace
          </button>
        </div>
      );
    case "auto":
      return (
        <div className={styles.auto}>
          <span>{field.value}</span>
          <Link href={field.href} className={styles.autoLink}>
            {field.cta}
          </Link>
        </div>
      );
    case "list":
      return <ListField list={field.list} addLabel={field.addLabel} blank={field.blank} />;
  }
}

function TextField({ initial, label }: { initial: string; label: string }) {
  const [value, setValue] = useState(initial);
  return <TextArea rows={1} aria-label={label} className={styles.text} value={value} onChange={(e) => setValue(e.target.value)} />;
}

/** Rows of two values with ↑ ↓ ×, and a "+ add …" row. */
function ListField({ list, addLabel, blank }: { list: AboutListKey; addLabel: string; blank: ListItem }) {
  const { aboutLists, setAboutList } = useAdmin();
  const items = aboutLists[list];
  const set = (next: ListItem[]) => setAboutList(list, next);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
  };
  const edit = (i: number, patch: Partial<ListItem>) => set(items.map((x, k) => (k === i ? { ...x, ...patch } : x)));

  return (
    <div className={styles.list}>
      {items.map((it, i) => (
        <div key={i} className={styles.listRow}>
          <input className={styles.listA} aria-label="Name" value={it.a} onChange={(e) => edit(i, { a: e.target.value })} />
          <input className={styles.listB} aria-label="Line" value={it.b} onChange={(e) => edit(i, { b: e.target.value })} />
          {it.soon && <SoonTag />}
          <div className={styles.listActions}>
            <button type="button" aria-label="Move up" onClick={() => move(i, -1)}>
              ↑
            </button>
            <button type="button" aria-label="Move down" onClick={() => move(i, 1)}>
              ↓
            </button>
            <button type="button" aria-label="Remove" className={styles.remove} onClick={() => set(items.filter((_, k) => k !== i))}>
              ×
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={styles.listAdd} onClick={() => set([...items, { ...blank }])}>
        {addLabel}
      </button>
    </div>
  );
}
