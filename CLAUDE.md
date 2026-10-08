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
- Admin login: Better Auth (single admin account, sign-ups disabled)
- Media storage: Cloudflare R2 (set up later)
- Admin forms: React Hook Form + Zod; drag-and-drop: dnd-kit; rich text: Tiptap
- Animation: GSAP + ScrollTrigger + Lenis
- Email: Resend (contact form notifications)
- Hosting: Vercel or Netlify, functions region Singapore (`sin1` on Vercel)
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
  - `Admin.dc.html` — all admin screens
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
    (site)/             public pages + layout (MainNav, Footer, MusicPlayer, cursor)
    admin/              CMS routes (layout = AdminShell)
    api/
  components/{site,home,work,gallery,about,notfound,admin}/
    <ComponentName>/<ComponentName>.tsx + <ComponentName>.module.css
  components/admin/ui/  shared admin controls (AdminUI: Panel, Field, TextInput, Toggle, Chip…; Sortable: dnd-kit)
  styles/tokens.css     design tokens
  db/index.ts           Drizzle client (DATABASE_URL, pooled)
  db/schema.ts          Drizzle schema
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

## Environment

`.env.local` (git-ignored):
- `DATABASE_URL` — pooled connection string (app)
- `DATABASE_URL_UNPOOLED` — direct connection string (drizzle-kit migrations)

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
- 2026-10-08 — Connection test runs on Node 24's built-in TypeScript support (`node --env-file`), no `tsx`/`dotenv`.
