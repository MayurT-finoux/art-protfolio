# Phase 6 — Database: artworks + Home saved from the admin

Status: **built** (2026-10-11) — waiting for Yurix's test.

Requested 2026-10-11: "complete the admin upload section … make sure uploaded part is visible on my main page".
Uploaded files only show on the site once they're saved somewhere, so this phase connects the admin to Neon
for the content the Home page uses.

## What's saved

| Admin screen | Saved to | Shows on |
|---|---|---|
| Artworks list: ★ featured | `artworks.featured / featured_order` (instant) | Home → Selected Work |
| Artwork editor: images (upload, labels, order), preview loop, title, year, category, description, materials, links, URL & SEO, draft/live | `artworks`, `artwork_images` | Home → Selected Work (featured + live), Fresh (3 newest live) |
| + new artwork, delete artwork | `artworks` | Home |
| Home editor: hero loop video + still, intro texts, Selected Work / Fresh labels + buttons, About window video + texts | `site_content["home"]` | Home |

- Save = the black **save** pill (toast after it succeeds). ★ and delete act immediately.
- Pages read through cached functions (`"use cache"` + `cacheTag("content")`); every save calls `updateTag("content")`, so Home shows changes right away.
- Without `DATABASE_URL` the site falls back to the placeholder content (builds still work).

## Database
- Tables: `categories`, `artworks`, `artwork_images`, `site_content` (`src/db/schema.ts`, migration `drizzle/0000_*.sql`, applied to Neon).
- Seeded with today's placeholder content: `npm run db:seed` (only fills empty tables).

## Not saved yet (still placeholder, reset on reload)
Projects, categories screen, navigation, music, footer & social, microcopy, About page, Home's About buttons + InfoCards, Instagram.

## Vercel
Add **`DATABASE_URL`** (pooled, from `.env.local`) to Vercel → Settings → Environment Variables, then redeploy.
Without it the live site shows placeholder content and admin saves fail.

## Security (before launch)
Server actions (`src/app/admin/actions.ts`) and `/api/uploads` are open — add the Better Auth check to each.
