// Drizzle schema. First tables: what the Home page and the artwork admin need.
// Projects, nav, music, about etc. follow when their admin screens are wired.
import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
