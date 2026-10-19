"use server";

// Admin server actions. Every action checks the admin session first
// (server actions are reachable by direct POST, not just from the admin UI).
import { and, count, eq, ne, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { artworkImages, artworks, siteContent } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { CONTENT_TAG } from "@/lib/content/queries";
import { MAX_FEATURED } from "@/lib/content/types";
import { slugify } from "@/lib/placeholder/admin";

const url = z.string().trim().url().max(2000);
const optionalUrl = z.union([url, z.literal("")]).optional();
const text = (max: number) => z.string().trim().max(max);

const artworkInput = z.object({
  id: z.number().int().positive().optional(),
  slug: text(120),
  title: text(200).min(1, "Add a title."),
  year: text(10),
  category: text(60).min(1),
  description: text(5000),
  materials: z.array(text(80).min(1)).max(30),
  links: z.object({ instagram: optionalUrl, behance: optionalUrl, youtube: optionalUrl }),
  previewUrl: url.nullable(),
  status: z.enum(["draft", "live"]),
  seoTitle: text(200),
  seoDescription: text(400),
  images: z
    .array(
      z.object({
        url,
        label: text(60),
        width: z.number().int().positive().max(100000),
        height: z.number().int().positive().max(100000),
        focus: text(40),
      }),
    )
    .max(30),
});
export type ArtworkInput = z.infer<typeof artworkInput>;

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const fail = (error: unknown): { ok: false; error: string } => ({
  ok: false,
  error: error instanceof z.ZodError ? error.issues[0]?.message ?? "Invalid data." : (error as Error).message,
});

/** Slug from the given value or the title, made unique. */
async function uniqueSlug(wanted: string, title: string, id?: number) {
  const base = slugify(wanted) || slugify(title) || "untitled";
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const clash = await db()
      .select({ id: artworks.id })
      .from(artworks)
      .where(id ? and(eq(artworks.slug, candidate), ne(artworks.id, id)) : eq(artworks.slug, candidate));
    if (!clash.length) return candidate;
  }
}

/** Create (no id) or update an artwork and replace its images. */
export async function saveArtwork(raw: ArtworkInput): Promise<Result<{ slug: string }>> {
  try {
    await requireAdmin();
    const input = artworkInput.parse(raw);
    const slug = await uniqueSlug(input.slug, input.title, input.id);
    const links = Object.fromEntries(Object.entries(input.links).filter(([, v]) => v));
    const values = {
      slug,
      title: input.title,
      year: input.year,
      category: input.category,
      description: input.description,
      materials: input.materials,
      links,
      previewUrl: input.category === "Animation" ? input.previewUrl : null,
      status: input.status,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      updatedAt: new Date(),
    };
    const images = (artworkId: number) =>
      input.images.map((im, position) => ({ ...im, artworkId, position }));

    if (input.id) {
      const id = input.id;
      const imageRows = images(id);
      await db().batch([
        db().update(artworks).set(values).where(eq(artworks.id, id)),
        db().delete(artworkImages).where(eq(artworkImages.artworkId, id)),
        ...(imageRows.length ? [db().insert(artworkImages).values(imageRows)] : []),
      ]);
    } else {
      const [row] = await db().insert(artworks).values(values).returning({ id: artworks.id });
      const imageRows = images(row.id);
      if (imageRows.length) await db().insert(artworkImages).values(imageRows);
    }
    updateTag(CONTENT_TAG);
    return { ok: true, slug };
  } catch (error) {
    return fail(error);
  }
}

/** ★ Feature on Home (max 8) or unfeature; positions stay contiguous. */
export async function toggleFeatured(id: number): Promise<Result> {
  try {
    await requireAdmin();
    const [art] = await db().select().from(artworks).where(eq(artworks.id, id));
    if (!art) return { ok: false, error: "Artwork not found." };

    if (art.featured) {
      await db().batch([
        db().update(artworks).set({ featured: false, featuredOrder: null }).where(eq(artworks.id, id)),
        db()
          .update(artworks)
          .set({ featuredOrder: sql`${artworks.featuredOrder} - 1` })
          .where(and(eq(artworks.featured, true), sql`${artworks.featuredOrder} > ${art.featuredOrder ?? -1}`)),
      ]);
    } else {
      const [{ n }] = await db().select({ n: count() }).from(artworks).where(eq(artworks.featured, true));
      if (n >= MAX_FEATURED) return { ok: false, error: "All 8 slots used — unstar one first." };
      await db().update(artworks).set({ featured: true, featuredOrder: n }).where(eq(artworks.id, id));
    }
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteArtwork(id: number): Promise<Result> {
  try {
    await requireAdmin();
    const [art] = await db().select().from(artworks).where(eq(artworks.id, id));
    if (!art) return { ok: false, error: "Artwork not found." };
    await db().delete(artworks).where(eq(artworks.id, id));
    if (art.featured) {
      await db()
        .update(artworks)
        .set({ featuredOrder: sql`${artworks.featuredOrder} - 1` })
        .where(and(eq(artworks.featured, true), sql`${artworks.featuredOrder} > ${art.featuredOrder ?? -1}`));
    }
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const homeInput = z.object({
  heroVideo: url.nullable(),
  heroStill: z.union([url, z.literal("")]),
  heroLabel: text(120),
  heroHeading: text(120).min(1),
  heroIntro: text(600),
  selectedLabel: text(120),
  selectedHeading: text(80),
  selectedButton: text(60),
  freshLabel: text(120),
  freshHeading: text(80),
  followButton: text(80),
  aboutVideo: url.nullable(),
  aboutStill: z.union([url, z.literal("")]),
  aboutWindowLabel: text(80),
  aboutLabel: text(80),
  aboutParagraph1: text(1200),
  aboutParagraph2: text(1200),
});

export async function saveHome(raw: z.infer<typeof homeInput>): Promise<Result> {
  try {
    await requireAdmin();
    const data = homeInput.parse(raw);
    await db()
      .insert(siteContent)
      .values({ key: "home", data })
      .onConflictDoUpdate({ target: siteContent.key, set: { data, updatedAt: new Date() } });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/** Accepts "instagram.com/x" or a full URL; stores "https://…". Empty = hidden on the site. */
const socialUrl = z
  .string()
  .trim()
  .max(300)
  .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
  .refine((v) => v === "" || z.string().url().safeParse(v).success, "That link doesn't look right.");

const footerInput = z.object({
  wordmark: text(40).min(1, "Add a wordmark."),
  sayHiLabel: text(60),
  location: text(80),
  email: z.union([z.string().trim().email("That email doesn't look right."), z.literal("")]),
  copyright: text(160),
  instagram: socialUrl,
  behance: socialUrl,
  youtube: socialUrl,
});

export async function saveFooter(raw: z.input<typeof footerInput>): Promise<Result> {
  try {
    await requireAdmin();
    const data = footerInput.parse(raw);
    await db()
      .insert(siteContent)
      .values({ key: "footer", data })
      .onConflictDoUpdate({ target: siteContent.key, set: { data, updatedAt: new Date() } });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
