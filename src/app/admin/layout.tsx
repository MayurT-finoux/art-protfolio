import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell/AdminShell";

export const metadata: Metadata = {
  title: "Admin — Yurix",
  robots: { index: false, follow: false },
};

// The admin has no login yet, so deployed builds hide it ("not found").
// It works in `npm run dev`, or anywhere with ENABLE_ADMIN=true.
const adminEnabled = process.env.NODE_ENV === "development" || process.env.ENABLE_ADMIN === "true";

// Admin CMS shell: no MainNav, Footer, MusicPlayer or custom cursor.
// Login (Better Auth) comes when the admin is wired to the database.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!adminEnabled) notFound();
  return <AdminShell>{children}</AdminShell>;
}
