// Database connection test: `npm run db:check`.
// Checks both connection strings in .env.local through Drizzle.
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const targets = [
  { name: "DATABASE_URL (pooled)", url: process.env.DATABASE_URL },
  { name: "DATABASE_URL_UNPOOLED (direct)", url: process.env.DATABASE_URL_UNPOOLED },
];

let failed = false;

for (const { name, url } of targets) {
  if (!url) {
    console.error(`✗ ${name}: not set in .env.local`);
    failed = true;
    continue;
  }
  try {
    const db = drizzle({ client: neon(url) });
    const { rows } = await db.execute(sql`
      select current_database() as database,
             current_setting('server_version') as version,
             now() as time
    `);
    const row = rows[0];
    console.log(`✓ ${name}: ${new URL(url).host}`);
    console.log(`  database ${row.database} · Postgres ${row.version} · ${row.time}`);
  } catch (error) {
    // Drizzle wraps driver errors; the cause holds the real reason.
    const { message, cause } = error as Error;
    console.error(`✗ ${name}: ${cause instanceof Error ? cause.message : message}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
