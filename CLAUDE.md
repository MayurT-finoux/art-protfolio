# Yurix — portfolio website

Portfolio site for Yurix, a 2D animator and illustrator (Mumbai). Public site + custom admin CMS.
The design files from Claude Design are the finalized design and the **single source of truth**.

@AGENTS.md

## Ground rules

- Match the design exactly: layout, spacing, typography, colors, animations, and component names. Do NOT redesign, simplify, or "improve" anything visually.
- If something in the design is unclear or missing, ask — don't guess.
- Work in phases. Before each phase, explain the plan in `docs/phases/PhaseN.md` and wait for approval.
- Build public pages **one at a time, Home first**. Don't start another page until the current one is done and approved.
- Don't install libraries outside the stack below without asking.
- Never commit secrets. Keep all keys in `.env.local` (git-ignored). `.env.example` lists the keys with empty values.
- Keep files and folders organized structurally (see "Project structure").

## Tech stack

- Next.js 16 (App Router) + TypeScript. Next 16 differs from older versions: read `node_modules/next/dist/docs/` before writing Next code.
- Styling: CSS Modules (no Tailwind, no UI libraries)
- Database: Neon Postgres (project "art-portfolio", id `lucky-hat-31537393`, database `portfolio`, branch `production`, Postgres 18, AWS Singapore `aws-ap-southeast-1`)
- ORM: Drizzle ORM + drizzle-kit + `@neondatabase/serverless` (neon-http driver)
- Admin login: Better Auth (single admin account, sign-ups disabled) — `src/lib/auth.ts`, gate in `src/proxy.ts`
- Media storage: Cloudflare R2 via `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (presigned browser uploads)
- Admin forms: React Hook Form + Zod; drag-and-drop: dnd-kit; rich text: Tiptap
- Animation: GSAP + ScrollTrigger + Lenis
- Email: Resend (`src/lib/email.ts`; contact notifications + password reset; logs instead of sending without `RESEND_API_KEY`)
- Hosting: **Vercel** (production branch `phase-1`; R2 keys in Vercel env vars). `netlify.toml` kept but unused.
- Do NOT use Neon Auth, Neon Functions, or Neon Object Storage (so no `neon.ts` / `neon deploy`).

## Key features (details are in the design files)

- **Home hero**: full-screen looping background animation (MP4) with intro text. Pinned with GSAP ScrollTrigger; scrolling blurs the background, hides the intro, and brings the menu into place. Threshold snap: under 20% progress it snaps back to the start, over 20% it completes; same rule in reverse (from done, returns only if `p < 0.8`). Never rest half-blurred. Blur is live CSS `blur(p × 20px)` desktop / 8px mobile, as designed.
- **Home sections**: Selected Work (items marked Featured), Fresh (newest artworks + Instagram posts), About section, info cards, footer.
- **Pages**: Work (curated projects + project pages), Gallery (filterable by category: Traditional, Digital, Animation, Handmade; Graffiti and Comics later; empty categories auto-hide), About (Sketchbook / Editorial layouts, picked in admin). Shop, Contact, 404: later.
- **Background music**: player in the `(site)` layout so it keeps playing across public pages (not in `/admin`). Starts only after user interaction (play button). For now: MusicPlayer UI only, playback later.
- **Instagram**: Instagram API with Instagram Login (Creator account). Token stored server-side in the database, refreshed by a scheduled job. Posts cached.
- **YouTube**: custom embed with own thumbnail and play button; iframe (`youtube-nocookie.com`) loads only on click.
- **Behance / Patreon / others**: stored as links per project or artwork, shown as styled cards. No Behance API.
- **Transparent animations**: HEVC (Safari) + WebM (others), with still-frame fallback. Solid-background animations use MP4.
- **404 page**: original endless-runner game (plain JS + Canvas), lazy-loaded with `next/dynamic`, pauses when hidden, high score in the browser. Later.
- **Loader animation**: later.
- **Admin panel** at `/admin`: create, edit, reorder, hide and delete everything, as designed in `Admin.dc.html`.
- Every page fully responsive (mobile designs included) and supports `prefers-reduced-motion`.

## Phase plan

1. Project setup + Neon connection + CLAUDE.md
2. Design tokens (colors, fonts, spacing), global styles, layout shell (nav, footer, music player placeholder)
3. Public pages from the design with placeholder data — one page at a time, Home first
4. Database schema with Drizzle (projects, artworks, categories, products, settings, messages, etc.)
5. Admin panel + Better Auth login
6. Cloudflare R2 uploads
7. Integrations: Instagram, YouTube, contact form + Resend
8. Animation polish: hero scroll, transitions, Lenis
9. 404 runner game
10. SEO, performance, and deployment

Each phase has a plan file in `docs/phases/PhaseN.md`.

## Design files

Only **v6** is in scope: `design/Artist Portfolio v6.dc.html` (identical to `design/design_handoff_yurix_site/designs/Overview Canvas.dc.html`) and the handoff page files it shows.

- `design/design_handoff_yurix_site/README.md` — **read first**: tokens, behaviour, data model.
- `design/design_handoff_yurix_site/designs/`:
  - `HomePage.dc.html` — HeroAnimation, HeroIntro, MainNav, MobileMenu, SelectedWork, FreshWork, AboutSection, InfoCards
  - `WorkPage.dc.html` — WorkList, ProjectPage, ProjectVideo
  - `GalleryPage.dc.html` — GalleryFilters, GalleryGrid, ArtworkCard, ArtworkLightbox
  - `About Sketchbook.dc.html`, `About Editorial.dc.html` — About sections (+ GuideCharacter in Sketchbook)
  - `SiteFooter.dc.html`, `MusicPlayer.dc.html` — Footer, Wordmark, MusicPlayer
  - `Admin.dc.html` — all admin screens (incl. new Shop + 404 screens, not built yet)
  - `AdminLogin.dc.html` — admin sign-in · `ContactPage.dc.html` — Contact
  - `ShopStudioTable.dc.html`, `404 Sketchbook.dc.html` + `RunnerGame Sketchbook.dc.html` — not built yet
- Exact values live in inline `style="…"` attributes; component names in `data-component="…"`.
- To view: `npx serve design/design_handoff_yurix_site/designs` and open `Overview Canvas.dc.html`.
- **Not used**: HomeCollage, v3, v4, v5, v7, the "Directions" boards, `404 *`/`RunnerGame *` (until the 404 phase), and the Nocturne design system (`design/_ds/`, `design/nocturne.css`).

## Project structure

```
design/                 handoff — reference only, never imported
docs/phases/            PhaseN.md plan per phase
drizzle/                generated migrations
scripts/db-check.mts    database connection test
src/
  app/
    layout.tsx          root layout
    (site)/             public pages + layout (MainNav, Footer, MusicPlayer)
    admin/              login/, reset-password/ (open) + (cms)/ screens (layout = AdminShell)
    api/
  components/{site,home,work,gallery,about,notfound,admin}/
    <ComponentName>/<ComponentName>.tsx + <ComponentName>.module.css
  components/admin/ui/  shared admin controls (AdminUI: Panel, Field, TextInput, Toggle, Chip…; Sortable: dnd-kit)
  styles/tokens.css     design tokens
  db/index.ts           Drizzle client (DATABASE_URL, pooled)
  db/schema.ts          Drizzle schema (categories, artworks, artwork_images, site_content)
  lib/content/          cached reads (queries.ts, home.ts), shared types, seed data
  app/admin/actions.ts  server actions (save/feature/delete artwork, save Home, save Footer & social)
  lib/
```

Component folders and files are named exactly as the design's `data-component`.

**CSS Modules + animations:** define `@keyframes` inside the `.module.css` that uses them. CSS Modules renames animation names per file, so keyframes in `globals.css` don't match (and `:global()` doesn't work inside `animation`). Exception: keyframes referenced from inline `style` (e.g. `mp-eq` in MusicPlayer) stay in `globals.css`.

**Dev server:** after changing `src/app/layout.tsx`, restart `npm run dev` if the page doesn't pick it up.

## Commands

- `npm run dev` — dev server
- `npm run lint` — ESLint
- `npm run db:check` — test the database connection (both URLs)
- `npm run db:generate` / `db:migrate` / `db:studio` — drizzle-kit (uses `DATABASE_URL_UNPOOLED`)
- `npm run r2:check` — test Cloudflare R2 (upload, public read, delete)
- `npm run db:seed` — fill a fresh database with categories + Home text (no sample artworks)
- `npm run admin:create` — create the admin account, or set a new password for it (asks in the terminal)

## Environment

`.env.local` (git-ignored):
- `DATABASE_URL` — pooled connection string (app)
- `DATABASE_URL_UNPOOLED` — direct connection string (drizzle-kit migrations)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` — Cloudflare R2
- `BETTER_AUTH_SECRET` (required), `BETTER_AUTH_URL` (optional) — admin sign-in
- `RESEND_API_KEY`, `NOTIFY_EMAIL`, `EMAIL_FROM` — email (optional; logged without a key)

## Decisions log

- 2026-10-08 — Only design v6 is in scope; other explorations dropped.
- 2026-10-08 — No Enter screen (not in v6).
- 2026-10-08 — 404 page + game: deferred (not in v6). Direction (Sketchbook vs Frame) to be decided later.
- 2026-10-08 — Shop and Contact: designs come later; don't build yet.
- 2026-10-08 — Music: build the MusicPlayer UI only; playback, tracks and admin later.
- 2026-10-08 — Hero blur: live CSS blur, as the design specifies. Revisit performance in Phase 8.
- 2026-10-08 — MusicPlayer lives in `(site)/layout.tsx`, not the root layout, so it isn't in `/admin`.
- 2026-10-08 — `/gallery/{slug}` behaviour: decide later.
- 2026-10-08 — Contact email `hey@yurix.art` (replaces "hey@aditi.art" in the design). Instagram `@yurix.draws`.
- 2026-10-08 — Neon setup: skipped `neon config init`, `neon.ts` and `neon deploy` (they manage Neon Functions / buckets, which the brief excludes, and add `@neon/config`).
- 2026-10-08 — Neon agent skills in `.claude/skills/` include neon-auth, neon-functions and neon-object-storage. Ignore them: the brief excludes those products.
- 2026-10-08 — Neon CLI uses the API-key profile `default`; run CLI commands with `--profile default`.
- 2026-10-08 — Home built first, inside Phase 1 (Phase 1b), with placeholder data in `src/lib/placeholder/home.ts`.
- 2026-10-08 — Responsive breakpoint: mobile ≤ 767px. Between 768 and 1440 the desktop values apply.
- 2026-10-08 — Where the handoff README and the design code differ, follow the design code (e.g. hero range 600/480px, nav 600 weight).
- 2026-10-08 — Hero scroll vars (`--p`, `--w`, `--hide`) live on `<html>`; pages without `[data-home]` show the finished state (nav in, player hidden).
- 2026-10-08 — Yurix's change: HeroIntro on desktop: heading 122px (design 172px), intro paragraph 19px (design 22px). Mobile stays as designed (80px / 18px).
- 2026-10-08 — Yurix's change: footer Wordmark on desktop 254px (design 260px). Mobile stays 120px.
- 2026-10-08 — Admin design built before database/login/R2 (Phase 2). Placeholder data in `src/lib/placeholder/admin.ts`; client-side state in `AdminProvider`. Real URLs per screen; `[slug]` editors read params inside `<Suspense>` (Next 16 instant-navigation rule).
- 2026-10-08 — Hidden shortcut: 3 clicks on the footer Wordmark within 600 ms → `/admin`.
- 2026-10-08 — Next 16 + Cache Components: no `new Date()` / `Math.random()` during prerender in client components; wrap in `<Suspense>` or move to an event/effect.
- 2026-10-08 — Cloudflare R2: no domain yet → public `r2.dev` URL for now (custom domain before launch). Uploads: browser PUTs to a presigned URL from `/api/uploads`. The dev-only gate was **removed at Yurix's request (2026-10-11)**: uploads work on deployments too (R2 keys set in Vercel); type/size/folder still checked. Must require the login before launch. Limits: images 20 MB (JPG/PNG/WebP), video 200 MB (MP4/WebM/MOV), audio 30 MB (MP3/M4A).
- 2026-10-11 — Hosting: Vercel (Render and Netlify considered). `/admin` was hidden on deployed builds; **removed at Yurix's request (2026-10-11): admin is open on every deployment until the login (Better Auth) is added** — must be protected before launch.
- 2026-10-11 — Database live for artworks + Home (Phase 6). Reads: `"use cache"` + `cacheTag("content")`; saves: server actions + `updateTag("content")`. No `DATABASE_URL` → placeholder fallback. Other admin screens still placeholder.
- 2026-10-11 — Home Selected Work / Fresh now come from the artworks table (card label = category, lowercase).
- 2026-10-11 — Gallery (DB artworks, live only), Work + project pages (placeholder `work.ts`) and About (both layouts, `ABOUT_LAYOUT` in `about.ts`) built. Gallery questions: one mobile menu (Home's) + active page in purple; live only; lightbox shrinks to fit; no lightbox URL.
- 2026-10-11 — Yurix's change: normal system cursor; the design's custom cursor (dot + labels) is removed. `data-cursor` attributes stay in the markup but do nothing.
- 2026-10-19 — At Yurix's request: all 16 placeholder artworks deleted from the production database (categories + Home content kept) and unused R2 files deleted (only the current hero video kept). Real artworks are added through the admin.
- 2026-10-19 — At Yurix's request, **everything empty**: no placeholder images anywhere (`img()` in admin.ts returns "", Home stills "", stills cleared in the DB), no sample projects (`work.ts`, `admin.ts`), no sample Instagram posts. Frames show their fill color; the hero shows its dark fallback (or the uploaded video). Text copy stays. Backgrounds go through `bgImage()` (`src/lib/bgImage.ts`); empty `[slug]` lists use `slugParams()` (`src/lib/staticParams.ts`) because Next 16 needs ≥1 static param. `db:seed` now only seeds categories + Home text.
- 2026-10-19 — Yurix's change: MainNav + MobileMenu show a "home" link first on every page except Home (not in the design).
- 2026-10-19 — New design handoff (zip) replaced `design/design_handoff_yurix_site/`: adds AdminLogin, Contact, Shop, 404, admin Shop/404 screens. Already-built pages unchanged. Home stays v6 (the handoff's v7 "Cut & Paste" Home is not adopted unless Yurix says so).
- 2026-10-19 — Admin sign-in built (Phase 8): Better Auth, sign-ups off, 5 tries / 15 min per IP (DB-stored), reset link 30 min. `/admin` gate = proxy **rewrite** to the sign-in screen (redirects broke behind Codespaces). All admin actions + `/api/uploads` require a session again (reverses the 2026-10-11 "open admin" state). Added (not in design): `/admin/reset-password` page and a sidebar "sign out".
- 2026-10-19 — Contact page built (Phase 8): messages → `contact_messages`, Resend notification to `NOTIFY_EMAIL`, honeypot spam guard.
- 2026-10-19 — Bug fix: admin "Footer & social" now saves (site_content "footer": wordmark, say-hi label, location, email, copyright, Instagram/Behance/YouTube URLs). Used by the footer, mobile menu, Home follow button and Contact page; empty social links are hidden. Instagram connection panel is still placeholder. About page SocialLinks still come from `about.ts`.
- 2026-10-08 — Connection test runs on Node 24's built-in TypeScript support (`node --env-file`), no `tsx`/`dotenv`.
