// Starting content: today's placeholder artworks (from the admin design) in the
// shape the database uses. Seeds Neon (scripts/db-seed.mts) and is the fallback
// when no database is configured.
// Relative .ts imports so plain Node can run the seed script.
import { ARTWORKS, DESCRIPTIONS, FEATURED, img, type LinkName } from "../placeholder/admin.ts";
import type { ArtworkData } from "./types.ts";

const LINK_URL: Record<LinkName, (slug: string) => string> = {
  Instagram: () => "https://www.instagram.com/yurix.draws/",
  Behance: (slug) => `https://www.behance.net/gallery/${slug}`,
  YouTube: () => "https://youtu.be/aqz-KE-bpKQ",
};

const DAY = 24 * 60 * 60 * 1000;
// Fixed base date so seeds are reproducible; newest first, a few days apart.
const BASE = Date.parse("2026-10-09T10:00:00Z");

export function seedArtworks(): ArtworkData[] {
  return ARTWORKS.map((a, i) => {
    const [w, h] = a.pin.split("/").map(Number);
    const featuredIndex = FEATURED.indexOf(i);
    return {
      id: i + 1,
      slug: a.slug,
      title: a.title,
      year: a.year,
      category: a.category,
      description: DESCRIPTIONS[a.category] ?? "",
      materials: a.materials,
      links: Object.fromEntries(a.links.map((l) => [l.toLowerCase(), LINK_URL[l](a.slug)])),
      previewUrl: null,
      featured: featuredIndex >= 0,
      featuredOrder: featuredIndex >= 0 ? featuredIndex : null,
      status: a.draft ? "draft" : "live",
      seoTitle: null,
      seoDescription: null,
      createdAt: new Date(BASE - i * 3 * DAY).toISOString(),
      images: a.views.map((label, j) => ({
        url: img(a.imageKey, 900, j * 2),
        label,
        width: j === 0 ? w : 4,
        height: j === 0 ? h : 5,
        focus: j === 0 ? a.position : "center",
      })),
    };
  });
}
