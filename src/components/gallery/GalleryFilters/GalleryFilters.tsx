import type { GalleryChip } from "../GalleryPage/types";
import styles from "./GalleryFilters.module.css";

type Props = { chips: GalleryChip[]; active: string; onPick: (label: string) => void };

// "All" + categories with counts. Desktop wraps; mobile is one horizontal swipe row.
export function GalleryFilters({ chips, active, onPick }: Props) {
  return (
    <div data-component="GalleryFilters" className={styles.filters}>
      {chips.map((c) => {
        const on = c.label === active;
        return (
          <button
            key={c.label}
            type="button"
            aria-pressed={on}
            className={on ? `${styles.chip} ${styles.on}` : styles.chip}
            onClick={() => onPick(c.label)}
          >
            {c.label}
            <span className={styles.count}>{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}
