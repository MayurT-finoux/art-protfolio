# Phase 5 — Preview deploy on Netlify

Status: **in progress** (2026-10-11) — config pushed; connect the repo in Netlify.

Requested 2026-10-11: deploy what exists now (Home) to **Netlify** as a preview to test it.
The admin isn't needed on the live site yet. (A Render plan was drafted first; Netlify was chosen instead.)

## Setup

| Setting | Value |
|---|---|
| Repo / branch | `MayurT-finoux/art-protfolio`, branch **`phase-1`** |
| Build command | `npm run build` (from `netlify.toml`) |
| Publish directory | `.next` (from `netlify.toml`) |
| Node | 24 (`NODE_VERSION` in `netlify.toml`, `engines` in `package.json`) |
| Next.js runtime | Netlify's OpenNext adapter, detected automatically (supports Next 16 + Cache Components) |
| Env vars | none needed yet (pages don't use the database; uploads are dev-only) |

- `/admin` → "not found" on deployed builds (`src/app/admin/layout.tsx`); set `ENABLE_ADMIN=true` to show it.
- `/api/uploads` already refuses requests outside local dev.
- Functions region: Netlify's free plan runs functions in the US; choosing Singapore needs a paid plan. Fine for a preview (pages are static).

## Steps
1. [x] `netlify.toml`, Node 24, admin hidden in production; build checked with `next start` (/ → 200, /admin → 404)
2. [x] Pushed to `phase-1`
3. [ ] Netlify: Add new project → Import from GitHub → `art-protfolio` → branch `phase-1` → Deploy
4. [ ] Check the live URL: fonts, hero scroll/snap, images, mobile menu, /admin → not found

## Later (before launch)
- Custom domain, R2 CORS + Netlify URL, env vars for database/R2, functions region.
