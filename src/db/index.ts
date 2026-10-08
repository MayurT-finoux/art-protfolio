import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// App queries use the pooled connection string.
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local.");
}

export const db = drizzle({ client: neon(url), schema });
