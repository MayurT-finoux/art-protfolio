"use client";

import { useState } from "react";
import { Field, Panel, TextInput, Thumb } from "../ui/AdminUI";
import styles from "./SlugSeoFields.module.css";

type Props = {
  /** e.g. "yurix.art/gallery/" */
  base: string;
  slug: string;
  title: string;
  /** Shown in the empty SEO description, e.g. "uses description if empty". */
  descriptionFallback: string;
  /** Projects: share image (defaults to the cover). */
  shareImage?: string;
};

// URL & SEO: slug (auto from the title, editable), SEO title, SEO description.
export function SlugSeoFields({ base, slug, title, descriptionFallback, shareImage }: Props) {
  const [slugValue, setSlug] = useState(slug);
  const [seoTitle, setSeoTitle] = useState(title ? `${title} — Yurix` : "");
  const [seoDescription, setSeoDescription] = useState("");

  return (
    <Panel data-component="SlugSeoFields" title="URL & SEO" gap={14}>
      <Field label="url">
        <TextInput mono prefix={base} value={slugValue} onChange={(e) => setSlug(e.target.value)} />
      </Field>
      <div className={shareImage ? styles.rowWithImage : styles.row}>
        <Field label="seo title">
          <TextInput small value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </Field>
        <Field label="seo description">
          <TextInput small placeholder={descriptionFallback} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </Field>
        {shareImage && (
          <Field label="share image">
            <Thumb src={shareImage} className={styles.share} />
          </Field>
        )}
      </div>
    </Panel>
  );
}
