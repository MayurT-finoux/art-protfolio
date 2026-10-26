"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { ADMIN_USER, PROJECTS } from "@/lib/placeholder/admin";
import { useAdmin } from "../AdminProvider/AdminProvider";
import { SoonTag } from "../ui/AdminUI";
import styles from "./AdminSidebar.module.css";

type Item = { label: string; href?: string; count?: number };

export function AdminSidebar({ artworkCount }: { artworkCount: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  };
  const { categories } = useAdmin();

  const groups: { name: string; items: Item[] }[] = [
    { name: "overview", items: [{ label: "Dashboard", href: "/admin" }] },
    {
      name: "content",
      items: [
        { label: "Artworks", href: "/admin/artworks", count: artworkCount },
        { label: "Projects", href: "/admin/projects", count: PROJECTS.length },
        { label: "Categories", href: "/admin/categories", count: categories.length },
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

      <div className={styles.user}>
        <span className={styles.avatar}>{ADMIN_USER.initial}</span>
        <div className={styles.userText}>
          <span className={styles.userName}>{ADMIN_USER.name}</span>
          <span className={styles.userEmail}>{ADMIN_USER.email}</span>
        </div>
        {/* Not in the design: needed now that the admin has a sign-in. */}
        <button type="button" className={styles.signOut} onClick={signOut}>
          sign out
        </button>
      </div>
    </aside>
  );
}
