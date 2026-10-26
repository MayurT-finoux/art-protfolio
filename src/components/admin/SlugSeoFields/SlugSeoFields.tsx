"use client";

import { Field, Panel, TextInput, Thumb } from "../ui/AdminUI";
import styles from "./SlugSeoFields.module.css";

export type SeoValues = { slug: string; seoTitle: string; seoDescription: string };

type Props = SeoValues & {
  /** e.g. "yurix.art/gallery/" */
  base: string;
  onChange: (patch: Partial<SeoValues>) => void;
  /** Shown when the SEO title is empty, e.g. "clay ghost — Yurix". */
  titleFallback: string;
  /** Shown when the SEO description is empty, e.g. "uses description if empty". */
  descriptionFallback: string;
  /** Projects: share image (defaults to the cover). */
  shareImage?: string;
};

// URL & SEO: slug (auto from the title, editable), SEO title, SEO description.
export function SlugSeoFields({ base, slug, seoTitle, seoDescription, onChange, titleFallback, descriptionFallback, shareImage }: Props) {
  return (
    <Panel data-component="SlugSeoFields" title="URL & SEO" gap={14}>
      <Field label="url">
        <TextInput mono prefix={base} value={slug} placeholder="from the title" onChange={(e) => onChange({ slug: e.target.value })} />
      </Field>
      <div className={shareImage ? styles.rowWithImage : styles.row}>
        <Field label="seo title">
          <TextInput small value={seoTitle} placeholder={titleFallback} onChange={(e) => onChange({ seoTitle: e.target.value })} />
        </Field>
        <Field label="seo description">
          <TextInput small placeholder={descriptionFallback} value={seoDescription} onChange={(e) => onChange({ seoDescription: e.target.value })} />
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
