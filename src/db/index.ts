import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";

/** False when DATABASE_URL isn't set (e.g. a build without env vars): pages fall back to placeholder content. */
export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

let instance: NeonHttpDatabase<typeof schema> | undefined;

// App queries use the pooled connection string.
export function db() {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set. Add it to .env.local.");
    instance = drizzle({ client: neon(url), schema });
  }
  return instance;
}
