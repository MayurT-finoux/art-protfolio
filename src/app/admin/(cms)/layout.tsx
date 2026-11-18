import { AdminShell } from "@/components/admin/AdminShell/AdminShell";
import { getAdminUser, getArtworks, getCategories, getProjects } from "@/lib/content/queries";

// Admin CMS shell: no MainNav, Footer, MusicPlayer or custom cursor.
// Open without sign-in for now (see src/lib/adminSession.ts).
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const [artworks, projects, categories, user] = await Promise.all([
    getArtworks(),
    getProjects(),
    getCategories(),
    getAdminUser(),
  ]);
  return (
    <AdminShell counts={{ artworks: artworks.length, projects: projects.length, categories: categories.length }} user={user}>
      {children}
    </AdminShell>
  );
}
