"use client";

import { useMemo, useState } from "react";
import { ArtworkLightbox } from "../ArtworkLightbox/ArtworkLightbox";
import { GalleryFilters } from "../GalleryFilters/GalleryFilters";
import { GalleryGrid } from "../GalleryGrid/GalleryGrid";
import type { GalleryChip, GalleryItem } from "./types";
import styles from "./GalleryPage.module.css";

type Props = { items: GalleryItem[]; chips: GalleryChip[] };

// Filter + lightbox state for the Gallery. The lightbox steps through the current filter.
export function GalleryBrowser({ items, chips }: Props) {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<{ id: number; view: number } | null>(null);

  const list = useMemo(
    () => (filter === "All" ? items : items.filter((a) => a.category === filter)),
    [items, filter],
  );
  const at = open ? list.findIndex((a) => a.id === open.id) : -1;
  const art = at >= 0 ? list[at] : null;

  const step = (d: number) => {
    if (!list.length) return;
    const from = Math.max(0, at);
    setOpen({ id: list[(from + d + list.length) % list.length].id, view: 0 });
  };

  return (
    <>
      <GalleryFilters chips={chips} active={filter} onPick={setFilter} />
      <GalleryGrid key={filter} items={list} onOpen={(id) => setOpen({ id, view: 0 })} />
      {list.length === 0 && <div className={styles.empty}>nothing here yet. soon.</div>}
      {art && open && (
        <ArtworkLightbox
          art={art}
          view={Math.min(open.view, art.images.length - 1)}
          position={`${String(at + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`}
          onView={(view) => setOpen({ id: art.id, view })}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
