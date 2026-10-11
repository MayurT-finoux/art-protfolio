import { GalleryPage } from "@/components/gallery/GalleryPage/GalleryPage";
import type { GalleryChip, GalleryItem } from "@/components/gallery/GalleryPage/types";
import { getArtworks, getCategories } from "@/lib/content/queries";
import { coverRatio } from "@/lib/content/types";

const LINKS = [
  ["instagram", "Instagram"],
  ["behance", "Behance"],
  ["youtube", "YouTube"],
] as const;

export default async function Gallery() {
  const [artworks, categories] = await Promise.all([getArtworks(), getCategories()]);

  // Live pieces with at least one image, newest first (getArtworks order).
  const items: GalleryItem[] = artworks
    .filter((a) => a.status === "live" && a.images.length > 0)
    .map((a) => ({
      id: a.id,
      title: a.title,
      year: a.year,
      category: a.category,
      description: a.description,
      materials: a.materials,
      links: LINKS.flatMap(([key, label]) => (a.links[key] ? [{ label, href: a.links[key] }] : [])),
      previewUrl: a.previewUrl,
      ratio: coverRatio(a),
      images: a.images,
    }));

  // "All" + categories in admin order; a category with no live pieces is hidden.
  const chips: GalleryChip[] = [
    { label: "All", count: items.length },
    ...categories
      .map((c) => ({ label: c, count: items.filter((a) => a.category === c).length }))
      .filter((c) => c.count > 0),
  ];

  return <GalleryPage items={items} chips={chips} />;
}
