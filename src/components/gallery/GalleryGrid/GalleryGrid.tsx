import { ArtworkCard } from "../ArtworkCard/ArtworkCard";
import type { GalleryItem } from "../GalleryPage/types";
import styles from "./GalleryGrid.module.css";

type Props = { items: GalleryItem[]; onOpen: (id: number) => void };

// CSS-columns masonry: 4 columns desktop, 2 on mobile. Re-keyed per filter so cards rise in again.
export function GalleryGrid({ items, onOpen }: Props) {
  if (!items.length) return null;
  return (
    <div data-component="GalleryGrid" className={styles.grid}>
      {items.map((a) => (
        <ArtworkCard key={a.id} art={a} onOpen={() => onOpen(a.id)} />
      ))}
    </div>
  );
}
