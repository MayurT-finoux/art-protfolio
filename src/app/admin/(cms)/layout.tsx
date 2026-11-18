import { AdminShell } from "@/components/admin/AdminShell/AdminShell";
import { getArtworks, getCategories } from "@/lib/content/queries";

// Admin CMS shell: no MainNav, Footer, MusicPlayer or custom cursor.
// Open without sign-in for now (see src/lib/adminSession.ts).
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const [artworks, categories] = await Promise.all([getArtworks(), getCategories()]);
  return <AdminShell counts={{ artworks: artworks.length, categories: categories.length }}>{children}</AdminShell>;
}
