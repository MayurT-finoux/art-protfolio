# Phase 1 — Project setup, Neon connection, CLAUDE.md

Status: **setup done** (2026-10-08); Phase 1b (Home page) planned below

Build order for pages (from Phase 3 on): **one page at a time, Home first.**
Home must be finished and approved before work starts on any other page.

---

## 1. Design inventory

Source of truth: `design/design_handoff_yurix_site/` (README + `designs/`).
The duplicate `.dc.html` files in `design/` are byte-identical to the handoff copies.

### Final designs

| Page | File | Components (`data-component`) |
|---|---|---|
| Home | `HomePage.dc.html` | HeroAnimation, HeroIntro (scrim, scroll hint), MainNav, MobileMenu, SelectedWork, FreshWork, AboutSection, InfoCards; mobile / reduced-motion / loading states |
| Work + project page | `WorkPage.dc.html` | WorkList, ProjectPage, ProjectVideo |
| Gallery | `GalleryPage.dc.html` | GalleryFilters, GalleryGrid, ArtworkCard, ArtworkLightbox |
| About (two layouts, chosen in admin) | `About Sketchbook.dc.html`, `About Editorial.dc.html` | AboutHero, AboutStory, MediumsShowcase, ProcessSteps, ToolsSkills, JourneyTimeline, ClientsList, FunFacts, SocialLinks, AboutCTA, GuideCharacter (Sketchbook only) |
| Shared | `SiteFooter.dc.html`, `MusicPlayer.dc.html` | Footer, Wordmark, MusicPlayer; custom cursor (described in handoff README) |
| Admin | `Admin.dc.html` | AdminShell, AdminSidebar, Dashboard, ArtworkList, ArtworkEditor, SlugSeoFields, ProjectList, ProjectEditor, CategoryManager, HomeEditor, AboutEditor, NavEditor, MusicPlaylist, FooterEditor, MicrocopyEditor |

### Outside the handoff

- **404 + game** — two directions: `404 Sketchbook` (runner on ruled paper) and `404 Frame` (big "404" + Procreate-style canvas).
  Components: NotFoundPage, NotFoundMessage, RunnerGame, GameHUD, GameControlsHint, GamePauseOverlay, GameOverScreen. Prototype engine: `runner-engine.js`.
- **Likely superseded explorations** — `HomeCollage`, `Artist Portfolio v3`–`v7` (v5 contains an EnterGate; v6 = Overview Canvas), `404 Directions`, `About Page Directions`.
- **Unrelated** — the dark "Nocturne" design system in `design/_ds/` and `design/nocturne.css` contradicts the final light design.

---

## 2. Questions and decisions (answered 2026-10-08)

| # | Question | Decision |
|---|---|---|
| 1 | 404 direction: Sketchbook or Frame? | **Ignore for now.** 404 is not part of v6; revisit later. |
| 2 | Shop and Contact are "not designed yet". | **Designs come later.** Don't build these pages until then. |
| 3 | Enter screen? | **Follow v6.** v6 has no Enter screen, so there is none. |
| 4 | Music: playlist vs. single active track? | **Build the MusicPlayer UI only** (as designed). Playback, tracks and admin come later. |
| 5 | Hero blur: pre-blurred crossfade vs. live blur? | **Whichever matches the design.** The design specifies live `blur(p × 20px)` (8px mobile) + `scale(1.04 + p × 0.08)`, so build that. Needs no extra upload. Revisit performance in Phase 8. |
| 6 | Music player in `(site)/layout.tsx` instead of root layout. | **Approved.** Persists across public pages, not in `/admin`. |
| 7 | `/gallery/{slug}` URL behaviour. | **Later.** |
| 8 | Real email / Instagram handle. | Email **hey@yurix.art** (replaces "hey@aditi.art"). Instagram **@yurix.draws**. |
| 9 | Which designs are in scope? | **Only v6** (`Artist Portfolio v6.dc.html` = handoff `Overview Canvas.dc.html`) and the handoff page files it shows. HomeCollage, v3, v4, v5, v7, the Directions boards and Nocturne are dropped. |

### What v6 covers

1. **Home**: scroll-driven hero (states A start / in motion / B finished), mobile menu, reduced motion, loading skeletons
2. **Work**: WorkPage, ProjectPage; **Gallery**: GalleryPage, ArtworkLightbox
3. **Admin**: 13 screens (dashboard → about page)
4. **About**: Sketchbook and Editorial layouts (picked in admin)

Not in v6, deferred: 404 + runner game, Shop, Contact, Enter screen, Loader.

---

## 3. Folder structure

```
CLAUDE.md                     brief + decisions log (always up to date)
README.md                     normal project README
docs/
  phases/
    Phase1.md                 this file (one file per phase)
design/                       Claude Design handoff — reference only, never imported
public/                       static assets (fonts are loaded via next/font)
drizzle/                      generated migrations
drizzle.config.ts             drizzle-kit config, uses DATABASE_URL_UNPOOLED
scripts/
  db-check.mts                database connection test
.env.example                  committed, keys with empty values
.env.local                    secrets, git-ignored
src/
  app/
    layout.tsx                root layout (html, fonts, global styles)
    globals.css
    not-found.tsx             404 (later, not in v6)
    (site)/
      layout.tsx              MainNav, Footer, MusicPlayer, custom cursor
      page.tsx                Home  ← built first
      work/page.tsx
      work/[slug]/page.tsx    ProjectPage
      gallery/page.tsx
      about/page.tsx
      shop/page.tsx           later, when designed
      contact/page.tsx        later, when designed
    admin/                    Phase 5
    api/
  components/
    site/                     MainNav, MobileMenu, Footer, Wordmark, MusicPlayer, CustomCursor
    home/                     HeroAnimation, HeroIntro, SelectedWork, FreshWork, AboutSection, InfoCards
    work/                     WorkList, ProjectPage, ProjectVideo
    gallery/                  GalleryFilters, GalleryGrid, ArtworkCard, ArtworkLightbox
    about/                    AboutHero, AboutStory, … GuideCharacter
    notfound/                 NotFoundPage, RunnerGame, …
    admin/                    AdminShell, AdminSidebar, editors, …
  styles/
    tokens.css                colours, fonts, radii, spacing, easing from the handoff
  db/
    index.ts                  Drizzle client (neon-http, DATABASE_URL)
    schema.ts                 empty for now
  lib/                        shared helpers
```

Component convention: one folder per component, named exactly as its `data-component`, e.g.

```
src/components/site/MainNav/
  MainNav.tsx
  MainNav.module.css
```

---

## 4. Phase 1 steps

1. **Next.js** — scaffold with `create-next-app@latest`: TypeScript, App Router, `src/` dir, ESLint, no Tailwind, `@/*` alias.
2. **Dependencies** — only `drizzle-orm`, `@neondatabase/serverless`, and `drizzle-kit` (dev).
3. **CLAUDE.md** — full brief (ground rules, stack, features, phase plan) + "Decisions log" + "Design files" map + the build-order rule (one page at a time, Home first).
4. **README.md** — replace the Neon instructions with a normal project README.
5. **Secrets**
   - `.env.local`: `DATABASE_URL` (pooled, app) and `DATABASE_URL_UNPOOLED` (direct, drizzle-kit).
   - `.env.example` committed with empty values.
   - `.gitignore` covers `.env*.local`.
6. **Drizzle** — `src/db/index.ts` (neon-http driver), empty `src/db/schema.ts`, `drizzle.config.ts`.
7. **Connection test** — `npm run db:check` → `node --env-file=.env.local scripts/db-check.mts`.
   Prints Postgres version, host and server time. Node 24 runs TypeScript natively, so no `tsx` / `dotenv` needed.

### Neon setup (and changes vs. Neon's instructions)

| Neon step | Plan |
|---|---|
| 1. `npm i -g neon@latest && neon login` | Run. `neon login` opens a browser, so Yurix runs it with `! neon login`. |
| 2. `neon skills -y` | Run. |
| 3. `neon mcp -y` | Run. |
| 4. `neon link --project-id lucky-hat-31537393 --branch production -y` | Run, then verify: project "portfolio", Postgres 18, AWS Singapore. |
| 5. `neon config init` | **Skip** — platform-as-code for Functions / Auth / Storage, which the brief excludes. |
| 6. `neon.ts` with `@neon/config` | **Skip** — adds a library outside the stack. |
| 7. `neon deploy` | **Skip** — nothing to deploy without 5–6. Will check `neon config --help` first and report if anything is needed. |

Connection strings: taken from the Neon CLI if it gives both pooled and direct; otherwise pasted from the Neon console.

---

## 5. Done when

- [x] Next.js app runs (`npm run dev`)
- [x] CLAUDE.md created with brief + decisions log
- [x] `.env.local` filled, git-ignored; `.env.example` committed
- [x] Neon linked and verified (portfolio / PG 18 / Singapore)
- [x] `npm run db:check` prints the Postgres version
- [x] No secrets in git

## 6. Result

- Next.js 16.4 + React 19.3; `npm run lint` and `npm run build` pass.
- Neon project `lucky-hat-31537393` is named **art-portfolio**; database **portfolio**, Postgres 18.6, `aws-ap-southeast-1` (Singapore), branch `production`.
- `neon link` wrote `DATABASE_URL` (pooler host), `DATABASE_URL_UNPOOLED` (direct host) and `NEON_BRANCH` to `.env.local`.
- `npm run db:check` connects on both URLs.
- `neon skills -y` added `.claude/skills/` + `skills-lock.json`; `neon mcp -y` wrote the MCP config to `~/.claude.json` (outside the repo).
- Neon steps 5–7 (`neon config init`, `neon.ts`, `neon deploy`) skipped, as planned.
- Neon CLI auth: API key in profile `default`. The CLI's default profile is `DEFAULT`, so pass `--profile default` (or set `NEON_PROFILE=default`).

---

# Phase 1b — Working Home page

Status: **plan, waiting for approval**

Requested 2026-10-08: see a working Home page in Phase 1. This pulls the Home-related parts of
Phase 2 (tokens, shell), Phase 3 (Home only) and Phase 8 (hero scroll) forward. Other pages stay as they are.

Source: `design/design_handoff_yurix_site/designs/HomePage.dc.html` + `SiteFooter.dc.html` + `MusicPlayer.dc.html` + handoff README.

## Scope

1. **Foundations**
   - `src/styles/tokens.css`: colours, radii, spacing, shadows, easing from the handoff.
   - Fonts via `next/font/google`: Bricolage Grotesque (600/800), DM Mono (400/500), Inter (400/500/600).
   - `globals.css`: reset + base type; keyframes `pf-boil`, `pf-float`, `pf-pulse`, `pf-up`.
2. **Site shell** — `src/app/(site)/layout.tsx`
   - MainNav (desktop blur bar, items drop in), MobileMenu (full-screen, ruled lines, 01–05).
   - Footer + Wordmark (email `hey@yurix.art`).
   - MusicPlayer: UI only (no audio), visible on the hero intro only.
   - CustomCursor (desktop): dot with `mix-blend-mode: difference`, labels.
3. **Home sections** — `src/app/(site)/page.tsx`
   - HeroAnimation + HeroIntro (scrim, scroll hint).
   - SelectedWork (masonry, "loop" badge, boil on hover), FreshWork (6-col grid / mobile strip), AboutSection (floating window), InfoCards.
   - Loading skeleton styles included; Instagram error state included.
4. **Hero scroll behaviour** — progress `p` over the first viewport: blur, scale, intro fade/translate, scrim, scroll hint, wash to white, nav drop-in, MusicPlayer hide; threshold snap (0.2 / 0.8, 140ms debounce, ease-out-cubic, 300–800ms, wheel/touch cancels).
   Built with **GSAP + ScrollTrigger** (in the stack). Lenis stays in Phase 8.
5. **Reduced motion**: still frame, no blur/translate, instant snap.
6. **Responsive**: desktop (1440) + mobile (390) layouts from the design.

## Data

Hard-coded placeholder content in `src/lib/placeholder/home.ts`, shaped like the handoff data model,
so it swaps to the database in Phase 4. Images: the same Wikimedia placeholders the design uses.
Hero: the design's still image (no MP4 exists yet). Intro text: the design's placeholder copy.

## Install

- `gsap` (ScrollTrigger is included in it). Nothing else.

## Not included

- Work / Gallery / About pages (nav links will 404 until built), music playback, Instagram API, database data, Lenis.

## Done when

- [ ] Home matches `HomePage.dc.html` at 1440 and 390 widths (side-by-side check)
- [ ] Scroll: snap to start / finished works both ways, never rests half-blurred
- [ ] Reduced motion works
- [ ] `npm run lint` + `npm run build` pass
