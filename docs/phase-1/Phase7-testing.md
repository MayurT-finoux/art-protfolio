# Phase 7 — Testing system

Status: **plan, waiting for approval** (nothing installed, no tests written)

Requested 2026-10-11: a complete testing system, tests for everything built so far, a test run and `docs/test-report.md`.
Rules: never touch the production database, mock every external service, never change app code or design to make a test pass (bugs go in the report, fixes need approval), test only what exists.

---

## 1. What exists today (tested) vs. pending (listed only)

| Area | Status | Tested how |
|---|---|---|
| Home (hero video/still, scroll blur, snap, reduced motion, Selected Work, Fresh, About, InfoCards, footer, custom cursor, music player UI) | built | unit, component, e2e, a11y, visual, perf |
| Gallery, Work + project pages, About (both layouts) | **being built now** | same, once they land |
| Admin design (all 12 screens) | built | e2e smoke, a11y, visual |
| Admin saving: artworks (create/edit/feature/delete/draft-live), Home content | built | integration (test DB), e2e |
| Uploads (`/api/uploads` + browser PUT to R2) | built | integration + e2e with R2 mocked |
| Database schema / migrations / seed | built | integration on the `test` branch |
| Shop, product page, Contact + custom order form, Resend, 404 game, Instagram API + token refresh, music playback, login (Better Auth), admin saving for projects/categories/nav/music/footer/microcopy/about, transparent HEVC/WebM serving, next/image | **not built** | listed as **Pending** in the report |

Things I already know will show up as findings (not failures I'll "fix"):
- `/admin`, its server actions and `/api/uploads` are **open without login** (by your choice, until Better Auth). Reported as a High security risk under Pending/Recommendations.
- Images use CSS backgrounds, not `next/image` → no WebP/AVIF. Reported under Performance.
- Your test list says reduced motion = "no pinning/snap"; the **design** says "the snap jumps instantly". Tests follow the design and note the difference.

## 2. Tools to install (all devDependencies — need your OK)

| Package | Why |
|---|---|
| `vitest`, `@vitest/coverage-v8` | unit + integration tests, code coverage |
| `@vitejs/plugin-react`, `vite-tsconfig-paths` | JSX + the `@/` import alias inside Vitest |
| `jsdom` | browser-like environment for component tests |
| `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom` | component tests |
| `msw` | mock external HTTP APIs (R2 now; Instagram / Resend / YouTube when built) |
| `@playwright/test` (+ browsers: Chromium, Firefox, WebKit, ~1 GB, installed with system deps) | end-to-end, visual baselines |
| `@axe-core/playwright` | accessibility |
| `@lhci/cli` | Lighthouse CI (uses Playwright's Chromium) |

(`vite-tsconfig-paths`, `@vitest/coverage-v8`, `jsdom` and the extra Testing Library packages aren't named in your list but are needed for those tools to work.)

## 3. Folder structure

```
tests/
  setup/            vitest.setup.ts, env-guard.ts, msw/{server,handlers}.ts, db.ts (reset + seed test branch)
  fixtures/         tiny.jpg, tiny.png, tiny.webp, clip.mp4, wrong.gif, oversize generator
  unit/             uploads rules, slugify, relative dates, seed data, content types, cover ratios
  integration/      server actions vs. test DB (Zod rejects, create/edit/feature/delete), cached queries,
                    /api/uploads route, migrations run cleanly, placeholder fallback without DATABASE_URL
  components/       RTL: MusicPlayer, MainNav/MobileMenu, Footer wordmark shortcut, SelectedWork card,
                    FreshWork card, admin Toggle/Chip/ReorderButtons/SortableList, ArtworkList, FilePicker,
                    Gallery filters/lightbox (when built)
  e2e/              pages, navigation-links, hero-scroll, reduced-motion, gallery, work, about,
                    admin, admin-to-site, uploads, security
  a11y/             axe on every page × desktop/mobile + keyboard paths (menu, filters, lightbox)
  visual/           baselines for every page + key states; design-compare screenshots
  perf/             lighthouserc.cjs, page-weight.spec.ts
vitest.config.ts · playwright.config.ts
docs/test-report.md · docs/test-artifacts/   (failure screenshots, traces, design-compare images)
```

## 4. Neon `test` branch (production is never touched)

1. `neon branches create --name test --parent production` (copy of today's schema + placeholder data).
2. Its pooled + direct connection strings → **`.env.test`** (gitignored: already covered by `.env*`).
3. `tests/setup/env-guard.ts` runs before every DB test and the e2e server: it **aborts** if `DATABASE_URL`'s host is the production host from `.env.local`.
4. Before integration/e2e runs: migrate the test branch, truncate tables, re-seed (`tests/setup/db.ts`), so every run starts identical.
5. The e2e server is `next build && next start` with env vars injected **explicitly from `.env.test`** — Next otherwise auto-loads `.env.local` (production). Fake R2 keys only.

## 5. Mocks

| Service | Unit/integration (Node) | E2E (browser) |
|---|---|---|
| Cloudflare R2 | fake keys; signing is offline; MSW intercepts any `*.r2.cloudflarestorage.com` / `*.r2.dev` calls | Playwright `page.route` answers the PUT (200 or error) and serves test media for `*.r2.dev` |
| Wikimedia placeholder images | — | `page.route` serves local fixture images (fast, no network, stable screenshots) |
| Google Fonts | self-hosted by next/font at build | — |
| YouTube | — | `page.route` blocks `youtube-nocookie.com` and asserts no request before clicking play |
| Instagram, Resend | handlers prepared, tests Pending | Pending |

Any un-mocked external request fails the test.

## 6. Browser / device matrix (Playwright projects)

| Project | Browser | Viewport |
|---|---|---|
| desktop-chromium | Chromium | 1440×900 (design size) |
| desktop-firefox | Firefox | 1440×900 |
| desktop-webkit | WebKit (Safari) | 1440×900 |
| iphone | WebKit | iPhone 14 (390×844, the design's mobile size) |
| android | Chromium | Pixel 7 (412×915) |

## 7. Visual tests vs. the design
- **Regression baselines**: screenshots of every page and key states (hero start/done, mobile menu open, lightbox, admin screens) per project. Future runs fail on unexpected change.
- **Design comparison** (report only, never changes code): each design file is opened at the same size and screenshotted next to the built page; the report shows both plus a pixel-difference %. Known intentional differences (your hero/wordmark size changes, live content) are listed.

## 8. Scripts

| Script | Runs |
|---|---|
| `test` | `test:unit` |
| `test:unit` | Vitest unit + component + integration (with coverage) |
| `test:e2e` | Playwright functional specs, all 5 projects |
| `test:visual` | Playwright visual specs (`--update-snapshots` via `test:visual -- -u` to refresh baselines) |
| `test:a11y` | Playwright + axe |
| `test:perf` | Lighthouse CI (mobile + desktop) + page-weight spec |
| `test:all` | everything above, then writes the report data |

## 9. Order of work (after approval)
1. Install + configs + env guard + Neon `test` branch + `.env.test` + DB reset/seed helper + MSW/route mocks.
2. Unit tests → 3. Integration (DB, actions, uploads route, migrations) → 4. Component tests.
5. E2E: pages/no console errors, navigation & footer links, hero scroll + snap + reduced motion, admin (screens, save → visible on Home, featured order, delete confirm, uploads accept/reject).
6. E2E for Gallery / Work / About (after those pages land).
7. Security (secrets in client bundles + repo, `.env` ignored, open admin noted), a11y + keyboard, visual + design compare, Lighthouse + page weight.
8. Run everything, write `docs/test-report.md`, artifacts in `docs/test-artifacts/`, add "How to run the tests" to CLAUDE.md, commit. **Bugs found are reported, not fixed** — I'll ask you first.

## Questions
| # | Question | Answer |
|---|---|---|
| 1 | OK to install the packages in section 2 (incl. the 4 helpers not in your list) and Playwright's 3 browsers? | _open_ |
| 2 | OK to create the Neon branch `test` from `production` (uses your Neon API key in the CLI profile)? | _open_ |
| 3 | Commit visual baseline screenshots to git (a few MB, makes regressions checkable later)? | _open_ |
