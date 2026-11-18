import { AdminShell } from "@/components/admin/AdminShell/AdminShell";
import { getArtworks, getCategories, getProjects } from "@/lib/content/queries";

// Admin CMS shell: no MainNav, Footer, MusicPlayer or custom cursor.
// Open without sign-in for now (see src/lib/adminSession.ts).
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const [artworks, projects, categories] = await Promise.all([getArtworks(), getProjects(), getCategories()]);
  return (
    <AdminShell counts={{ artworks: artworks.length, projects: projects.length, categories: categories.length }}>
      {children}
    </AdminShell>
  );
}
