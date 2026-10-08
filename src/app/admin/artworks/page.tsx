import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { ArtworkList } from "@/components/admin/ArtworkList/ArtworkList";

export default function ArtworksPage() {
  return (
    <AdminPage title="Artworks">
      <ArtworkList />
    </AdminPage>
  );
}
