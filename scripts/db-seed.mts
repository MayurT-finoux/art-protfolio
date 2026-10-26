// Seed a fresh database with the starting content: `npm run db:seed`.
// Categories + Home text only (no sample artworks — add real ones in the admin).
// Only fills empty tables — never overwrites what you've saved in the admin.
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema.ts";
import { DEFAULT_CATEGORIES, DEFAULT_HOME } from "../src/lib/content/types.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL is not set in .env.local");
  process.exit(1);
}
const db = drizzle({ client: neon(url), schema });
const { categories, siteContent } = schema;

const [{ n: categoryCount }] = await db.select({ n: count() }).from(categories);
if (categoryCount === 0) {
  await db.insert(categories).values(DEFAULT_CATEGORIES.map((name, position) => ({ name, position })));
  console.log(`✓ categories: ${DEFAULT_CATEGORIES.length}`);
} else console.log("• categories: already there, skipped");

const existingHome = await db.select().from(siteContent);
if (!existingHome.some((r) => r.key === "home")) {
  await db.insert(siteContent).values({ key: "home", data: DEFAULT_HOME });
  console.log("✓ home content");
} else console.log("• home content: already there, skipped");
