// Cached reads for the site and admin. Every read is tagged "content";
// admin saves call updateTag("content") so changes show right away.
import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, hasDatabase } from "@/db";
import { artworkImages, artworks, categories, projects, siteContent } from "@/db/schema";
import { ABOUT_CONTENT, type AboutContent } from "@/lib/placeholder/about";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_FOOTER,
  DEFAULT_HOME,
  DEFAULT_MICROCOPY,
  DEFAULT_MUSIC,
  DEFAULT_NAV,
  type ArtworkData,
  type FooterContent,
  type HomeContent,
  type MicrocopyContent,
  type MusicContent,
  type NavContent,
  type ProjectData,
} from "./types";

export const CONTENT_TAG = "content";

/** One site_content document over its defaults (defaults alone without a database). */
async function readContent<T extends object>(key: string, defaults: T): Promise<T> {
  if (!hasDatabase()) return defaults;
  const [row] = await db().select().from(siteContent).where(eq(siteContent.key, key));
  return { ...defaults, ...((row?.data as Partial<T>) ?? {}) };
}

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return readContent("home", DEFAULT_HOME);
}

export async function getFooterContent(): Promise<FooterContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return readContent("footer", DEFAULT_FOOTER);
}

export async function getNavContent(): Promise<NavContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return readContent("nav", DEFAULT_NAV);
}

export async function getMusicContent(): Promise<MusicContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return readContent("music", DEFAULT_MUSIC);
}

export async function getMicrocopy(): Promise<MicrocopyContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return readContent("microcopy", DEFAULT_MICROCOPY);
}

export async function getAboutContent(): Promise<AboutContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return readContent("about", ABOUT_CONTENT);
}

/** All artworks, newest first, with their images in order. */
export async function getArtworks(): Promise<ArtworkData[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  if (!hasDatabase()) return [];

  const [rows, images] = await Promise.all([
    db().select().from(artworks).orderBy(desc(artworks.createdAt), desc(artworks.id)),
    db().select().from(artworkImages).orderBy(asc(artworkImages.artworkId), asc(artworkImages.position)),
  ]);
  return rows.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    year: a.year,
    category: a.category,
    description: a.description,
    materials: a.materials,
    links: a.links,
    previewUrl: a.previewUrl,
    featured: a.featured,
    featuredOrder: a.featuredOrder,
    status: a.status,
    seoTitle: a.seoTitle,
    seoDescription: a.seoDescription,
    createdAt: a.createdAt.toISOString(),
    images: images
      .filter((im) => im.artworkId === a.id)
      .map(({ url, label, width, height, focus }) => ({ url, label, width, height, focus })),
  }));
}

/** All projects (drafts too) in Work order. */
export async function getProjects(): Promise<ProjectData[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  if (!hasDatabase()) return [];
  const rows = await db().select().from(projects).orderBy(asc(projects.position), asc(projects.id));
  return rows.map(({ createdAt: _c, updatedAt: _u, ...p }) => p); // eslint-disable-line @typescript-eslint/no-unused-vars
}

export async function getCategories(): Promise<string[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  if (!hasDatabase()) return DEFAULT_CATEGORIES;
  const rows = await db().select().from(categories).orderBy(asc(categories.position));
  return rows.length ? rows.map((c) => c.name) : DEFAULT_CATEGORIES;
}

/** Featured live artworks in Home order (Selected Work). */
export function featuredArtworks(all: ArtworkData[]) {
  return all
    .filter((a) => a.featured && a.status === "live" && a.images.length)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

/** Featured artworks in admin order (drafts included), for the star positions. */
export function featuredOrder(all: ArtworkData[]) {
  return all.filter((a) => a.featured).sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

const PAGE_EDITS: Record<string, { title: string; where: string; href: string }> = {
  home: { title: "Home page", where: "Home", href: "/admin/home" },
  about: { title: "About page", where: "Page", href: "/admin/about" },
  footer: { title: "Footer & social", where: "Site", href: "/admin/footer" },
  nav: { title: "Navigation", where: "Site", href: "/admin/nav" },
  music: { title: "Music playlist", where: "Site", href: "/admin/music" },
  microcopy: { title: "Microcopy", where: "Site", href: "/admin/microcopy" },
};

export type RecentEdit = { title: string; where: string; href: string; at: string };

/** Newest saves across artworks, projects and page settings (Dashboard). */
export async function getRecentEdits(limit = 4): Promise<RecentEdit[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  if (!hasDatabase()) return [];
  const [arts, projs, pages] = await Promise.all([
    db().select({ title: artworks.title, slug: artworks.slug, at: artworks.updatedAt }).from(artworks).orderBy(desc(artworks.updatedAt)).limit(limit),
    db().select({ title: projects.title, slug: projects.slug, at: projects.updatedAt }).from(projects).orderBy(desc(projects.updatedAt)).limit(limit),
    db().select({ key: siteContent.key, at: siteContent.updatedAt }).from(siteContent),
  ]);
  return [
    ...arts.map((a) => ({ title: a.title, where: "Artwork", href: `/admin/artworks/${a.slug}`, at: a.at })),
    ...projs.map((p) => ({ title: p.title, where: "Project", href: `/admin/projects/${p.slug}`, at: p.at })),
    ...pages.flatMap((p) => (PAGE_EDITS[p.key] ? [{ ...PAGE_EDITS[p.key], at: p.at }] : [])),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, limit)
    .map((e) => ({ ...e, at: e.at.toISOString() }));
}
