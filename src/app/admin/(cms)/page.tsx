import { AdminPage } from "@/components/admin/AdminPage/AdminPage";
import { Dashboard } from "@/components/admin/Dashboard/Dashboard";
import { featuredOrder, getArtworks, getProjects, getRecentEdits } from "@/lib/content/queries";

export default async function DashboardPage() {
  const [artworks, projects, recent] = await Promise.all([getArtworks(), getProjects(), getRecentEdits()]);
  return (
    <AdminPage title="Dashboard">
      <Dashboard artworks={artworks} projects={projects} featured={featuredOrder(artworks)} recent={recent} />
    </AdminPage>
  );
}
