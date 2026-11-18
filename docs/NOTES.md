# Open points & notes

One list of everything still open, temporary, or decided-for-later. Updated 2026-11-18.
Decisions with dates live in the decisions log in [CLAUDE.md](../CLAUDE.md); phase plans in `docs/phase-N/`.

## Before launch (must do)

| # | What | Status |
|---|---|---|
| 1 | **Admin sign-in is off** — anyone who finds `/admin` can edit and upload. Restore: commit `fb47038` + `ADMIN_LOGIN_ENABLED = true` + `BETTER_AUTH_SECRET` in Vercel | Kept off for now (Yurix, 2026-11-18) |
| 2 | Rotate the Neon API key that was pasted in chat | OK'd by Yurix — rotate it in the Neon console |
| 3 | Change the temporary admin password (`npm run admin:create`) | Later |
| 11 | Media on a custom domain (e.g. `media.yurix.art`) instead of the public `r2.dev` URL | Approved — in [Phase 3 plan](phase-3/PLAN.md); needs your domain |

## Temporary (undo later)

| # | What | How to undo |
|---|---|---|
| 10 | **Sample content**: 16 artworks, 6 projects, Home stills in the database; sample images in default Home/About content; 3 sample Instagram posts in Fresh | `npm run db:samples -- --remove`, then `SAMPLE_IMAGES_ON = false` in `src/lib/placeholder/images.ts` |
| — | `/shop` shows an "in progress" page | Replace when the Shop is built |
| — | Music player shows the first track name; play/mute do nothing | Music playback (later) |

## Waiting on Yurix

| # | What |
|---|---|
| 4 | Section C of Phase 2: your list of small changes ("we'll share later") |
| 6 | Testing setup — 3 questions (below) |
| 20 | Admin: delete a music track (not in the design) — discuss later |
| — | Vercel: switch the production branch from `phase-1` to `pre-prod` (Settings → Git) |

### Testing setup questions (from `docs/phase-1/Phase7-testing.md`)
1. OK to install the test packages (Vitest, Testing Library, Playwright, MSW and 4 small helpers) and Playwright's 3 browsers?
2. OK to create a Neon branch `test` from `production` for the tests (so tests never touch real content)?
3. Commit the visual baseline screenshots to git (a few MB; makes visual regressions checkable later)?

## Decided — later

| # | What | Decision |
|---|---|---|
| 7 | v7 "Cut & Paste" Home in the handoff | Not adopted — stay on v6 |
| 8 | `/gallery/{slug}` | Follow the design — in [Phase 3 plan](phase-3/PLAN.md) |
| 9 | 404 page | Plain "404" page as it is now; no game for now |
| 12 | Instagram | Handle `@yurriiix` (done). API connection later (13) |
| 13 | Instagram API connection (posts in Fresh, sync) | Later |
| 14 | Shop | "In progress" page for now (done) |
| 15 | 404 runner game + its admin screen | Not now |
| 16 | Loader animation | Later |
| 17 | Animation polish (hero, Lenis, transitions) | Approved — [Phase 3 plan](phase-3/PLAN.md) |
| 18 | SEO + performance | Approved — [Phase 3 plan](phase-3/PLAN.md) |
| 19 | Project editor delete button (not in the design) | Not now — set a project to draft to hide it |
| 21 | Microcopy cursor labels | Removed (done) |
| 22 | `npm audit` warnings | Fixed: 0 vulnerabilities (done) |
| — | Phase 2: B5 sample content, B7 player as is, B8 `pre-prod` branch (`main` untouched until development is done) | Done |
