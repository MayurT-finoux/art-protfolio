# Phase 3 — Animation polish, SEO + performance, gallery links, media domain

Status: **plan, waiting for approval** (nothing changed yet) · 2026-11-18

Covers open points 8, 11, 17 and 18 from [docs/NOTES.md](../NOTES.md). Same way of working as Phase 2:
one commit per item, lint + typecheck + build + page checks each time, pushed to `pre-prod`.
**No visual redesign.**

---

## A. Animation polish (17)

| # | What | Notes |
|---|---|---|
| A1 | **Lenis** smooth scrolling on the public site (not in `/admin`), synced with GSAP ScrollTrigger so the Home hero pin/snap still works | Lenis is in the stack but not installed yet → `npm install lenis` (only new package) |
| A2 | Hero scroll check: 20% / 80% snap rule, never rests half-blurred, blur `p × 20px` desktop / 8px mobile, Home items drop in staggered as the hero completes (design) | Fix anything that doesn't match |
| A3 | Hero blur performance (decision log: "revisit in Phase 8") — measure frame rate; if it stutters, propose options (you decide) | No visual change without your OK |
| A4 | Reduced motion everywhere: still frame, blur 0, no translate, instant snap, Lenis off | As the design says |
| A5 | **Page transitions** — the design doesn't show any | ❓ Question 1 below |

## B. SEO + performance (18)

| # | What |
|---|---|
| B1 | Page titles/descriptions for every page; project pages use their SEO title/description (fallback: teaser), artworks too (with C) |
| B2 | Share previews (Open Graph / Twitter): project cover, artwork cover, a default image for other pages |
| B3 | `sitemap.xml` (pages + live projects + artworks) and `robots.txt` (blocks `/admin`) |
| B4 | Site address in metadata (`metadataBase`) — ❓ Question 2 |
| B5 | Performance: Lighthouse on Home/Gallery/Work/About (mobile + desktop), image sizes (request only the size each frame needs), hero video loading, fonts; fix what's slow |
| B6 | Report the before/after scores in this file |

## C. `/gallery/{slug}` (8) — following the design

The design gives every artwork the URL `yurix.art/gallery/{slug}` (admin "URL & SEO", and the Shop's
"RelatedArtwork" links there), but the Gallery has no separate artwork page — only the **ArtworkLightbox**. So:

- `/gallery/{slug}` opens the Gallery with that artwork's lightbox open (unknown slug → 404).
- Opening an artwork on the Gallery changes the address to `/gallery/{slug}`; closing goes back to `/gallery`. Links can be shared.
- Each artwork URL gets its own title/description/share image (B1/B2).
- Replaces the 2026-10-11 decision "no lightbox URL".

## D. Media on your own domain (11)

Today uploads are served from Cloudflare's public `pub-….r2.dev` address (rate-limited, not meant for production).

1. **You**: in Cloudflare → R2 → your bucket → Settings → *Custom Domains* → add e.g. `media.yurix.art`
   (the domain must be on your Cloudflare account). ❓ Question 3
2. **Me**: set `R2_PUBLIC_URL` (local + Vercel), allow the new host for images, and rewrite existing file URLs
   in the database from the `r2.dev` address to the new one (artworks, projects, Home/About/Music). Old URLs keep working
   until you turn the `r2.dev` access off.

## Questions

| # | Question | Answer |
|---|---|---|
| 1 | Page transitions aren't in the design. Skip them, or add a simple fade between pages? | _open_ |
| 2 | What's the site's address? `yurix.art`, or the Vercel address for now? | _open_ |
| 3 | Do you own a domain on Cloudflare for media (e.g. `media.yurix.art`)? If not, D waits. | _open_ |

## Done when
- [ ] A–D done (or D parked until the domain exists) and checked on desktop + mobile + reduced motion
- [ ] Lighthouse scores recorded
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` pass; pushed to `pre-prod`
