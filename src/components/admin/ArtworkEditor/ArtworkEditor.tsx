"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteArtwork, saveArtwork, toggleFeatured } from "@/app/admin/actions";
import { slugify } from "@/lib/placeholder/admin";
import { MAX_FEATURED, type ArtworkData } from "@/lib/content/types";
import { AdminPage } from "../AdminPage/AdminPage";
import { SlugSeoFields, type SeoValues } from "../SlugSeoFields/SlugSeoFields";
import { FilePicker, progressLabel } from "../ui/FilePicker";
import { SortableList } from "../ui/Sortable";
import { Button, Chip, DragHandle, Field, FieldLabel, Panel, TextArea, TextInput, Thumb, Toggle } from "../ui/AdminUI";
import styles from "./ArtworkEditor.module.css";

type ImageRow = { id: string; label: string; src: string; position: string; width: number; height: number };
type LinkKey = "instagram" | "behance" | "youtube";

const LINKS: { key: LinkKey; name: string }[] = [
  { key: "instagram", name: "Instagram" },
  { key: "behance", name: "Behance" },
  { key: "youtube", name: "YouTube" },
];

/** Pixel size of an uploaded image (gives the card its shape). */
async function imageSize(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return { width: 4, height: 5 };
  }
}

const fileName = (url: string) => decodeURIComponent(url.split("/").pop() ?? url);

type Props = {
  /** null = new artwork */
  artwork: ArtworkData | null;
  categories: string[];
  /** Featured artwork ids in Home order. */
  featuredIds: number[];
};

export function ArtworkEditor({ artwork, categories, featuredIds }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(artwork?.title ?? "");
  const [year, setYear] = useState(artwork?.year ?? "");
  const [category, setCategory] = useState(artwork?.category ?? categories[0] ?? "Traditional");
  const [description, setDescription] = useState(artwork?.description ?? "");
  const [materials, setMaterials] = useState<string[]>(artwork?.materials ?? []);
  const [newMaterial, setNewMaterial] = useState<string | null>(null);
  const [links, setLinks] = useState<Record<LinkKey, string>>({
    instagram: artwork?.links.instagram ?? "",
    behance: artwork?.links.behance ?? "",
    youtube: artwork?.links.youtube ?? "",
  });
  const [images, setImages] = useState<ImageRow[]>(() =>
    (artwork?.images ?? []).map((im, j) => ({
      id: `${j}-${im.url}`,
      label: im.label,
      src: im.url,
      position: im.focus,
      width: im.width,
      height: im.height,
    })),
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(artwork?.previewUrl ?? null);
  const [draft, setDraft] = useState(artwork ? artwork.status === "draft" : true);
  const [seo, setSeo] = useState<SeoValues>({
    slug: artwork?.slug ?? "",
    seoTitle: artwork?.seoTitle ?? "",
    seoDescription: artwork?.seoDescription ?? "",
  });

  const folderSlug = artwork?.slug ?? (slugify(title) || "untitled");
  const isAnimation = category === "Animation";
  const pos = artwork ? featuredIds.indexOf(artwork.id) : -1;
  const featureNote = !artwork
    ? "save the artwork first"
    : pos >= 0
      ? `Selected Work · position ${pos + 1} of ${featuredIds.length}`
      : featuredIds.length >= MAX_FEATURED
        ? "all 8 slots used — unstar one first"
        : "not featured";
  const cover = images[0];

  const addMaterial = () => {
    const m = newMaterial?.trim();
    if (m) setMaterials([...materials, m]);
    setNewMaterial(null);
  };

  const save = async () => {
    const result = await saveArtwork({
      id: artwork?.id,
      slug: seo.slug,
      title,
      year,
      category,
      description,
      materials,
      links,
      previewUrl,
      status: draft ? "draft" : "live",
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
      images: images.map((im) => ({ url: im.src, label: im.label, width: im.width, height: im.height, focus: im.position })),
    });
    if (!result.ok) return result.error;
    setSeo((s) => ({ ...s, slug: result.slug }));
    if (result.slug !== artwork?.slug) router.replace(`/admin/artworks/${result.slug}`);
  };

  const onToggleFeatured = async () => {
    if (!artwork) return;
    const result = await toggleFeatured(artwork.id);
    if (!result.ok) window.alert(result.error);
  };

  const onDelete = async () => {
    if (!artwork) return router.push("/admin/artworks");
    if (!window.confirm(`Delete "${artwork.title}"? This can't be undone.`)) return;
    const result = await deleteArtwork(artwork.id);
    if (!result.ok) return window.alert(result.error);
    router.push("/admin/artworks");
  };

  return (
    <AdminPage
      title={title || "new artwork"}
      back={{ href: "/admin/artworks", label: "Artworks" }}
      status={{ draft, onChange: setDraft }}
      onSave={save}
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
                <FilePicker
                  kind="image"
                  folder={`artworks/${folderSlug}`}
                  onUploaded={async (url, file) => {
                    const size = await imageSize(file);
                    setImages((list) => [...list, { id: url, label: list.length ? "" : "front", src: url, position: "center", ...size }]);
                  }}
                >
                  {({ open, progress }) => (
                    <button type="button" className={styles.addImage} onClick={open}>
                      <span className={styles.addPlus}>+</span>
                      <span>{progressLabel(progress, "add image")}</span>
                      <span className={styles.addHint}>JPG, PNG, WebP</span>
                    </button>
                  )}
                </FilePicker>
                <span className={styles.labelHint}>label: front, side, before, after…</span>
              </div>
            </div>
            {isAnimation && (
              <div className={styles.preview}>
                <span className={styles.previewIcon}>▶</span>
                <div className={styles.previewText}>
                  <span className={styles.previewTitle}>Preview loop · {previewUrl ? fileName(previewUrl) : "no loop yet"}</span>
                  <span className={styles.previewNote}>Plays muted on the card when in view or on hover. Keep it under 6 s.</span>
                </div>
                <FilePicker kind="video" folder={`artworks/${folderSlug}`} onUploaded={(url) => setPreviewUrl(url)}>
                  {({ open, progress }) => (
                    <button type="button" className={styles.replace} onClick={open}>
                      {progressLabel(progress, previewUrl ? "replace" : "upload")}
                    </button>
                  )}
                </FilePicker>
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
                {categories.map((c) => (
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
            {LINKS.map(({ key, name }) => (
              <div key={key} className={styles.linkRow}>
                <span className={styles.linkName}>{name}</span>
                <TextInput
                  mono
                  type="url"
                  aria-label={`${name} link`}
                  placeholder="paste a link"
                  className={links[key] ? undefined : styles.linkEmpty}
                  value={links[key]}
                  onChange={(e) => setLinks({ ...links, [key]: e.target.value })}
                />
              </div>
            ))}
          </Panel>

          <SlugSeoFields
            base="yurix.art/gallery/"
            {...seo}
            onChange={(patch) => setSeo({ ...seo, ...patch })}
            titleFallback={`${title || "untitled"} — Yurix`}
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
              <Toggle on={pos >= 0} label="Toggle featured" onChange={onToggleFeatured} />
            </div>
          </Panel>
          <Panel gap={12} padding={20}>
            <FieldLabel>card preview · ArtworkCard</FieldLabel>
            {cover ? (
              <Thumb src={cover.src} position={cover.position} className={styles.card} style={{ aspectRatio: `${cover.width}/${cover.height}` }}>
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
          <Button variant="ghost" size="sm" className={styles.delete} onClick={onDelete}>
            delete artwork
          </Button>
        </aside>
      </div>
    </AdminPage>
  );
}
