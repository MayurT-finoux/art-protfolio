"use client";

import { useState } from "react";
import { saveCategories } from "@/app/admin/actions";
import { AdminPage } from "../AdminPage/AdminPage";
import { arrayMove, SortableList } from "../ui/Sortable";
import { AddRow, DragHandle, ReorderButtons, StatusDot } from "../ui/AdminUI";
import styles from "./CategoryManager.module.css";

type Props = {
  /** Categories in order, from the database. */
  initial: string[];
  /** Pieces per category (all / live), from the database. */
  counts: Record<string, { all: number; live: number }>;
};

// Order + new categories are saved to the categories table (Gallery filter order).
export function CategoryManager({ initial, counts }: Props) {
  const [categories, setCategories] = useState(initial);
  const [adding, setAdding] = useState<string | null>(null);

  const add = () => {
    const name = adding?.trim();
    if (name && !categories.some((c) => c.toLowerCase() === name.toLowerCase())) setCategories([...categories, name]);
    setAdding(null);
  };

  const save = async () => {
    const result = await saveCategories(categories);
    if (!result.ok) return result.error;
  };

  return (
    <AdminPage title="Categories" onSave={save}>
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
    </AdminPage>
  );
}
