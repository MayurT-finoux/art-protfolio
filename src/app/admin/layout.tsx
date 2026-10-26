import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Yurix",
  robots: { index: false, follow: false },
};

// /admin/login and /admin/reset-password render without the CMS shell;
// everything else is in (cms) with AdminShell. Access is checked in src/proxy.ts.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
