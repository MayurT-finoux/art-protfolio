import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Yurix",
  robots: { index: false, follow: false },
};

// Admin screens live in (cms) with AdminShell. Sign-in is switched off for now
// (see src/lib/adminSession.ts), so /admin opens directly.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
