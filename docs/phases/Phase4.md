# Phase 4 — Gallery page

Status: **plan, waiting for approval** (no code changes yet)

Requested 2026-10-09. Second public page after Home.
Source: `design/design_handoff_yurix_site/designs/GalleryPage.dc.html` + handoff README ("Gallery").
Placeholder data (database comes later), same artworks the admin shows.

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
| 1 | **Mobile menu differs between designs.** Home: "yurix" wordmark, 66px items, Instagram + email pills and the music player. Gallery: no wordmark/pills/player, 60px items, current page in purple. Use **one menu everywhere = Home's version + the current page in purple**? | _open_ |
| 2 | The Gallery design lists all 16 artworks, including "paper moon", which the admin marks as **draft**. Show **only live artworks** (15) as the data rules say? | _open_ |
| 3 | The lightbox is a fixed 1240×780 window. On smaller laptop screens, **shrink it to fit** (24px margin, same layout)? | _open_ |
| 4 | Earlier we put `/gallery/{slug}` "for later". Keep the lightbox without its own URL for now? | _open_ |

## Done when

- [ ] `/gallery` matches `GalleryPage.dc.html` at 1440 and 390 (filters, grid, lightbox desktop + mobile)
- [ ] Filters, counts, hidden empty categories, empty state
- [ ] Lightbox: thumbnails, Esc, ← →, scroll lock, links only when set
- [ ] Animation previews play in view / on hover; reduced motion respected
- [ ] Nav shows "gallery" as active
- [ ] `npm run lint` + `npm run build` pass
