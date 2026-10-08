# Handoff: Yurix — portfolio website + admin (CMS)

## Overview
Portfolio site for Yurix, a 2D animator and illustrator in Mumbai. It has two parts:
1. **Public website**: Home (scroll-driven animated hero), Work (curated projects) with a ProjectPage for each, and Gallery (filterable masonry plus lightbox). About (two layouts, picked in the CMS). Shop, Contact and the 404 game are not designed yet; only their Home "InfoCards" exist.
2. **Admin**: a small CMS that lets Yurix edit everything the site shows without touching code.

## About the design files
The files in `designs/` are **design references built in HTML**. They are prototypes that show the intended look and behaviour, not production code to ship. Rebuild them in the target stack. If no codebase exists yet, a good fit is **Next.js (App Router) + TypeScript**, with a headless CMS or a small custom admin on Postgres plus object storage for media. The admin screens in `Admin.dc.html` show the data model the CMS needs.

To view them, open `designs/Overview Canvas.dc.html` in a browser served over a local static server (e.g. `npx serve designs`). It shows every page and admin screen side by side; each frame is live (scroll, click, filter). Each `.dc.html` page also opens on its own. Inline `style="…"` attributes hold the exact values. Elements carry `data-component="…"` with the component names to use in code.

Images are public-domain paintings loaded from Wikimedia **as placeholders**. Replace them with Yurix's artwork via the CMS.

## Fidelity
**High-fidelity.** Final colours, type, spacing, motion and copy, except text marked "[I'll write the final text]" (the hero intro). Recreate the layout pixel-accurately.

---

## Design tokens
**Colours**
- Ink / primary text: `#131316`
- Body text on light: `#55555d`, secondary `#63636d`
- Muted / meta: `#86868f`, disabled `#9d9da5`, `#b5b5bc`, dashed borders `#c6c6cc`
- Accent purple: `#5a4bc4`, hover/dark `#443a97`, tint `#efedfb`
- Surfaces: white `#ffffff`, info cards `#f5f5f7`, image placeholder `#efeef6`, skeleton `#e8e7f0`
- Admin background `#f4f3ef`, admin toggle off `#d6d5d0`, hover row `#faf9f6`
- Hero fallback `#2a2838`
- Status: live/ok `#2f8a57`, error/delete `#c0392b`, toast dot `#8be0a6`
- Hairlines: `rgba(19,19,22,0.06 / 0.08 / 0.12 / 0.14 / 0.16 / 0.2)`

**Type** (Google Fonts)
- Display: **Bricolage Grotesque** 600/800. Headings use lowercase, weight 800 and tight tracking: −0.03em (22px admin card titles), −0.04em (30px), −0.05em (48–64px), −0.055em (56–60px).
- Labels / meta: **DM Mono** 400/500. Sizes 10–12px, uppercase, letter-spacing 0.08–0.12em.
- Body / UI: **Inter** 400/500/600. Sizes 13–15px, line-height 1.5–1.6.

**Radius**: 5 (tiny tags), 8–10 (thumbs, small buttons), 12 (inputs), 14–16 (cards, tiles), 18–20 (panels), 24 (big media), 999 (pills, chips, buttons, toggles).
**Spacing**: desktop page gutter 56px, mobile 16–20px. Section padding 28/110px (desktop), 24/64px (mobile). Grid gaps 8/12/16/22px.
**Shadows**: floating window `0 2px 6px rgba(19,19,22,.06), 0 24px 60px rgba(19,19,22,…)`; toast `0 10px 30px rgba(19,19,22,.18)`.
**Easing**: `cubic-bezier(.2,.8,.2,1)` for UI (220–460ms); ease-out-cubic for the scroll snap.

---

## Public website

### MainNav
- Items: **work · gallery · shop · about · contact**. Lowercase, Bricolage 800. The active page is purple `#5a4bc4` with a dot. No wordmark in the top bar.
- No solid bar. Over content there's a backdrop blur (14px) whose mask fades to transparent at the bottom (`mask-image: linear-gradient(180deg,#000 0%,#000 45%,transparent)`), so there's no hard edge.
- On Home, items drop in from the top (`translateY(-…)` → 0, staggered) as the hero transition completes.
- Mobile: a 48px round menu button. It opens a **full-screen menu**: white with faint ruled lines (`repeating-linear-gradient(180deg, transparent 0 39px, rgba(90,75,196,.14) 39px 40px)`), 60px Bricolage 800 items with mono numbers `01–05`, staggered `pf-up` entrance (460ms, 50ms stagger), and the MusicPlayer.
- Instagram, Behance and YouTube are **not** nav items.

### Home (`HomePage.dc.html`)
**HeroAnimation**: a full-screen looping 2D animation (`<video autoplay muted loop playsinline>`, MP4 from Procreate Dreams). It sits behind all content and stays fixed.

**HeroIntro**, placed bottom-left (desktop `left:72px; bottom:108px; max-width:760px`; mobile `left/right:20px; bottom:90px`):
- Mono label "2D animator & illustrator · mumbai"
- Heading "Hi, I'm Yurix"
- Intro paragraph (final copy from Yurix)
- Scroll hint below it: a mouse outline with a nudging dot and the text "scroll · it gets dreamy" (mobile: "scroll")

A dark gradient scrim sits behind the text for contrast: desktop 90°, `rgba(19,19,22,.62)→0` at 85%; mobile 180°, 0.25→0.62.

**Scroll behaviour.** Drive everything from one progress value `p` (0→1) over the first viewport height:
- Background: `blur(p × 20px)` on desktop, **8px on mobile**, plus `scale(1.04 + p × 0.08)`.
- Intro: `opacity 1 − 2.2p`, `translateY(−140p px)` (mobile −100). Scrim `opacity 1 − 1.4p`. Scroll hint `opacity 1 − 6p`.
- Further down the page the background washes to **white**, so at the bottom of the page it's plain white rather than blurred.
- **Snap rule:** the hero never rests half-blurred.
  - After scrolling stops (140ms debounce), from the start state: `p < 0.2` snaps back to 0, otherwise it completes to the "done" position (blur full, intro hidden, nav in, next section risen).
  - From the done state, it returns to the hero only if `p < 0.8`, i.e. the user scrolled back more than 20%.
  - The animation uses ease-out-cubic, with duration `clamp(300ms, distance × 0.9, 800ms)`.
  - Any wheel or touch input cancels a running snap.

**Reduced motion** (`prefers-reduced-motion: reduce`): show a still frame instead of the video, blur 0, no translate (simple fades only), and the snap jumps instantly.

**MusicPlayer**: a floating pill at bottom-right (desktop: track name + play/mute, ~250×50; mobile: compact ~120×50). It is **visible only on the hero intro**. Once `p > 0.05` it hides (opacity 0, translateY 24px, 260ms) and comes back at the top. Plays tracks from the CMS playlist in order. It is also in the mobile full-screen menu.

**SelectedWork**: 6–8 artworks with `featured = true`, in `featuredOrder`.
- Desktop: a Pinterest-style masonry using CSS columns. Cards keep their own aspect ratio (`pin`, e.g. 4/5, 1/1, 2/3), radius 16, 22px gap, with title / type / year below.
- Animated pieces get a "loop" badge.
- On hover, the image "boils" (`pf-boil`, 0.33s steps(1)).
- An "all work →" pill sits in the header.
- Mobile: 2-column masonry, then a full-width "all work" button (52px).

**FreshWork**: the 3 newest live artworks (the newest has a "new" badge) plus the 3 newest Instagram posts.
- Desktop: a 6-column grid. Mobile: a horizontal scroll-snap strip of 156px cards.
- A "follow @yurix.draws ↗" pill.

**AboutSection**: a floating square "window" on the left, rotated −2deg with a gentle `pf-float` bob.
- The window has a 40px title bar showing a file-name label, and contains a muted, looping MP4.
- On the right: an "about me" label, 2 paragraphs and 2 buttons ("about" solid ink, "say hi" outline).
- Desktop grid `5fr / 6fr`, gap 72px. Mobile stacks.

**InfoCards** (keep exactly as designed): 3 cards with background `#f5f5f7`, radius 20, padding 26:
- Shop: "Prints & originals" / "Riso editions, giclée prints and the odd canvas."
- About: "How I work" / "iPad first, oils when the screen gets boring."
- Contact: "Commission me" / "Characters, covers, editorial. Quote in a day."

**Footer** (`SiteFooter.dc.html`, keep exactly as designed):
- Wordmark and the "say hi" label.
- "Mumbai, IN · hey@aditi.art".
- Page links (Home, Work, Gallery, Shop, About, Contact).
- Instagram ↗, Behance ↗ and YouTube ↗.
- Copyright line.

**States:**
- Loading: image tiles show a skeleton (`#e8e7f0`, `pf-pulse` 1.4s), with text bars below.
- Instagram failure: keep the artwork tiles and show the last cached posts, or a quiet error with a retry button.

**Custom cursor** (desktop): a 16px white dot with `mix-blend-mode: difference`. It grows over interactive elements and shows a short label (play / view / open / about / say hi / follow).

### Work (`WorkPage.dc.html`)
**WorkPage**: heading, intro, auto project count. Shows 6–12 projects in CMS order. The **first card spans 2 columns (21/9)**; the rest are 4/3. Each card shows cover, title, type, year, client and teaser, plus a "video" badge when the project has a YouTube ID.

**ProjectPage** sections, in order:
1. Title, type and year
2. Meta row (client / role / tools / year)
3. Cover image or loop
4. Story paragraphs
5. Process steps (image + label each, 4 in the design)
6. **YouTube**, only if set. Show a poster with a 104px white play button; load the iframe (`youtube-nocookie.com/embed/{id}?autoplay=1&rel=0`) only on click.
7. Final pieces (the first one is wide)
8. **View on Behance** block, only if set
9. "Next project" link (wraps to the first project after the last)

### Gallery (`GalleryPage.dc.html`)
- **GalleryFilters**: All plus the CMS categories (currently Traditional, Digital, Animation, Handmade), each with a count. Desktop chips wrap; mobile is one horizontal swipe row. New categories (Comics, Graffiti) are just more chips. A category with no live pieces is hidden.
- **GalleryGrid**: masonry with 4 columns on desktop and 2 on mobile. An empty filter shows the CMS microcopy "nothing here yet. soon."
- **ArtworkCard**: image, title and category.
  - Animation cards play their muted preview MP4 when ≥50% in view (IntersectionObserver) or on hover, and pause when out of view.
  - In reduced motion, show the poster only.
- **ArtworkLightbox**:
  - Shows multiple images with labels (front / side / detail / before / after), selectable via thumbnails, plus year, description and a materials list.
  - Instagram, Behance and YouTube buttons appear **only when their URL is set**.
  - Controls: Esc closes, ← → step between artworks, and the background scroll is locked.
  - Mobile: opens as a full-screen sheet.

---

## Admin (`Admin.dc.html`), desktop CMS
**Layout**:
- Grid `248px sidebar | 1fr`, page background `#f4f3ef`.
- Header 68px: title (Bricolage 800 24px); on editors, a back button and breadcrumb. On the right: a draft/live segmented control (editors only), "view site ↗" and a black "save" pill.
- Content padding `28px 32px 64px`.
- Panels are white, radius 20, padding 24, border `rgba(19,19,22,.08)`.
- Inputs: min-height 44px, radius 12, border `rgba(19,19,22,.14)`, Inter 15px. Field labels are DM Mono 11px uppercase `#86868f`.
- Toggles: 46×28 pill, purple `#5a4bc4` when on, `#d6d5d0` when off, 22px white knob.
- Reorder: a ⋮⋮ drag handle plus ↑ / ↓ 34px buttons (30% opacity at the ends). Build real drag-and-drop too.
- Save shows a toast: "saved · live on the site in a few seconds" (2s).

**Sidebar** (`AdminSidebar`): groups *overview* (Dashboard), *content* (Artworks, Projects, Categories, with counts), *pages* (Home, About page; Shop, Contact page, 404 game marked **"soon"** and disabled), *site* (Navigation, Music, Footer & social, Microcopy; Loader "soon"). The active item is ink-filled with white text.

**Screens**
1. **Dashboard**
   - Greeting.
   - Quick actions: + new artwork, + new project, edit home.
   - Selected Work slots: 8 thumbnails with dashed empty slots and a "N of 8 featured" count.
   - Instagram status: the 3 latest posts, last sync time, and "sync now".
   - Drafts and "Recently edited" lists.
2. **ArtworkList**
   - Category filter chips with counts, search, and "+ new artwork".
   - Table columns: thumb, title, category, year, images, links (IG · BE · YT), featured ★ with its position, status (live/draft).
   - ★ toggles featured (max 8; it refuses a 9th). Clicking a row opens the editor.
3. **ArtworkEditor**, with the form on the left and a 340px sticky column on the right:
   - **Images**: ordered views, each with a label. The first one is the "cover" (card image). Drag to reorder; add JPG/PNG/WebP.
   - **Preview loop (MP4)** appears **only when the category is Animation**. It's the muted card preview and should be under 6s.
   - **Details**:
     - Title and year.
     - Category, as single-select chips from Categories.
     - Description.
     - Materials, as tags with × and "+ add".
   - **Links**: Instagram / Behance / YouTube URLs. Empty ones show "paste a link" and are hidden on the site.
   - **URL & SEO** (`SlugSeoFields`): slug `yurix.art/gallery/{slug}` (auto from title, editable), SEO title (default "{title} — Yurix") and SEO description (falls back to the description).
   - **Right column**: a "Feature on Home" toggle with "position X of N" (or "all 8 slots used — unstar one first"), a live ArtworkCard preview, and "delete artwork".
4. **ProjectList**
   - Hint: "N of 12 projects on Work" and "Work shows 6–12…". The first row is tagged "wide".
   - Rows: drag handle, number, cover, title / type · year, client, video / behance badges, ↑↓ and edit.
   - Block publishing with fewer than 6 live projects, and block adding more than 12.
5. **ProjectEditor**: a 180px sticky outline on the left (on/off notes for the optional sections) and sections on the right:
   - Basics: title, type, year, client, role, tools, and the teaser (one line for the Work card).
   - Cover (image or MP4, 16:9 or wider).
   - Story paragraphs (reorder, add).
   - Process steps (image + label; add).
   - YouTube video: toggle, link, and preview image. When off, the section is hidden on the site.
   - Final pieces (the first one runs wide).
   - View on Behance: toggle, link, and block text.
   - URL & SEO: `yurix.art/work/{slug}`, SEO title and description (falls back to the teaser), and share image (defaults to the cover).
6. **CategoryManager**: an ordered list showing piece counts and state ("showing in filters" or "hidden until it has a piece"), plus "+ add category". Comics and Graffiti are pre-added and hidden.
7. **HomeEditor**: an accordion of the Home sections. The layout is fixed; only the content changes.
   - **HeroAnimation**: loop MP4 (1920×1080) and the reduced-motion still.
   - **HeroIntro**: label, heading and intro. The scroll hint links to Microcopy.
   - **SelectedWork**: label, button text, and a link to Artworks for the pieces.
   - **FreshWork**: label and follow-button text. Its content fills itself.
   - **AboutSection**: window MP4, window file label, "about me" label, 2 paragraphs, and 2 buttons (label + link).
   - **InfoCards**: 3 cards, each with label / title / text / link.
8. **NavEditor**: 5 items with label and path, reorder, and a visibility toggle (hidden items stay in the footer). Also the mobile-menu wordmark.
9. **MusicPlaylist**: a player on/off toggle (shows on the Home hero and the mobile menu). The playlist has a play-preview button, name, file, duration, a "plays first" tag on track 1, and reorder. "+ add track · MP3 or M4A".
10. **FooterEditor**:
    - Fields: wordmark, say hi label, location, email, copyright, and page-link chips.
    - **Instagram connection**: handle, connected / syncing / sync failed status, last sync time, and "sync now" or "retry". If a sync fails, the site keeps the last posts.
    - Social URLs: Instagram, Behance, YouTube.
11. **MicrocopyEditor**: the scroll hint (desktop and mobile), the empty-category line, and the cursor labels (play / view / open), each noting where it is used.
12. **AboutEditor** (`screen="about"`): same accordion pattern as HomeEditor.
    - Top bar: **layout** segmented control (Sketchbook | Editorial — content is shared, only presentation changes) and an **open for freelance** toggle (drives the badge in AboutHero).
    - **List fields**: rows of two values (e.g. name · line) with ↑ ↓ reorder, × remove, and a "+ add …" row at the bottom.
    - Sections, top to bottom:
      - **AboutHero**: small label, heading, intro, city, portrait loop MP4.
      - **AboutStory**: pull quote + paragraphs (add/remove/reorder).
      - **MediumsShowcase**: list of mediums (name · line). Items flagged *soon* show a "soon" tag and have no link on the site. Cover images come from the newest artwork in each category (link → Categories).
      - **ProcessSteps**: list (title · line); each step has an image on the site.
      - **ToolsSkills**: two lists — tools (name · what for) and skills (name only).
      - **JourneyTimeline**: list (year · title).
      - **ClientsList**: list (client · kind of work).
      - **FunFacts**: list (question · answer).
      - **SocialLinks**: list (network · handle); shares data with Footer & social.
      - **AboutCTA**: heading + 2 buttons (label + link).
      - **GuideCharacter** (shown only when layout = Sketchbook): character PNG and one guide line per section (10 lines).

---

## Data model (suggested)
```ts
Category   { id, name, order }                       // hidden on site when no live artworks
Artwork    { id, slug, title, year, categoryId, description, materials: string[],
             images: { url, label, order }[],          // images[0] = card cover
             previewMp4?: url,                         // Animation only
             links: { instagram?, behance?, youtube? },
             featured: boolean, featuredOrder?: number, // max 8 featured
             status: 'draft'|'live', seoTitle?, seoDescription?, createdAt, updatedAt }
Project    { id, slug, title, kind, year, client, role, tools, teaser, cover: url,
             story: string[], process: { url, label }[], finals: url[],
             youtubeId?, youtubePoster?, behanceUrl?, behanceText?,
             order, status, seoTitle?, seoDescription?, shareImage? }
HomeContent{ heroVideo, heroStill, heroLabel, heroHeading, heroIntro,
             selectedLabel, selectedButton, freshLabel, followButton,
             aboutVideo, aboutWindowLabel, aboutLabel, aboutParagraphs[2], aboutButtons[2]{label,href},
             infoCards[3]{label,title,text,href} }
AboutContent{ layout: "sketchbook" | "editorial", openForFreelance: boolean,
             heroLabel, heroHeading, heroIntro, city, portraitVideo,
             storyQuote, storyParagraphs: string[],
             mediums: { name, line, soon }[], process: { title, line, image }[],
             tools: { name, for }[], skills: string[],
             timeline: { year, title, line }[], clients: { name, kind }[],
             facts: { q, a }[], ctaHeading, ctaButtons[2]{label,href},
             guideImage, guideLines: string[] }   // social links reuse FooterContent
NavItem    { label, href, order, visible }
Track      { name, fileUrl, duration, order }  + musicEnabled: boolean
Footer     { wordmark, sayHiLabel, location, email, copyright, pageLinks[] }
Social     { instagramHandle, instagramToken, lastSyncAt, syncStatus, behanceUrl, youtubeUrl }
Microcopy  { scrollHint, scrollHintMobile, emptyCategory, cursorPlay, cursorView, cursorOpen }
```
**Derived on the site:**
- Fresh = 3 newest live artworks plus 3 cached Instagram posts.
- Category counts.
- Project "video" badge = has `youtubeId`.
- Next project = order + 1, wrapping to the first.

## Assets
- Placeholder images: Wikimedia Commons public-domain paintings (Klimt, Vermeer, Van Gogh, Munch, Kandinsky, Hokusai, Botticelli, Monet). **Replace all of them.**
- Video and audio: none bundled. They come from the CMS: hero loop, about-window loop, animation previews, music tracks.
- Fonts: Google Fonts (Bricolage Grotesque, DM Mono, Inter).
- Icons are text glyphs (↗ → ← ↑ ↓ ▶ ❚❚ ★ ⋮⋮ ×). Swap them for an icon set if you prefer, at the same sizes.

## Files (`designs/`)
- `Overview Canvas.dc.html`: every page and admin screen side by side. Start here.
- `HomePage.dc.html`: HeroAnimation, HeroIntro, MainNav, SelectedWork, FreshWork, AboutSection, InfoCards, MusicPlayer mount, mobile menu (props: `mobile`, `reduced`, loading states).
- `WorkPage.dc.html`: WorkPage and ProjectPage.
- `GalleryPage.dc.html`: GalleryFilters, GalleryGrid, ArtworkCard, ArtworkLightbox.
- `About Sketchbook.dc.html`, `About Editorial.dc.html`: the two About page layouts (prop `mobile`). Same content; the CMS picks which one is live. Sections: AboutHero, AboutStory, MediumsShowcase, ProcessSteps, ToolsSkills, JourneyTimeline, ClientsList, FunFacts, SocialLinks, AboutCTA (+ GuideCharacter in Sketchbook).
- `SiteFooter.dc.html`, `MusicPlayer.dc.html`: shared pieces.
- `image-slot.js`: drop-in image placeholder used by the About pages (prototype only).
- `Admin.dc.html`: all admin screens (prop `screen` = dashboard | artworks | artwork | projects | project | categories | home | nav | music | footer | microcopy | about).
- `support.js`: the small runtime the prototypes need in order to open in a browser. Not for production.

Desktop admin only. The admin is not designed for mobile; a responsive collapse of the sidebar is fine.
