"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ARTWORKS, CATEGORIES, img } from "@/lib/placeholder/admin";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { ButtonLink, Chip, StatusDot, Thumb } from "../ui/AdminUI";
import styles from "./ArtworkList.module.css";

const LINK_ABBR = { Instagram: "IG", Behance: "BE", YouTube: "YT" } as const;

export function ArtworkList() {
  const router = useRouter();
  const { featured, toggleFeatured, artworkDraft } = useAdmin();
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const counts: Record<string, number> = { All: ARTWORKS.length };
  for (const c of CATEGORIES) counts[c] = ARTWORKS.filter((a) => a.category === c).length;

  const rows = ARTWORKS.map((a, i) => ({ a, i })).filter(
    ({ a }) =>
      (category === "All" || a.category === category) &&
      (!query || a.title.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div data-component="ArtworkList" className={styles.list}>
      <div className={styles.toolbar}>
        <div data-component="GalleryFilters" className={styles.chips}>
          {["All", ...CATEGORIES].map((c) => (
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
        {rows.map(({ a, i }) => {
          const pos = featured.indexOf(i);
          const draft = artworkDraft[a.slug];
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
              <Thumb src={img(a.imageKey, 120)} position={a.position} className={styles.thumb} />
              <span className={styles.title}>{a.title}</span>
              <span className={styles.category}>{a.category}</span>
              <span className={styles.year}>{a.year}</span>
              <span className={styles.images}>
                {a.views.length} {a.views.length === 1 ? "image" : "images"}
                {a.category === "Animation" && " + loop"}
              </span>
              <span className={styles.links}>{a.links.length ? a.links.map((l) => LINK_ABBR[l]).join(" · ") : "—"}</span>
              <button
                type="button"
                aria-label="Toggle featured"
                aria-pressed={pos >= 0}
                className={styles.star}
                data-on={pos >= 0 || undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFeatured(i);
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
