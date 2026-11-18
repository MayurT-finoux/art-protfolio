"use client";

import type { AdminUser } from "@/lib/content/queries";
import { AdminProvider, useAdmin } from "../AdminProvider/AdminProvider";
import { AdminSidebar, type SidebarCounts } from "../AdminSidebar/AdminSidebar";
import styles from "./AdminShell.module.css";

// Sidebar | main. Each screen renders its own <AdminPage> (header + scroll area).
type Props = { counts: SidebarCounts; user: AdminUser | null; children: React.ReactNode };

export function AdminShell({ counts, user, children }: Props) {
  return (
    <AdminProvider>
      <div data-component="AdminShell" className={styles.shell}>
        <AdminSidebar counts={counts} user={user} />
        <main className={styles.main}>{children}</main>
        <SavedToast />
      </div>
    </AdminProvider>
  );
}

function SavedToast() {
  const { saved } = useAdmin();
  if (!saved) return null;
  return (
    <div className={styles.toast} role="status">
      <span className={styles.toastDot} />
      saved · live on the site in a few seconds
    </div>
  );
}
