"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminUser } from "@/lib/content/queries";
import { SoonTag } from "../ui/AdminUI";
import styles from "./AdminSidebar.module.css";

type Item = { label: string; href?: string; count?: number };

/** Sidebar counts, from the database. */
export type SidebarCounts = { artworks: number; projects: number; categories: number };

/** `user`: the admin account; hidden when there is none. */
export function AdminSidebar({ counts, user }: { counts: SidebarCounts; user: AdminUser | null }) {
  const pathname = usePathname();

  const groups: { name: string; items: Item[] }[] = [
    { name: "overview", items: [{ label: "Dashboard", href: "/admin" }] },
    {
      name: "content",
      items: [
        { label: "Artworks", href: "/admin/artworks", count: counts.artworks },
        { label: "Projects", href: "/admin/projects", count: counts.projects },
        { label: "Categories", href: "/admin/categories", count: counts.categories },
      ],
    },
    {
      name: "pages",
      items: [
        { label: "Home", href: "/admin/home" },
        { label: "Shop" },
        { label: "About page", href: "/admin/about" },
        { label: "Contact page" },
        { label: "404 game" },
      ],
    },
    {
      name: "site",
      items: [
        { label: "Navigation", href: "/admin/nav" },
        { label: "Music", href: "/admin/music" },
        { label: "Footer & social", href: "/admin/footer" },
        { label: "Microcopy", href: "/admin/microcopy" },
        { label: "Loader" },
      ],
    },
  ];

  // Editors (/admin/artworks/clay-ghost) highlight their list.
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside data-component="AdminSidebar" className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.wordmark}>yurix</span>
        <span className={styles.badge}>admin</span>
      </div>

      {groups.map((group) => (
        <div key={group.name} className={styles.group}>
          <span className={styles.groupName}>{group.name}</span>
          {group.items.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className={styles.item} data-active={isActive(item.href) || undefined}>
                <span>{item.label}</span>
                {item.count != null && <span className={styles.count}>{item.count}</span>}
              </Link>
            ) : (
              <span key={item.label} className={styles.item} data-soon aria-disabled="true">
                <span>{item.label}</span>
                <SoonTag />
              </span>
            ),
          )}
        </div>
      ))}

      {user && (
        <div className={styles.user}>
          <span className={styles.avatar}>{(user.name || user.email).charAt(0).toLowerCase()}</span>
          <div className={styles.userText}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
