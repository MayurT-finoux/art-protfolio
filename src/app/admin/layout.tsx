import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell/AdminShell";
import { getArtworks } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Admin — Yurix",
  robots: { index: false, follow: false },
};

// Admin CMS shell: no MainNav, Footer, MusicPlayer or custom cursor.
// TODO (before launch): protect with Better Auth. For now it's open on every
// deployment, at Yurix's request (2026-10-11).
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const artworks = await getArtworks();
  return <AdminShell artworkCount={artworks.length}>{children}</AdminShell>;
}
