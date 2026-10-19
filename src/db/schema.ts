// Drizzle schema. First tables: what the Home page and the artwork admin need.
// Projects, nav, music, about etc. follow when their admin screens are wired.
import { bigint, boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type ArtworkLinks = { instagram?: string; behance?: string; youtube?: string };

/** Gallery categories (GalleryFilters chips), in order. */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  position: integer("position").notNull().default(0),
});

export const artworks = pgTable(
  "artworks",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    year: text("year").notNull().default(""),
    category: text("category").notNull(),
    description: text("description").notNull().default(""),
    materials: jsonb("materials").$type<string[]>().notNull().default([]),
    links: jsonb("links").$type<ArtworkLinks>().notNull().default({}),
    /** Muted preview loop (Animation only). */
    previewUrl: text("preview_url"),
    /** Selected Work on Home: max 8, ordered by featuredOrder. */
    featured: boolean("featured").notNull().default(false),
    featuredOrder: integer("featured_order"),
    status: text("status", { enum: ["draft", "live"] }).notNull().default("draft"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("artworks_status_created_idx").on(t.status, t.createdAt)],
);

/** Ordered views of an artwork; position 0 is the card cover. */
export const artworkImages = pgTable(
  "artwork_images",
  {
    id: serial("id").primaryKey(),
    artworkId: integer("artwork_id")
      .notNull()
      .references(() => artworks.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    label: text("label").notNull().default(""),
    position: integer("position").notNull().default(0),
    /** Pixel size (or aspect ratio parts) — gives the card its shape. */
    width: integer("width").notNull().default(4),
    height: integer("height").notNull().default(5),
    /** CSS background-position for the crop. */
    focus: text("focus").notNull().default("center"),
  },
  (t) => [index("artwork_images_artwork_idx").on(t.artworkId, t.position)],
);

/** Page content stored as one JSON document per page ("home", later "about", …). */
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Messages from the Contact page postcard. */
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  message: text("message").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  budget: text("budget"),
  timing: text("timing"),
  orderNo: text("order_no"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Admin sign-in (Better Auth). Field names follow Better Auth's schema. ──

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Sign-in rate limit (5 tries / 15 minutes), stored in the database so it holds on serverless. */
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});
