# Phase 2 — Clean up, fix bugs, small changes

Status: **A + B done** (one commit per item) on `phase-2`, merged into `pre-prod` · C (your small changes) still to come · 2026-11-18

Phase 1 (everything so far: setup, Home, admin, R2, database, Gallery/Work/About, Contact, deploy) built the
structure. Phase 2 makes it tidy and correct: remove what isn't needed, fix what's broken, then your small changes.
**No visual redesign** — the site should look the same after the cleanup (except fixes you approve).

---

## A. Remove unnecessary code and files

| # | What | Why | Risk |
|---|---|---|---|
| A1 | Placeholder data that nothing uses: in `src/lib/placeholder/admin.ts` the 16 sample artworks, descriptions, featured list, footer fields, socials, `wikimediaImg`, sample-project builder; the sample-project builder in `work.ts`; empty sample lists in `home.ts` | Leftovers from before the database; content now comes from the DB or is empty on purpose | none |
| A2 | `img()` placeholder helper (always returns "") + its calls | Images were removed; frames already show their fill | none |
| A3 | Unused exports/types (e.g. `getArtwork`, `r2Bucket`, `Note`, `ArtworkStatus`, `wikimediaImg`, unused `contact.ts` constants) | Dead code found by the audit | none |
| A4 | `netlify.toml` | Hosting is Vercel | none |
| A5 | Old notes `docs/phases/Phase1–8.md` → moved to `docs/phase-1/` (kept as history) | Clear "Phase 1 / Phase 2" folders matching how you number phases | none |
| A6 | Design folder: the old copies and dropped explorations in `design/` root (v3, v4, v5, v7, HomeCollage, Directions boards, 404 Frame, `_ds/` Nocturne, `nocturne.css`, duplicate `.dc.html` files) — the real source stays `design/design_handoff_yurix_site/` | ~1 MB of files we agreed not to use; avoids confusion | **your call** (they're your design files; git keeps them in history) |
| A7 | Neon agent skills we don't use (`.claude/skills/neon-auth`, `neon-functions`, `neon-object-storage`, `neon-ai-gateway`) | The brief excludes those Neon products | **your call** |
| A8 | Sign-in leftovers while login is off: `/api/auth` route, `admin:create` script message ("Sign in at /admin/login") | Login is switched off; keep or remove? | **your call** — I suggest *keep* (one-line switch back on), only fix the message |
| A9 | `AdminProvider` placeholder state that's no longer used (featured/draft leftovers) + `useImageReady` simplification | Cleaner admin state | none |

## B. Bugs found in the audit

| # | Bug | Fix |
|---|---|---|
| B1 | **Admin → Categories counts pieces from the deleted sample artworks** (shows 16 pieces / "showing in filters" wrongly) | Count from the database |
| B2 | Admin screens that **look editable but save nothing**: Projects, Categories, Navigation, Music, Microcopy, About page, Home's About buttons + Info cards | Either (a) connect them to the database (bigger, like Footer & social), or (b) clearly mark them "not saved yet" for now — **your call per screen** |
| B3 | Dashboard shows fake data: "Instagram connected · last synced 12 min ago", fake "Recently edited" list | Show real data (recent artworks/saves) and an honest "not connected" Instagram state |
| B4 | Sidebar shows placeholder user `hey@yurix.art` | Show "Yurix" + the admin account email, or hide while login is off |
| B5 | Home with no artworks: Selected Work shows "**00 pieces**" + empty grid; Fresh is an empty strip | Hide empty sections until there's content — **your call** (design has no empty state) |
| B6 | Unknown `/work/{slug}` (and admin `[slug]`) answer **HTTP 200** with the not-found page | Return a real 404 |
| B7 | Music player shows "lullaby for a cat (loop)" and play/mute buttons that do nothing | Hide the player until music playback is built, or leave as is — **your call** |
| B8 | `main` branch is behind `phase-1` (a `test` → `main` merge on Oct 26) | Bring `main` up to date and pick one production branch — **your call** |
| B9 | Out-of-date docs: README, Phase 5 (Netlify), CLAUDE.md sections | Rewrite README (how to run, env vars, scripts); update CLAUDE.md |
| B10 | 4 moderate `npm audit` findings in drizzle-kit's esbuild (dev tool only) | Re-check for a non-downgrade fix; otherwise document |

**+ any bugs you've found** — send them and I'll add them here.

## Progress (2026-11-18)

| # | Result |
|---|---|
| A1–A3 | Unused placeholder data, `img()`, dead exports removed |
| A4 | `netlify.toml` deleted |
| A5 | `docs/phases/` → `docs/phase-1/` |
| A6 | Design-root copies + dropped explorations deleted (handoff folder kept) |
| A7 | neon-auth / -functions / -object-storage / -ai-gateway skills removed |
| A8 | Sign-in kept (switched off); `admin:create` message fixed |
| A9 | `useImageReady` simplified; AdminProvider now only the "saved" toast |
| B1 | Categories counts from the database |
| B2 | **Connected**: Categories, Navigation, Music, Microcopy, Home About buttons + InfoCards, About page, Projects (new `projects` table) |
| B3 | Dashboard: real drafts + recently edited; Instagram "not connected" (also in Footer & social) |
| B4 | Sidebar shows the admin account from the database |
| B6 | Unknown slugs return HTTP 404 (checked with `next start`) |
| B9 | README + CLAUDE.md updated |
| B10 | `npm audit fix` (dev tools); remaining: picomatch (no fix yet), esbuild via drizzle-kit (downgrade only) |
| B5 | Your call: temporary sample content everywhere (`npm run db:samples`; remove with `-- --remove`) |
| B7 | Your call: left as is |
| B8 | Your call: new branch `pre-prod` = phase-1 + phase-2; `main` untouched until development is done |

## C. Your small changes
_To be listed — tell me what you'd like changed._

## How I'll work
1. You answer the "your call" items + list your small changes.
2. A → B → C, one commit per group, each with lint + typecheck + production build passing and the key pages checked.
3. Push to the branch you choose (B8). CLAUDE.md decisions log updated.

## Done when
- [x] No unused files/exports left (audit re-run is clean)
- [x] All approved bugs fixed and checked
- [ ] Small changes done
- [x] README + CLAUDE.md current
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` pass; pushed
