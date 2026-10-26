import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read .env.local on its own. On CI/hosting the
// variables come from the environment instead, so a missing file is fine.
try {
  process.loadEnvFile(".env.local");
} catch {}

// Migrations use the direct (unpooled) connection string.
const url = process.env.DATABASE_URL_UNPOOLED;
if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED is not set. Add it to .env.local.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
});
