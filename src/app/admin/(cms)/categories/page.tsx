import { CategoryManager } from "@/components/admin/CategoryManager/CategoryManager";
import { getArtworks, getCategories } from "@/lib/content/queries";

export default async function CategoriesPage() {
  const [artworks, categories] = await Promise.all([getArtworks(), getCategories()]);
  // Pieces per category; the Gallery shows a category only with live pieces.
  const counts: Record<string, { all: number; live: number }> = {};
  for (const a of artworks) {
    const c = (counts[a.category] ??= { all: 0, live: 0 });
    c.all++;
    if (a.status === "live") c.live++;
  }
  return <CategoryManager initial={categories} counts={counts} />;
}
