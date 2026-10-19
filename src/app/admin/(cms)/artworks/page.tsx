import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { ArtworkList } from "@/components/admin/ArtworkList/ArtworkList";
import { featuredOrder, getArtworks, getCategories } from "@/lib/content/queries";

export default async function ArtworksPage() {
  const [artworks, categories] = await Promise.all([getArtworks(), getCategories()]);
  return (
    <AdminPage title="Artworks">
      <ArtworkList artworks={artworks} categories={categories} featuredIds={featuredOrder(artworks).map((a) => a.id)} />
    </AdminPage>
  );
}
