"use server";

// Admin server actions. Every action checks the admin session first
// (server actions are reachable by direct POST, not just from the admin UI).
import { and, count, eq, ne, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { artworkImages, artworks, categories, projects, siteContent } from "@/db/schema";
import { requireAdmin } from "@/lib/adminSession";
import { CONTENT_TAG } from "@/lib/content/queries";
import { MAX_FEATURED, MAX_PROJECTS } from "@/lib/content/types";
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

/** Saves one site_content document and refreshes the site. */
async function writeContent(key: string, data: object) {
  await db()
    .insert(siteContent)
    .values({ key, data })
    .onConflictDoUpdate({ target: siteContent.key, set: { data, updatedAt: new Date() } });
  updateTag(CONTENT_TAG);
}

/** Slug from the given value or the title, made unique in its table. */
async function uniqueSlug(wanted: string, title: string, id?: number, table: typeof artworks | typeof projects = artworks) {
  const base = slugify(wanted) || slugify(title) || "untitled";
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const clash = await db()
      .select({ id: table.id })
      .from(table)
      .where(id ? and(eq(table.slug, candidate), ne(table.id, id)) : eq(table.slug, candidate));
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

/** Site path ("/work") or full URL. */
const linkHref = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Links start with / (a page) or https://.");

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
  aboutButtons: z.array(z.object({ label: text(60).min(1), href: linkHref })).length(2),
  infoCards: z
    .array(z.object({ label: text(40).min(1), title: text(80).min(1), text: text(200), href: linkHref }))
    .length(3),
});

export async function saveHome(raw: z.infer<typeof homeInput>): Promise<Result> {
  try {
    await requireAdmin();
    const data = homeInput.parse(raw);
    await writeContent("home", data);
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
    await writeContent("footer", data);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const categoriesInput = z
  .array(text(40).min(1, "A category needs a name."))
  .min(1, "Keep at least one category.")
  .max(30)
  .refine((names) => new Set(names.map((n) => n.toLowerCase())).size === names.length, "Two categories have the same name.");

/** Saves the Gallery categories in this order (adds new ones). */
export async function saveCategories(raw: string[]): Promise<Result> {
  try {
    await requireAdmin();
    const names = categoriesInput.parse(raw);
    await db().batch([
      db().delete(categories),
      db().insert(categories).values(names.map((name, position) => ({ name, position }))),
    ]);
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const navInput = z.object({
  items: z
    .array(z.object({ id: text(60).min(1), label: text(30).min(1, "Every link needs a label."), href: linkHref, visible: z.boolean() }))
    .max(12),
  menuWordmark: text(40),
});

export async function saveNav(raw: z.input<typeof navInput>): Promise<Result> {
  try {
    await requireAdmin();
    await writeContent("nav", navInput.parse(raw));
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const musicInput = z.object({
  on: z.boolean(),
  tracks: z.array(z.object({ name: text(120).min(1), file: text(200), duration: text(10), url })).max(30),
});

export async function saveMusic(raw: z.input<typeof musicInput>): Promise<Result> {
  try {
    await requireAdmin();
    await writeContent("music", musicInput.parse(raw));
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const microcopyInput = z.object({
  scrollHint: text(80),
  scrollHintMobile: text(40),
  emptyCategory: text(120),
  cursorPlay: text(20),
  cursorView: text(20),
  cursorOpen: text(20),
});

export async function saveMicrocopy(raw: z.input<typeof microcopyInput>): Promise<Result> {
  try {
    await requireAdmin();
    await writeContent("microcopy", microcopyInput.parse(raw));
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const s = (max: number) => text(max);
const aboutButton = z.object({ label: s(60).min(1), href: linkHref, cursor: s(30) });

const aboutInput = z.object({
  layout: z.enum(["sketchbook", "editorial"]),
  openForFreelance: z.boolean(),
  heroLabel: s(160),
  heroRole: s(160),
  heroGreeting: s(80).min(1),
  heroHeading: s(160),
  heroHeadingAccent: s(60),
  heroIntro: s(800),
  city: s(80),
  makes: s(160),
  portraitVideo: url.nullable(),
  portraitImage: z.union([url, z.literal("")]),
  portraitCaption: s(160),
  storyQuote: s(300),
  storyParagraphs: z.array(z.object({ lead: s(200), text: s(1200), doodle: z.boolean().optional() })).max(10),
  storySketches: z
    .array(z.object({ image: z.union([url, z.literal("")]), position: s(40), caption: s(120), ratio: s(10), width: s(10) }))
    .max(6),
  mediums: z
    .array(
      z.object({
        name: s(60).min(1),
        what: s(80),
        line: s(200),
        soon: z.boolean(),
        image: z.union([url, z.literal("")]),
        position: s(40),
        count: z.number().int().min(0),
        href: s(300),
        animated: z.boolean(),
      }),
    )
    .max(12),
  process: z.array(z.object({ title: s(60).min(1), line: s(200), image: z.union([url, z.literal("")]), position: s(40) })).max(10),
  tools: z.array(z.object({ name: s(80).min(1), for: s(120) })).max(20),
  skills: z.array(s(80).min(1)).max(30),
  timeline: z.array(z.object({ year: s(10), title: s(120).min(1), line: s(200) })).max(30),
  clients: z.array(z.object({ name: s(80).min(1), kind: s(80), href: s(300) })).max(40),
  clientsCta: aboutButton,
  facts: z.array(z.object({ q: s(120).min(1), a: s(200) })).max(20),
  deskImage: z.union([url, z.literal("")]),
  deskCaption: s(160),
  social: z.array(z.object({ name: s(40).min(1), handle: s(80), line: s(200), href: s(300) })).max(10),
  ctaHeading: s(120),
  ctaHeadingAccent: s(60),
  ctaText: s(600),
  ctaButtons: z.array(aboutButton).min(1).max(2),
  ctaNote: s(160),
  guideImage: z.union([url, z.literal("")]),
  guideLines: z.array(s(200)).max(20),
});

export async function saveAbout(raw: z.input<typeof aboutInput>): Promise<Result> {
  try {
    await requireAdmin();
    await writeContent("about", aboutInput.parse(raw));
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const projectInput = z.object({
  id: z.number().int().positive().optional(),
  slug: text(120),
  title: text(200).min(1, "Add a title."),
  kind: text(80),
  year: text(10),
  client: text(120),
  role: text(120),
  tools: text(200),
  teaser: text(300),
  coverUrl: z.union([url, z.literal("")]),
  coverIsVideo: z.boolean(),
  story: z.array(text(3000)).max(20),
  process: z.array(z.object({ label: text(60), url })).max(12),
  finals: z.array(url).max(20),
  youtubeId: z
    .string()
    .trim()
    .regex(/^[\w-]{6,20}$/, "That YouTube link doesn't look right.")
    .nullable(),
  behanceUrl: url.nullable(),
  behanceText: text(300),
  status: z.enum(["draft", "live"]),
  seoTitle: text(200),
  seoDescription: text(400),
});

/** Create (no id; added last) or update a project. */
export async function saveProject(raw: z.input<typeof projectInput>): Promise<Result<{ slug: string }>> {
  try {
    await requireAdmin();
    const { id, ...input } = projectInput.parse(raw);
    const slug = await uniqueSlug(input.slug, input.title, id, projects);
    const values = {
      ...input,
      slug,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      updatedAt: new Date(),
    };
    if (id) {
      await db().update(projects).set(values).where(eq(projects.id, id));
    } else {
      const [{ n }] = await db().select({ n: count() }).from(projects);
      if (n >= MAX_PROJECTS) return { ok: false, error: `Work holds ${MAX_PROJECTS} projects — remove one first.` };
      await db().insert(projects).values({ ...values, position: n });
    }
    updateTag(CONTENT_TAG);
    return { ok: true, slug };
  } catch (error) {
    return fail(error);
  }
}

/** Work order: project ids, first = wide card. */
export async function saveProjectOrder(raw: number[]): Promise<Result> {
  try {
    await requireAdmin();
    const ids = z.array(z.number().int().positive()).max(100).parse(raw);
    if (ids.length) {
      const [first, ...rest] = ids.map((id, position) => db().update(projects).set({ position }).where(eq(projects.id, id)));
      await db().batch([first, ...rest]);
    }
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
