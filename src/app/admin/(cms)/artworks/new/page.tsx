import { ArtworkEditor } from "@/components/admin/ArtworkEditor/ArtworkEditor";
import { featuredOrder, getArtworks, getCategories } from "@/lib/content/queries";

export default async function NewArtworkPage() {
  const [artworks, categories] = await Promise.all([getArtworks(), getCategories()]);
  return <ArtworkEditor artwork={null} categories={categories} featuredIds={featuredOrder(artworks).map((a) => a.id)} />;
}
