"use client";

import { AdminProvider, useAdmin } from "../AdminProvider/AdminProvider";
import { AdminSidebar } from "../AdminSidebar/AdminSidebar";
import styles from "./AdminShell.module.css";

// Sidebar | main. Each screen renders its own <AdminPage> (header + scroll area).
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div data-component="AdminShell" className={styles.shell}>
        <AdminSidebar />
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
