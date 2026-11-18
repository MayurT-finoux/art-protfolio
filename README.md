# Yurix — portfolio

Portfolio website and admin CMS for Yurix, 2D animator and illustrator (Mumbai).

Next.js 16 (App Router, Cache Components) · TypeScript · CSS Modules · Neon Postgres + Drizzle ORM ·
Cloudflare R2 (media) · Resend (email) · hosted on Vercel

## Getting started

Requires Node 24.

```bash
npm install
cp .env.example .env.local   # fill in the keys (see below)
npm run db:check             # test the database connection
npm run db:migrate           # create the tables (fresh database)
npm run db:seed              # categories + Home text (fresh database only)
npm run dev                  # http://localhost:3000 — admin at /admin
```

Without `DATABASE_URL` the site still runs on the default content from `src/lib/placeholder/`.

## Environment (`.env.local`, never committed)

| Key | Used for |
|---|---|
| `DATABASE_URL` | Neon pooled connection (the app) |
| `DATABASE_URL_UNPOOLED` | Neon direct connection (drizzle-kit migrations) |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` | Cloudflare R2 uploads (admin) |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Admin sign-in (switched off for now) |
| `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL` | Contact-form emails (logged to the console without a key) |

On Vercel the same keys are set as environment variables.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run db:check` | Test both database connection strings |
| `npm run db:generate` | Generate a migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Fill a fresh database with categories + Home text |
| `npm run db:samples` | Add temporary sample artworks + projects (`-- --remove` deletes them) |
| `npm run r2:check` | Test Cloudflare R2 (upload, public read, delete) |
| `npm run admin:create` | Create the admin account or set a new password |

## Where content lives

| Admin screen | Stored in | Shown on |
|---|---|---|
| Artworks | `artworks`, `artwork_images` | Gallery, Home (Selected Work, Fresh), About mediums |
| Projects | `projects` | Work, `/work/{slug}` |
| Categories | `categories` | Gallery filters |
| Home page · Footer & social · Navigation · Music · Microcopy · About page | `site_content` (one JSON document each) | the matching pages / site shell |
| Contact form | `contact_messages` (+ email) | — |

Reads are cached (`"use cache"` + tag `content`); every admin save refreshes the tag.
Still placeholder: Instagram (not connected), music playback, Shop, 404 game, loader.

**Temporary sample content** (for checking the site): 16 artworks + 6 projects in the database
(`npm run db:samples`) and sample images in the default Home/About content
(`src/lib/placeholder/images.ts`). When the real work is in: `npm run db:samples -- --remove`
and set `SAMPLE_IMAGES_ON = false`.

## Docs

- [CLAUDE.md](CLAUDE.md) — project brief, rules, decisions log
- [docs/phase-1/](docs/phase-1/) — Phase 1 notes (the first build)
- [docs/NOTES.md](docs/NOTES.md) — all open points, temporary things and decisions-for-later in one list
- [docs/phase-2/PLAN.md](docs/phase-2/PLAN.md) — Phase 2: clean-up and bug fixes
- [docs/phase-3/PLAN.md](docs/phase-3/PLAN.md) — Phase 3: animation polish, SEO + performance, gallery links, media domain
- [design/design_handoff_yurix_site/README.md](design/design_handoff_yurix_site/README.md) — design handoff (source of truth)
