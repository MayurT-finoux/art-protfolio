"use client";

import { useState } from "react";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { arrayMove, SortableList } from "../ui/Sortable";
import { AddRow, DragHandle, ReorderButtons, StatusDot } from "../ui/AdminUI";
import styles from "./CategoryManager.module.css";

/** `counts`: pieces per category (all / live) from the database. */
export function CategoryManager({ counts }: { counts: Record<string, { all: number; live: number }> }) {
  const { categories, setCategories } = useAdmin();
  const [adding, setAdding] = useState<string | null>(null);

  const add = () => {
    const name = adding?.trim();
    if (name && !categories.includes(name)) setCategories([...categories, name]);
    setAdding(null);
  };

  return (
    <div data-component="CategoryManager" className={styles.manager}>
      <span className={styles.intro}>
        These become the GalleryFilters chips. &quot;All&quot; and the counts are automatic. A category with no live pieces stays
        hidden on the site.
      </span>
      <div className={styles.rows}>
        <SortableList
          items={categories}
          getId={(c) => c}
          onReorder={setCategories}
          className={styles.rows}
          renderItem={(name, i, handleProps) => {
            const n = counts[name]?.all ?? 0;
            const live = counts[name]?.live ?? 0;
            return (
              <div className={styles.row}>
                <DragHandle {...handleProps} />
                <span className={styles.name}>{name}</span>
                <span className={styles.count}>
                  {n} {n === 1 ? "piece" : "pieces"}
                </span>
                <StatusDot color={live ? "var(--ok)" : "var(--text-disabled)"} className={styles.state}>
                  {live ? "showing in filters" : "hidden until it has a piece"}
                </StatusDot>
                <ReorderButtons index={i} length={categories.length} onMove={(from, to) => setCategories(arrayMove(categories, from, to))} />
              </div>
            );
          }}
        />
        {adding == null ? (
          <AddRow onClick={() => setAdding("")}>+ add category</AddRow>
        ) : (
          <input
            autoFocus
            className={styles.addInput}
            placeholder="category name"
            aria-label="New category name"
            value={adding}
            onChange={(e) => setAdding(e.target.value)}
            onBlur={add}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
              if (e.key === "Escape") setAdding(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
