// Cached reads for the site and admin. Every read is tagged "content";
// admin saves call updateTag("content") so changes show right away.
import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, hasDatabase } from "@/db";
import { artworkImages, artworks, categories, siteContent } from "@/db/schema";
import { DEFAULT_CATEGORIES, DEFAULT_FOOTER, DEFAULT_HOME, type ArtworkData, type FooterContent, type HomeContent } from "./types";

export const CONTENT_TAG = "content";

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  if (!hasDatabase()) return DEFAULT_HOME;
  const [row] = await db().select().from(siteContent).where(eq(siteContent.key, "home"));
  return { ...DEFAULT_HOME, ...((row?.data as Partial<HomeContent>) ?? {}) };
}

export async function getFooterContent(): Promise<FooterContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  if (!hasDatabase()) return DEFAULT_FOOTER;
  const [row] = await db().select().from(siteContent).where(eq(siteContent.key, "footer"));
  return { ...DEFAULT_FOOTER, ...((row?.data as Partial<FooterContent>) ?? {}) };
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

export async function getArtwork(slug: string): Promise<ArtworkData | null> {
  return (await getArtworks()).find((a) => a.slug === slug) ?? null;
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
