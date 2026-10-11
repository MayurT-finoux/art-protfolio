"use client";

import Link from "next/link";
import { Suspense } from "react";
import { INSTAGRAM_POSTS, img } from "@/lib/placeholder/admin";
import { MAX_FEATURED, type ArtworkData } from "@/lib/content/types";
import { ButtonLink, Panel, PanelTitle, StatusDot, Thumb } from "../ui/AdminUI";
import styles from "./Dashboard.module.css";

// Project drafts stay placeholder until projects are in the database.
const PROJECT_DRAFTS = [
  { title: "tiny gods", meta: "Project · short film · no final pieces yet", image: img("monet", 120), href: "/admin/projects/tiny-gods" },
];

const RECENT = [
  { title: "clay ghost", where: "Artwork", when: "10 min ago", href: "/admin/artworks/clay-ghost" },
  { title: "moth lullaby", where: "Project", when: "yesterday", href: "/admin/projects/moth-lullaby" },
  { title: "HeroIntro", where: "Home", when: "2 days ago", href: "/admin/home" },
  { title: "Music playlist", where: "Site", when: "last week", href: "/admin/music" },
];

const today = () =>
  new Date()
    .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })
    .toLowerCase()
    .replace(/^(\w+),? /, "$1 · ");

// Rendered in the browser: today's date can't be baked into the prerender.
function Today() {
  return <span className={styles.date}>{today()}</span>;
}

/** `featured`: featured artworks in Home order. */
export function Dashboard({ artworks, featured }: { artworks: ArtworkData[]; featured: ArtworkData[] }) {
  const drafts = [
    ...artworks
      .filter((a) => a.status === "draft")
      .map((a) => ({
        title: a.title,
        meta: `Artwork · ${a.category} · ${a.images.length} ${a.images.length === 1 ? "image" : "images"}`,
        image: a.images[0]?.url ?? "",
        href: `/admin/artworks/${a.slug}`,
      })),
    ...PROJECT_DRAFTS,
  ];

  return (
    <div data-component="Dashboard" className={styles.dashboard}>
      <div className={styles.top}>
        <div className={styles.greeting}>
          <Suspense fallback={<span className={styles.date}>&nbsp;</span>}>
            <Today />
          </Suspense>
          <h2 className={styles.hello}>hey yurix.</h2>
        </div>
        <div className={styles.quick}>
          <ButtonLink href="/admin/artworks/new" variant="primary" size="lg">
            + new artwork
          </ButtonLink>
          <ButtonLink href="/admin/projects/new" size="lg">
            + new project
          </ButtonLink>
          <ButtonLink href="/admin/home" size="lg">
            edit home
          </ButtonLink>
        </div>
      </div>

      <div className={styles.row1}>
        <Panel>
          <div className={styles.panelHead}>
            <PanelTitle>Selected Work</PanelTitle>
            <span className={styles.featCount}>
              {featured.length} of {MAX_FEATURED} featured
            </span>
          </div>
          <div className={styles.slots}>
            {Array.from({ length: MAX_FEATURED }, (_, i) => {
              const a = featured[i];
              return a ? (
                <Thumb key={i} src={a.images[0]?.url ?? ""} position={a.images[0]?.focus} className={styles.slot} />
              ) : (
                <span key={i} className={`${styles.slot} ${styles.emptySlot}`}>
                  +
                </span>
              );
            })}
          </div>
          <div className={styles.panelFoot}>
            <span className={styles.muted}>Star an artwork to feature it. Order here = order on Home.</span>
            <ButtonLink href="/admin/artworks" size="sm">
              manage →
            </ButtonLink>
          </div>
        </Panel>

        <Panel gap={14}>
          <div className={styles.panelHead}>
            <PanelTitle>Instagram</PanelTitle>
            <StatusDot color="var(--ok)" mono>
              connected
            </StatusDot>
          </div>
          <div className={styles.igGrid}>
            {INSTAGRAM_POSTS.map((key) => (
              <Thumb key={key} src={img(key, 300)} className={styles.igPost} />
            ))}
          </div>
          <span className={styles.muted}>@yurix.draws · last synced 12 min ago · newest 3 show in Fresh</span>
          <ButtonLink href="/admin/footer" size="sm" className={styles.alignStart}>
            sync now
          </ButtonLink>
        </Panel>
      </div>

      <div className={styles.row2}>
        <Panel gap={6}>
          <PanelTitle className={styles.listTitle}>Drafts</PanelTitle>
          {drafts.map((d) => (
            <Link key={d.title} href={d.href} className={styles.draftRow}>
              <Thumb src={d.image} className={styles.draftThumb} />
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{d.title}</span>
                <span className={styles.rowMeta}>{d.meta}</span>
              </span>
              <span className={styles.draftTag}>draft</span>
            </Link>
          ))}
        </Panel>

        <Panel gap={6}>
          <PanelTitle className={styles.listTitle}>Recently edited</PanelTitle>
          {RECENT.map((r) => (
            <Link key={r.title} href={r.href} className={styles.recentRow}>
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{r.title}</span>
                <span className={styles.rowMeta}>{r.where}</span>
              </span>
              <span className={styles.when}>{r.when}</span>
            </Link>
          ))}
        </Panel>
      </div>
    </div>
  );
}
