// Seed the database with today's placeholder content: `npm run db:seed`.
// Only fills empty tables — never overwrites what you've saved in the admin.
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema.ts";
import { seedArtworks } from "../src/lib/content/seedData.ts";
import { DEFAULT_CATEGORIES, DEFAULT_HOME } from "../src/lib/content/types.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL is not set in .env.local");
  process.exit(1);
}
const db = drizzle({ client: neon(url), schema });
const { artworks, artworkImages, categories, siteContent } = schema;

const [{ n: categoryCount }] = await db.select({ n: count() }).from(categories);
if (categoryCount === 0) {
  await db.insert(categories).values(DEFAULT_CATEGORIES.map((name, position) => ({ name, position })));
  console.log(`✓ categories: ${DEFAULT_CATEGORIES.length}`);
} else console.log("• categories: already there, skipped");

const [{ n: artworkCount }] = await db.select({ n: count() }).from(artworks);
if (artworkCount === 0) {
  for (const a of seedArtworks()) {
    const [row] = await db
      .insert(artworks)
      .values({
        slug: a.slug,
        title: a.title,
        year: a.year,
        category: a.category,
        description: a.description,
        materials: a.materials,
        links: a.links,
        featured: a.featured,
        featuredOrder: a.featuredOrder,
        status: a.status,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.createdAt),
      })
      .returning({ id: artworks.id });
    if (a.images.length) {
      await db.insert(artworkImages).values(a.images.map((im, position) => ({ ...im, artworkId: row.id, position })));
    }
  }
  console.log(`✓ artworks: ${seedArtworks().length}`);
} else console.log("• artworks: already there, skipped");

const existingHome = await db.select().from(siteContent);
if (!existingHome.some((r) => r.key === "home")) {
  await db.insert(siteContent).values({ key: "home", data: DEFAULT_HOME });
  console.log("✓ home content");
} else console.log("• home content: already there, skipped");
