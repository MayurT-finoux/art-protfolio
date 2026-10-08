"use client";

import { useState } from "react";
import {
  ARTWORKS,
  CATEGORIES,
  DESCRIPTIONS,
  MAX_FEATURED,
  img,
  slugify,
  type Artwork,
  type LinkName,
} from "@/lib/placeholder/admin";
import { AdminPage } from "../AdminPage/AdminPage";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { SlugSeoFields } from "../SlugSeoFields/SlugSeoFields";
import { SortableList } from "../ui/Sortable";
import { Button, Chip, DragHandle, Field, FieldLabel, Panel, TextArea, TextInput, Thumb, Toggle } from "../ui/AdminUI";
import styles from "./ArtworkEditor.module.css";

type ImageRow = { id: string; label: string; src: string; position: string };

const LINK_NAMES: LinkName[] = ["Instagram", "Behance", "YouTube"];

const linkUrl = (name: LinkName, slug: string) =>
  ({
    Instagram: `instagram.com/p/${slug}`,
    Behance: `behance.net/gallery/${slug}`,
    YouTube: "youtu.be/aqz-KE-bpKQ",
  })[name];

/** `artwork` null = new artwork. */
export function ArtworkEditor({ artwork }: { artwork: Artwork | null }) {
  const { featured, toggleFeatured, artworkDraft, setArtworkDraft } = useAdmin();
  const index = artwork ? ARTWORKS.indexOf(artwork) : -1;

  const [title, setTitle] = useState(artwork?.title ?? "");
  const [year, setYear] = useState(artwork?.year ?? "");
  const [category, setCategory] = useState(artwork?.category ?? CATEGORIES[0]);
  const [description, setDescription] = useState(artwork ? DESCRIPTIONS[artwork.category] : "");
  const [materials, setMaterials] = useState<string[]>(artwork?.materials ?? []);
  const [newMaterial, setNewMaterial] = useState<string | null>(null);
  const [links, setLinks] = useState<Record<LinkName, string>>(() =>
    Object.fromEntries(
      LINK_NAMES.map((n) => [n, artwork?.links.includes(n) ? linkUrl(n, artwork.slug) : ""]),
    ) as Record<LinkName, string>,
  );
  const [images, setImages] = useState<ImageRow[]>(() =>
    (artwork?.views ?? []).map((label, j) => ({
      id: `${j}-${label}`,
      label,
      src: img(artwork!.imageKey, 400, j * 2),
      position: j === 0 ? artwork!.position : "center",
    })),
  );
  const [localDraft, setLocalDraft] = useState(true);

  const draft = artwork ? artworkDraft[artwork.slug] : localDraft;
  const setDraft = (d: boolean) => (artwork ? setArtworkDraft(artwork.slug, d) : setLocalDraft(d));
  const slug = slugify(title) || "untitled";
  const isAnimation = category === "Animation";
  const pos = featured.indexOf(index);
  const featureNote =
    pos >= 0
      ? `Selected Work · position ${pos + 1} of ${featured.length}`
      : featured.length >= MAX_FEATURED
        ? "all 8 slots used — unstar one first"
        : "not featured";
  const cover = images[0];

  const addMaterial = () => {
    const m = newMaterial?.trim();
    if (m) setMaterials([...materials, m]);
    setNewMaterial(null);
  };

  return (
    <AdminPage
      title={title || "new artwork"}
      back={{ href: "/admin/artworks", label: "Artworks" }}
      status={{ draft, onChange: setDraft }}
    >
      <div data-component="ArtworkEditor" className={styles.editor}>
        <div className={styles.main}>
          <Panel title="Images" note="first image = card cover · drag to reorder">
            <div className={styles.imageGrid}>
              <SortableList
                items={images}
                getId={(im) => im.id}
                onReorder={setImages}
                layout="grid"
                className={styles.imageSortable}
                renderItem={(im, j, handleProps) => (
                  <div className={styles.imageCell}>
                    <Thumb src={im.src} position={im.position} className={styles.image}>
                      <DragHandle className={styles.imageHandle} {...handleProps} />
                      {j === 0 && <span className={styles.coverTag}>cover</span>}
                    </Thumb>
                    <input
                      className={styles.imageLabel}
                      aria-label="Image label"
                      value={im.label}
                      onChange={(e) => setImages(images.map((x) => (x.id === im.id ? { ...x, label: e.target.value } : x)))}
                    />
                  </div>
                )}
              />
              <div className={styles.imageCell}>
                <button type="button" className={styles.addImage}>
                  <span className={styles.addPlus}>+</span>
                  <span>add image</span>
                  <span className={styles.addHint}>JPG, PNG, WebP</span>
                </button>
                <span className={styles.labelHint}>label: front, side, before, after…</span>
              </div>
            </div>
            {isAnimation && (
              <div className={styles.preview}>
                <span className={styles.previewIcon}>▶</span>
                <div className={styles.previewText}>
                  <span className={styles.previewTitle}>Preview loop · {slug}-preview.mp4</span>
                  <span className={styles.previewNote}>Plays muted on the card when in view or on hover. Keep it under 6 s.</span>
                </div>
                <button type="button" className={styles.replace}>
                  replace
                </button>
              </div>
            )}
          </Panel>

          <Panel title="Details">
            <div className={styles.titleYear}>
              <Field label="title">
                <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <Field label="year">
                <TextInput value={year} inputMode="numeric" placeholder="year" onChange={(e) => setYear(e.target.value)} />
              </Field>
            </div>
            <div className={styles.stack8}>
              <FieldLabel>category</FieldLabel>
              <div className={styles.chips}>
                {CATEGORIES.map((c) => (
                  <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </div>
            <Field label="description">
              <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
            <div className={styles.stack8}>
              <FieldLabel>materials used</FieldLabel>
              <div className={styles.tags}>
                {materials.map((m, j) => (
                  <span key={`${m}-${j}`} className={styles.tag}>
                    {m}
                    <button type="button" aria-label={`Remove ${m}`} className={styles.tagRemove} onClick={() => setMaterials(materials.filter((_, k) => k !== j))}>
                      ×
                    </button>
                  </span>
                ))}
                {newMaterial == null ? (
                  <button type="button" className={styles.addTag} onClick={() => setNewMaterial("")}>
                    + add
                  </button>
                ) : (
                  <input
                    autoFocus
                    className={styles.addTagInput}
                    aria-label="New material"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    onBlur={addMaterial}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addMaterial();
                      if (e.key === "Escape") setNewMaterial(null);
                    }}
                  />
                )}
              </div>
            </div>
          </Panel>

          <Panel title="Links" note="optional · empty links are hidden on the site" gap={14}>
            {LINK_NAMES.map((name) => (
              <div key={name} className={styles.linkRow}>
                <span className={styles.linkName}>{name}</span>
                <TextInput
                  mono
                  aria-label={`${name} link`}
                  placeholder="paste a link"
                  className={links[name] ? undefined : styles.linkEmpty}
                  value={links[name]}
                  onChange={(e) => setLinks({ ...links, [name]: e.target.value })}
                />
              </div>
            ))}
          </Panel>

          <SlugSeoFields
            key={artwork?.slug ?? "new"}
            base="yurix.art/gallery/"
            slug={artwork?.slug ?? ""}
            title={artwork?.title ?? ""}
            descriptionFallback="uses description if empty"
          />
        </div>

        <aside className={styles.aside}>
          <Panel gap={14} padding={20}>
            <div className={styles.feature}>
              <div className={styles.featureText}>
                <span className={styles.featureTitle}>Feature on Home</span>
                <span className={styles.featureNote}>{featureNote}</span>
              </div>
              <Toggle on={pos >= 0} label="Toggle featured" onChange={() => index >= 0 && toggleFeatured(index)} />
            </div>
          </Panel>
          <Panel gap={12} padding={20}>
            <FieldLabel>card preview · ArtworkCard</FieldLabel>
            {cover ? (
              <Thumb src={cover.src} position={cover.position} className={styles.card} style={{ aspectRatio: artwork?.pin ?? "4/5" }}>
                {isAnimation && <span className={styles.cardLoop}>loop</span>}
              </Thumb>
            ) : (
              <span className={`${styles.card} ${styles.cardEmpty}`} />
            )}
            <div className={styles.cardCaption}>
              <span className={styles.cardTitle}>{title || "untitled"}</span>
              <span className={styles.cardCategory}>{category}</span>
            </div>
          </Panel>
          <Button variant="ghost" size="sm" className={styles.delete}>
            delete artwork
          </Button>
        </aside>
      </div>
    </AdminPage>
  );
}
