// TEMPORARY sample content (Yurix's request, 2026-11-18): artworks + projects with
// placeholder images, so every page can be checked before the real work is added.
//
//   npm run db:samples              add the samples (skips ones already there)
//   npm run db:samples -- --remove  delete them again (only these slugs; your own work stays)
//
// Samples are normal rows: edit, replace or delete them in the admin like anything else.
// The site caches content for up to an hour: restart `npm run dev`, redeploy, or save
// anything in the admin to see the change right away.
import { neon } from "@neondatabase/serverless";
import { eq, inArray, max } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema.ts";
import { sampleUrl, type SampleKey } from "../src/lib/placeholder/images.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL is not set in .env.local");
  process.exit(1);
}
const db = drizzle({ client: neon(url), schema });
const { artworks, artworkImages, projects, siteContent } = schema;
const remove = process.argv.includes("--remove");

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const IG = "https://www.instagram.com/yurix.draws/";
const DESCRIPTIONS: Record<string, string> = {
  Traditional: "Painted at the window during the first week of rain. The paper buckled; I kept it.",
  Digital: "Drawn on the iPad on a slow Sunday. Started as a doodle in a meeting.",
  Animation: "A short loop made frame by frame. Plays muted on the card, full version on YouTube.",
  Handmade: "A small object made by hand. Shown from a few sides so you can see the bumps.",
};

type Art = [title: string, category: string, year: string, key: SampleKey, focus: string, ratio: string, materials: string[], views: string[], draft?: boolean];
const ARTWORKS: Art[] = [
  ["monsoon window", "Traditional", "2026", "venus", "center", "4/5", ["Watercolour", "Cold-press paper"], ["front"]],
  ["frog choir", "Digital", "2026", "kand", "left center", "1/1", ["Procreate", "iPad Pro"], ["final"]],
  ["moth lullaby loop", "Animation", "2026", "klimt", "center", "2/3", ["Procreate Dreams", "24 frames"], ["loop"]],
  ["clay ghost", "Handmade", "2026", "pearl", "center 30%", "3/4", ["Air-dry clay", "Acrylic", "Varnish"], ["front", "side", "detail"]],
  ["night shift", "Digital", "2025", "starry", "right center", "4/3", ["Procreate"], ["final"]],
  ["static hearts", "Traditional", "2025", "scream", "center 35%", "9/14", ["Gouache", "Ink"], ["before", "after"]],
  ["neon auto ride", "Animation", "2025", "starry", "center", "1/1", ["Procreate Dreams", "After Effects"], ["loop"]],
  ["sticker sheet 03", "Handmade", "2025", "kand", "center", "4/5", ["Risograph", "Vinyl", "Die-cut"], ["sheet", "close-up"]],
  ["pigeon study", "Traditional", "2025", "wave", "left center", "3/4", ["Graphite", "Charcoal"], ["front"]],
  ["slow static loop", "Animation", "2025", "wave", "center", "16/10", ["TVPaint", "8 fps"], ["loop"]],
  ["chai break", "Digital", "2025", "klimt", "center bottom", "2/3", ["Procreate"], ["final"]],
  ["paper moon", "Handmade", "2024", "monet", "center", "1/1", ["Cut paper", "Glue", "Thread"], ["front", "angle"], true],
  ["bus stop", "Traditional", "2024", "pearl", "center top", "4/5", ["Oil on canvas"], ["front"]],
  ["tiny gods", "Animation", "2024", "monet", "center", "3/4", ["TVPaint"], ["loop"]],
  ["rooftop", "Digital", "2024", "venus", "right center", "5/4", ["Procreate", "Photoshop"], ["final"]],
  ["embroidered cat", "Handmade", "2024", "scream", "center", "1/1", ["Embroidery floss", "Linen"], ["before", "after"]],
];
/** Featured on Home, in this order (Selected Work). */
const FEATURED = ["monsoon window", "moth lullaby loop", "frog choir", "clay ghost", "neon auto ride", "static hearts", "slow static loop"];

type Proj = [title: string, kind: string, year: string, client: string, role: string, tools: string, key: SampleKey, teaser: string, youtube: string, behance: boolean];
const PROJECTS: Proj[] = [
  ["moth lullaby", "music video", "2026", "Lalit & The Lamps", "Direction, animation", "Procreate Dreams, After Effects", "klimt", "A three-minute lullaby for a band that only plays after midnight.", "aqz-KE-bpKQ", true],
  ["ghost roommate", "short series", "2026", "Personal", "Writing, animation", "Procreate Dreams", "pearl", "Six tiny episodes about sharing a flat with someone who isn't there.", "", true],
  ["neon auto ride", "loop", "2026", "Mumbai Film Fest", "Animation", "Procreate Dreams", "starry", "A night ride through Bandra, drawn on the back of a rickshaw ticket.", "aqz-KE-bpKQ", false],
  ["static hearts", "album cover", "2025", "Static Hearts", "Illustration, lettering", "Procreate, gouache", "scream", "Cover, vinyl label and a sticker sheet nobody asked for.", "", true],
  ["sticker sheet 03", "merch", "2025", "Personal", "Illustration", "Procreate, risograph", "kand", "Forty stickers, two inks, one very tired risograph machine.", "", false],
  ["slow static", "music video", "2025", "Kavya", "Direction, animation", "Procreate Dreams, TVPaint", "wave", "Hand-drawn waves at 8 frames a second, on purpose.", "aqz-KE-bpKQ", true],
];
const STORY = [
  "It started as a voice note and a single sketch on a train. The brief was loose: make something that feels like the song sounds at 2am. So I drew the first frame before writing anything down.",
  "Everything is hand-drawn, frame by frame. I kept the boil in the lines on purpose so it never sits still, and painted the backgrounds flat so the characters do the moving.",
];

const artSlugs = ARTWORKS.map(([t]) => slugify(t));
const projSlugs = PROJECTS.map(([t]) => slugify(t));
const HOME_STILLS = { heroStill: sampleUrl("starry", 1920), aboutStill: sampleUrl("klimt", 900) };

const homeRow = async () => (await db.select().from(siteContent).where(eq(siteContent.key, "home")))[0];

if (remove) {
  const a = await db.delete(artworks).where(inArray(artworks.slug, artSlugs)).returning({ slug: artworks.slug });
  const p = await db.delete(projects).where(inArray(projects.slug, projSlugs)).returning({ slug: projects.slug });
  console.log(`✓ removed ${a.length} sample artworks, ${p.length} sample projects`);
  const home = await homeRow();
  if (home) {
    const data = { ...(home.data as Record<string, unknown>) };
    for (const [k, v] of Object.entries(HOME_STILLS)) if (data[k] === v) data[k] = "";
    await db.update(siteContent).set({ data, updatedAt: new Date() }).where(eq(siteContent.key, "home"));
    console.log("✓ Home sample stills cleared");
  }
  process.exit(0);
}

// Artworks (oldest first, so the newest ones are the first rows of the list).
const existingArt = new Set((await db.select({ slug: artworks.slug }).from(artworks)).map((r) => r.slug));
let added = 0;
const now = Date.now();
for (const [i, [title, category, year, key, focus, ratio, materials, views, draft]] of [...ARTWORKS.entries()].reverse()) {
  const slug = slugify(title);
  if (existingArt.has(slug)) continue;
  const f = FEATURED.indexOf(title);
  const links = { instagram: IG, ...(category === "Animation" ? { youtube: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" } : {}) };
  const [row] = await db
    .insert(artworks)
    .values({
      slug, title, year, category, materials, links,
      description: DESCRIPTIONS[category] ?? "",
      featured: f >= 0,
      featuredOrder: f >= 0 ? f : null,
      status: draft ? "draft" : "live",
      // One day apart, newest = first in the list.
      createdAt: new Date(now - i * 86_400_000),
      updatedAt: new Date(now - i * 86_400_000),
    })
    .returning({ id: artworks.id });
  const [w, h] = ratio.split("/").map(Number);
  await db.insert(artworkImages).values(
    views.map((label, position) => ({ artworkId: row.id, url: sampleUrl(key, 1200, position), label, position, width: w, height: h, focus })),
  );
  added++;
}
console.log(`✓ sample artworks: ${added} added (${ARTWORKS.length - added} already there)`);

// Projects, after any you already have.
const existingProj = new Set((await db.select({ slug: projects.slug }).from(projects)).map((r) => r.slug));
let [{ last }] = await db.select({ last: max(projects.position) }).from(projects);
let pAdded = 0;
for (const [title, kind, year, client, role, tools, key, teaser, youtube, behance] of PROJECTS) {
  const slug = slugify(title);
  if (existingProj.has(slug)) continue;
  last = (last ?? -1) + 1;
  await db.insert(projects).values({
    slug, title, kind, year, client, role, tools, teaser,
    coverUrl: sampleUrl(key, 1800),
    story: STORY,
    process: ["thumbnails", "animatic", "line", "colour"].map((label, j) => ({ label, url: sampleUrl(key, 700, j < 3 ? 0 : j) })),
    finals: [sampleUrl(key, 1600), sampleUrl(key, 900, 1), sampleUrl(key, 900, 2)],
    youtubeId: youtube || null,
    behanceUrl: behance ? `https://www.behance.net/gallery/${slug}` : null,
    behanceText: "Every frame, colour script and the bits that didn't make it.",
    position: last,
    status: "live",
  });
  pAdded++;
}
console.log(`✓ sample projects: ${pAdded} added (${PROJECTS.length - pAdded} already there)`);

// Home stills, only where none is set.
const home = await homeRow();
if (home) {
  const data = { ...(home.data as Record<string, unknown>) };
  let changed = false;
  for (const [k, v] of Object.entries(HOME_STILLS)) {
    if (data[k]) continue;
    data[k] = v;
    changed = true;
  }
  if (changed) {
    await db.update(siteContent).set({ data, updatedAt: new Date() }).where(eq(siteContent.key, "home"));
    console.log("✓ Home stills: sample images set");
  }
}
