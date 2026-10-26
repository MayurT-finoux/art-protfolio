"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleFeatured } from "@/app/admin/actions";
import type { ArtworkData } from "@/lib/content/types";
import { ButtonLink, Chip, StatusDot, Thumb } from "../ui/AdminUI";
import styles from "./ArtworkList.module.css";

const LINK_ABBR = { instagram: "IG", behance: "BE", youtube: "YT" } as const;

type Props = { artworks: ArtworkData[]; categories: string[]; featuredIds: number[] };

export function ArtworkList({ artworks, categories, featuredIds }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const counts: Record<string, number> = { All: artworks.length };
  for (const c of categories) counts[c] = artworks.filter((a) => a.category === c).length;
  // Chips for categories that have pieces (Comics, Graffiti appear once they do).
  const chips = ["All", ...categories.filter((c) => counts[c] > 0)];

  const star = async (id: number) => {
    const result = await toggleFeatured(id);
    if (!result.ok) window.alert(result.error);
  };

  const rows = artworks.filter(
    (a) =>
      (category === "All" || a.category === category) &&
      (!query || a.title.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div data-component="ArtworkList" className={styles.list}>
      <div className={styles.toolbar}>
        <div data-component="GalleryFilters" className={styles.chips}>
          {chips.map((c) => (
            <Chip key={c} active={category === c} count={counts[c]} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className={styles.actions}>
          <input
            className={styles.search}
            type="search"
            placeholder="search artworks"
            aria-label="Search artworks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ButtonLink href="/admin/artworks/new" variant="primary">
            + new artwork
          </ButtonLink>
        </div>
      </div>

      <div className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <span />
          <span>title</span>
          <span>category</span>
          <span>year</span>
          <span>images</span>
          <span>links</span>
          <span>featured</span>
          <span>status</span>
        </div>
        {rows.map((a) => {
          const pos = featuredIds.indexOf(a.id);
          const draft = a.status === "draft";
          const cover = a.images[0];
          const href = `/admin/artworks/${a.slug}`;
          return (
            <div
              key={a.slug}
              className={`${styles.row} ${styles.item}`}
              role="link"
              tabIndex={0}
              onClick={() => router.push(href)}
              onKeyDown={(e) => e.key === "Enter" && router.push(href)}
            >
              <Thumb src={cover?.url ?? ""} position={cover?.focus} className={styles.thumb} />
              <span className={styles.title}>{a.title}</span>
              <span className={styles.category}>{a.category}</span>
              <span className={styles.year}>{a.year}</span>
              <span className={styles.images}>
                {a.images.length} {a.images.length === 1 ? "image" : "images"}
                {a.category === "Animation" && a.previewUrl && " + loop"}
              </span>
              <span className={styles.links}>
                {(Object.keys(LINK_ABBR) as (keyof typeof LINK_ABBR)[]).filter((k) => a.links[k]).map((k) => LINK_ABBR[k]).join(" · ") || "—"}
              </span>
              <button
                type="button"
                aria-label="Toggle featured"
                aria-pressed={pos >= 0}
                className={styles.star}
                data-on={pos >= 0 || undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  void star(a.id);
                }}
              >
                ★<span className={styles.starPos}>{pos >= 0 ? pos + 1 : ""}</span>
              </button>
              <StatusDot color={draft ? "var(--text-disabled)" : "var(--ok)"}>{draft ? "draft" : "live"}</StatusDot>
            </div>
          );
        })}
      </div>
      <span className={styles.hint}>★ = shows in Selected Work on Home (max 8). Click a row to edit.</span>
    </div>
  );
}
