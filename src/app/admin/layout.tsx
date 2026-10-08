import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell/AdminShell";

export const metadata: Metadata = {
  title: "Admin — Yurix",
  robots: { index: false, follow: false },
};

// Admin CMS shell: no MainNav, Footer, MusicPlayer or custom cursor.
// Login (Better Auth) comes when the admin is wired to the database.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
