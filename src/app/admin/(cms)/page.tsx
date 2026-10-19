import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { Dashboard } from "@/components/admin/Dashboard/Dashboard";
import { featuredOrder, getArtworks } from "@/lib/content/queries";

export default async function DashboardPage() {
  const artworks = await getArtworks();
  return (
    <AdminPage title="Dashboard">
      <Dashboard artworks={artworks} featured={featuredOrder(artworks)} />
    </AdminPage>
  );
}
