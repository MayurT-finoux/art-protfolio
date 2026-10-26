import { GalleryBrowser } from "./GalleryBrowser";
import type { GalleryChip, GalleryItem } from "./types";
import styles from "./GalleryPage.module.css";

type Props = { items: GalleryItem[]; chips: GalleryChip[] };

export function GalleryPage({ items, chips }: Props) {
  const total = String(items.length);

  return (
    <section data-component="GalleryPage" className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titles}>
          <span className={styles.label}>
            {total} pieces<span className={styles.desktopOnly}> · everything, unfiltered</span>
          </span>
          <h1 className={styles.heading}>gallery</h1>
        </div>
        <p className={styles.intro}>
          Paintings, pixels, loops and things made with glue. Tap anything to see it up close.
        </p>
      </header>
      <GalleryBrowser items={items} chips={chips} />
    </section>
  );
}
