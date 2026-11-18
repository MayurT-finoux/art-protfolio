# Phase 4 — Gallery page

Status: **built** (2026-10-11) — Gallery, plus Work/project pages and About (see "Also built"). Waiting for review / browser tests.

Requested 2026-10-09. Second public page after Home.
Source: `design/design_handoff_yurix_site/designs/GalleryPage.dc.html` + handoff README ("Gallery").
Data: the artworks table (same as the admin and Home), live artworks only.

---

## What gets built — `/gallery`

### Page header
- Desktop: mono label "{N} pieces · everything, unfiltered", **gallery** heading (Bricolage 800, 200px), intro on the right
  ("Paintings, pixels, loops and things made with glue. Tap anything to see it up close.").
- Mobile: "{N} pieces", 96px heading, no intro.

### GalleryFilters
- Chips: **All** + categories, each with a count. Active = ink filled.
- Desktop: chips wrap (46px, hover purple). Mobile: one horizontal swipe row (44px) that fades out on the right.
- A category with no live pieces is hidden (Comics, Graffiti stay hidden until they have pieces).

### GalleryGrid + ArtworkCard
- Masonry: 4 columns desktop (gap 20), 2 mobile (gap 12). Cards keep their own aspect ratio.
- Card: image, title, category. Cards rise in (`pf-up` 380 ms) when the filter changes.
- Desktop: lift 4px on hover, still images "boil" on hover, "1/N" badge when there are several images.
- **Animation cards**: "preview" badge; the preview plays when ≥ 40% in view (IntersectionObserver) or on hover, pauses when out of view.
  No preview MP4s exist yet, so it's the design's "boil" effect on the still; real MP4 previews plug in later.
- Reduced motion: no boil / preview, poster only.
- Empty filter: "nothing here yet. soon." (from Microcopy).
- Cursor labels: play / view.

### ArtworkLightbox
- **Desktop**: blurred dark backdrop, 1240×780 window: image (contain) + thumbnails with labels on the left,
  400px info column on the right (category · year, title, description, materials, "also on" links, "03 / 16").
  Prev / next arrow buttons; Animation pieces show "muted loop".
- **Mobile**: full-screen sheet: "03 / 16" + close, square image, thumbnails, details, link buttons, "← prev" / "next →".
- Esc closes, ← → step through the **current filter**, background scroll locked, wraps at the ends.
- Instagram / Behance / YouTube buttons only when that link is set.

### MainNav active state (shared)
- "gallery" shows purple, weight 800, with a dot under it (desktop); purple in the mobile menu.
- The nav is always "in" on Gallery (blur bar visible), as on every non-Home page.

## Structure

```
src/app/(site)/gallery/page.tsx
src/components/gallery/
  GalleryPage/        header + filters + grid + lightbox state
  GalleryFilters/
  GalleryGrid/
  ArtworkCard/
  ArtworkLightbox/
src/lib/placeholder/artworks.ts   artworks shared by Gallery + admin (moved out of admin.ts)
```

## Install
Nothing new.

## Questions

| # | Question | Answer |
|---|---|---|
| 1 | Mobile menu differs between designs. | **One menu everywhere = Home's version + current page in purple** (done in MainNav/MobileMenu). |
| 2 | Show only live artworks? | **Yes, live only.** |
| 3 | Lightbox on smaller screens? | **Shrink to fit**, same layout. |
| 4 | Lightbox URL? | **No URL for now.** |

## Done when

- [ ] `/gallery` matches `GalleryPage.dc.html` at 1440 and 390 (filters, grid, lightbox desktop + mobile)
- [ ] Filters, counts, hidden empty categories, empty state
- [ ] Lightbox: thumbnails, Esc, ← →, scroll lock, links only when set
- [ ] Animation previews play in view / on hover; reduced motion respected
- [ ] Nav shows "gallery" as active
- [ ] `npm run lint` + `npm run build` pass

## Also built (2026-10-11, at Yurix's request: "complete the remaining designs")

- **Work** `/work` + **project pages** `/work/{slug}` — `WorkPage.dc.html`. Data: `src/lib/placeholder/work.ts` (projects aren't in the database yet; the admin's ProjectEditor still uses its own placeholder copy — merge when projects move to the DB). YouTube iframe loads only after clicking play.
- **About** `/about` — both layouts (`About Sketchbook.dc.html`, `About Editorial.dc.html`). Which one shows: `ABOUT_LAYOUT` in `src/lib/placeholder/about.ts` (default `"sketchbook"`; the admin's layout switch isn't saved yet). Image slots use placeholder paintings.
- **MainNav / MobileMenu**: current page in purple (desktop: weight 800 + dot).

### Notes / open points
- Unknown `/work/{slug}` (and admin `[slug]`) show the not-found page with HTTP **200**, not 404 (Next 16 streams the page before `notFound()` runs inside `<Suspense>`).
- About's AboutCTA follows the page designs (one "say hi →" button); the admin AboutEditor shows a different heading + two buttons — decide which is right.
- About medium cards link to `/gallery` (no category deep link yet).
- Ruled paper on Sketchbook stops above the footer (the footer lives in the shared layout).
- Not yet checked in a real browser — the Phase 7 e2e/visual tests cover that.
