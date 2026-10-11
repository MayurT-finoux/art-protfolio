"use client";

import Link from "next/link";
import { useState } from "react";
import type { AboutListKey, ListItem } from "@/lib/placeholder/admin";
import type { UploadKind } from "@/lib/uploads";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { FieldLabel, SoonTag, TextArea, Thumb } from "../ui/AdminUI";
import { FilePicker, progressLabel } from "../ui/FilePicker";
import styles from "./SectionAccordion.module.css";

/**
 * Fields with a `name` are controlled by the editor through `onChange(name, value)`
 * (HomeEditor saves them); fields without one keep their own state (AboutEditor, for now).
 */
export type SectionField =
  | { kind: "text"; label: string; value: string; name?: string }
  | {
      kind: "file";
      label: string;
      /** Shown when nothing is uploaded yet, e.g. "hero-loop.mp4". */
      value: string;
      hint: string;
      /** Thumbnail shown when nothing is uploaded yet. */
      image: string;
      accept: UploadKind;
      folder: string;
      name?: string;
      /** Controlled: the uploaded file's URL (null = none yet). */
      url?: string | null;
    }
  | { kind: "auto"; label: string; value: string; cta: string; href: string }
  | { kind: "list"; label: string; list: AboutListKey; addLabel: string; blank: ListItem };

export type Section = { name: string; summary: string; fields: SectionField[] };

// HomeEditor / AboutEditor accordion: one section open at a time.
export function SectionAccordion({
  sections,
  defaultOpen,
  onChange,
}: {
  sections: Section[];
  defaultOpen: string;
  onChange?: (name: string, value: string) => void;
}) {
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
                    <FieldControl field={f} onChange={onChange} />
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

type OnChange = ((name: string, value: string) => void) | undefined;

function FieldControl({ field, onChange }: { field: SectionField; onChange: OnChange }) {
  switch (field.kind) {
    case "text":
      return field.name && onChange ? (
        <TextArea
          rows={1}
          aria-label={field.label}
          className={styles.text}
          value={field.value}
          onChange={(e) => onChange(field.name!, e.target.value)}
        />
      ) : (
        <TextField initial={field.value} label={field.label} />
      );
    case "file":
      return <FileField field={field} onChange={onChange} />;
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

const fileName = (url: string) => decodeURIComponent(url.split("/").pop() ?? url);

function FileField({ field, onChange }: { field: Extract<SectionField, { kind: "file" }>; onChange: OnChange }) {
  const [local, setLocal] = useState({ name: field.value, url: field.image, video: false });
  const controlled = Boolean(field.name && onChange);
  const file = controlled
    ? field.url
      ? { name: fileName(field.url), url: field.url, video: field.accept === "video" }
      : { name: field.value, url: field.image, video: false }
    : local;
  return (
    <div className={styles.file}>
      <Thumb src={file.video ? "" : file.url} position="center" className={styles.fileThumb}>
        {file.video && <video className={styles.fileVideo} src={file.url} muted autoPlay loop playsInline />}
      </Thumb>
      <span className={styles.fileText}>
        <span className={styles.fileName}>{file.name}</span>
        <span className={styles.fileHint}>{field.hint}</span>
      </span>
      <FilePicker
        kind={field.accept}
        folder={field.folder}
        onUploaded={(url, f) =>
          controlled ? onChange!(field.name!, url) : setLocal({ name: f.name, url, video: f.type.startsWith("video/") })
        }
      >
        {({ open, progress }) => (
          <button type="button" className={styles.replace} onClick={open}>
            {progressLabel(progress, "replace")}
          </button>
        )}
      </FilePicker>
    </div>
  );
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
