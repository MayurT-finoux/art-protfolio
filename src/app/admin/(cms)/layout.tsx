import { AdminShell } from "@/components/admin/AdminShell/AdminShell";
import { getArtworks } from "@/lib/content/queries";

// Admin CMS shell: no MainNav, Footer, MusicPlayer or custom cursor.
// Signed-in admins only (src/proxy.ts redirects everyone else to /admin/login).
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const artworks = await getArtworks();
  return <AdminShell artworkCount={artworks.length}>{children}</AdminShell>;
}
