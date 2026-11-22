# Yurix site — what was built from which design file

A brief guide to the current website for redesign work. For each page: the design file it was built from,
its sections in order, how each one works, where its content comes from, and what differs from the design.
Updated 2026-11-22.

## 1. Design files

All files come from the handoff zip, folder `design_handoff_yurix_site/designs/`.

**Used (built from these):**

| File | What it gave us |
|---|---|
| `Overview Canvas.dc.html` | The "v6" overview board: which pages and versions are final |
| `HomePage.dc.html` | Home page + MainNav + MobileMenu |
| `WorkPage.dc.html` | Work list + project page |
| `GalleryPage.dc.html` | Gallery (filters, masonry grid, lightbox) |
| `About Sketchbook.dc.html` | About page, layout 1 (default) |
| `About Editorial.dc.html` | About page, layout 2 (switchable in the admin) |
| `ContactPage.dc.html` | Contact page |
| `SiteFooter.dc.html` | Footer + big Wordmark |
| `MusicPlayer.dc.html` | Music player pill |
| `Admin.dc.html` | All admin screens (CMS) |
| `AdminLogin.dc.html` | Admin sign-in (built, then switched off at Yurix's request) |
| `README.md` (handoff root) | Colours, fonts, spacing, behaviour notes, data model |

**Not used:**

| File | Why |
|---|---|
| `Artist Portfolio v7.dc.html`, `HomeCollage.dc.html` | Other Home versions ("Cut & Paste" / collage); v6 was chosen |
| `ShopStudioTable.dc.html` | Shop not built yet (`/shop` shows an "in progress" page) |
| `404 Sketchbook.dc.html`, `RunnerGame Sketchbook.dc.html` | 404 page + game not built yet (plain 404 page for now) |
| Admin screens for Shop, Checkout, 404 (inside `Admin.dc.html`) | Not built yet |
| Older explorations (v3, v4, v5, Directions boards, 404 Frame, Nocturne) | Dropped; they were in the first zip only |

## 2. Site-wide pieces (every public page)

| Section | Design file | How it works |
|---|---|---|
| **MainNav** | HomePage | Fixed top bar, links on the right (work · gallery · shop · about · contact). On Home it is hidden over the hero and the links drop in one by one as you scroll; on other pages it is always visible. The current page is purple with a dot under it. **Change:** a "home" link is added first on every page except Home. Links, order and show/hide are edited in admin → Navigation. |
| **MobileMenu** (≤ 767px) | HomePage | Menu button opens a full-screen white menu: big links, Instagram + email pills, music player, wordmark. Escape closes it; the page can't scroll behind it. |
| **MusicPlayer** | MusicPlayer | Pill with play/pause, mute, animated bars and the track name. On Home it floats bottom-right over the hero and hides once you scroll; it's also in the mobile menu. **For now the buttons only change the look — no sound yet.** Shows the first track from admin → Music; hidden everywhere if switched off there. |
| **Footer** | SiteFooter | "say hi" + email, location, page links, social links (empty ones hidden), copyright, and a huge **Wordmark** ("yurix") at the bottom. All text and links come from admin → Footer & social. Hidden shortcut: 3 quick clicks on the wordmark open the admin. **Change:** wordmark 254px on desktop (design 260px). |
| Cursor | HomePage | **Change:** the design's custom cursor (dot + "view"/"play" labels) was removed; normal system cursor. |

Global rules: mobile layout at ≤ 767px (768–1440 uses desktop values); every animation has a reduced-motion version (no movement, simple fades, still images instead of videos).

## 3. Home (`/`) — `HomePage.dc.html`

| # | Section | How it works | Content from |
|---|---|---|---|
| 1 | **HeroAnimation** | Full-screen looping video behind everything. As you scroll the first 600px (480px on mobile), it blurs (up to 20px desktop / 8px mobile) and fades to white. Reduced motion: a still image. | Video + still: admin → Home |
| 2 | **HeroIntro** | Small label, big "Hi, I'm Yurix" heading, one intro line, "scroll · it gets dreamy" hint with an animated mouse icon. Fades and lifts away while scrolling. **Change:** heading 122px / intro 19px on desktop (design 172px / 22px). | Text: admin → Home; hint: admin → Microcopy |
| — | **Hero scroll + snap** | One scroll progress value drives blur, intro and menu together. Snap rule: let go under 20% → back to the top; over 20% → completes and lands with Selected Work under the menu. Coming back up, it returns to the top only below 80%. It never stays half-blurred. | — |
| 3 | **SelectedWork** | "selected work" heading, piece count, "all work →" button, Pinterest-style masonry of up to 8 featured artworks (each card keeps its image's shape; animated pieces get a "loop" badge). Items drop in as the hero completes. | Artworks starred ★ in admin → Artworks, in star order |
| 4 | **FreshWork** | "fresh" strip: the 3 newest live artworks mixed with the 3 newest Instagram posts ("new" tag on the newest, "instagram ↗" tag on posts), plus a "follow @yurriiix ↗" button. | Newest artworks automatically; Instagram posts are **samples** until Instagram is connected |
| 5 | **AboutSection** | Tilted floating "window" (fake app window titled `me_at_work.mp4`) with a muted loop, next to a short bio and two buttons ("more about me →", "say hi"). | admin → Home |
| 6 | **InfoCards** | Three cards: Shop · About · Contact, each with a label, title, one line and a link. | admin → Home |

## 4. Work (`/work` and `/work/{project}`) — `WorkPage.dc.html`

| Section | How it works | Content from |
|---|---|---|
| **WorkList** | Label with count, huge "work" heading, intro. Two-column grid of project cards (cover, type, "video" badge, number + title, teaser); the **first card spans both columns** (21:9). | admin → Projects (order = drag order; 6–12 projects) |
| **ProjectPage** | Back link, title, meta (client, role, tools, year), "view on behance" pill, big cover, "the story" paragraphs, "process" steps (thumbnail → final, numbered images), video, "final pieces" (first one wide), Behance block, "next project" link at the bottom. **Change:** the cover can also be a muted MP4 loop. | admin → Projects → project editor |
| **ProjectVideo** | YouTube player with its own poster + play button; the real YouTube player (privacy mode) only loads after a click. Hidden if no video is set. | Project's YouTube link |

## 5. Gallery (`/gallery`) — `GalleryPage.dc.html`

| Section | How it works | Content from |
|---|---|---|
| **GalleryFilters** | "All" + one chip per category with counts. Categories with no live pieces are hidden automatically. Desktop wraps; mobile is one swipeable row. | Categories + order: admin → Categories |
| **GalleryGrid** | Masonry, 4 columns desktop / 2 mobile. Cards rise in again when you change filter. | Live artworks, newest first |
| **ArtworkCard** | Image, title, category. Animation pieces play a muted preview while on screen or hovered. | Artwork |
| **ArtworkLightbox** | Opens on click. Desktop: centred window over a blurred background; mobile: full-screen sheet. Several images per artwork with labels (e.g. front / side), title, year, category, description, materials, Instagram/Behance/YouTube buttons (only if set). ← → move through the current filter, Esc closes. Image shrinks to fit the screen. No separate URL per artwork yet. | admin → Artworks → artwork editor |

## 6. About (`/about`) — `About Sketchbook.dc.html` + `About Editorial.dc.html`

Same content, two looks; the admin picks one (About page → layout). **Sketchbook**: ruled paper, taped polaroids, stickers, doodles that draw themselves. **Editorial**: huge type, numbered chapters, index-style lists, dark closing panel. Sections fade/slide in as you scroll.

| # | Section | How it works |
|---|---|---|
| 1 | **AboutHero** | Label, heading with a hand-drawn highlight on the last word(s), intro, city / "makes" facts, "open for freelance" badge (switch in admin), portrait loop. |
| 2 | **AboutStory** | Pull quote + 4 paragraphs (bold lead + text), polaroid sketches (Sketchbook) or margin marks (Editorial). |
| 3 | **MediumsShowcase** | One card per medium (Traditional, Digital, Animation, Handmade…). Cover + count come from the newest live artwork in the matching Gallery category; "soon" mediums (Graffiti, Comics) show a "coming soon" stamp and no link. Mobile: swipe row. |
| 4 | **ProcessSteps** | sketch → line art → colour → animation, one image + line each. |
| 5 | **ToolsSkills** | Tools with what they're for + skills as stickers (Sketchbook) or a list (Editorial). |
| 6 | **JourneyTimeline** | Year markers on a line: horizontal desktop, vertical mobile. |
| 7 | **ClientsList** | Client + kind of work, and a "your name here?" link to Contact. |
| 8 | **FunFacts** | Desk photo + question/answer notes. |
| 9 | **SocialLinks** | Instagram, Behance, YouTube, Patreon with handle + one line; links reuse admin → Footer & social. |
| 10 | **AboutCTA** | "let's work together" heading, line, button to Contact. |
| — | **GuideCharacter** (Sketchbook only) | Small doodle character in the corner whose speech bubble changes line for each section you scroll to. |

All text, lists, layout and the freelance badge: admin → About page. Images are **samples** for now.

## 7. Contact (`/contact`) — `ContactPage.dc.html`

| Section | How it works |
|---|---|
| **ContactIntro** + **AvailabilityBadge** | Huge "say hi" heading and an "open for commissions" / "booked until…" badge. |
| **ContactForm** | A postcard on a cutting mat: topic chips (commission, animation, custom object, shop order, collab, just hi, other), message (placeholder changes with the topic), stamp, today's postmark date, name + email. Budget/timing chips for commissions. Inline validation, error banner that keeps your text, success summary. Messages are saved for the admin and emailed to Yurix; spam trap built in. |
| **DirectLines** | "or skip the form": email (copy button), Instagram DM, studio with a live Mumbai clock. |
| **GoodToKnow** | Short FAQ-style notes. |

## 8. Shop (`/shop`) and 404

- **Shop**: a temporary "in progress" page (label, big "shop" heading, line, "say hi →" button). **Not in the design** — reuses the Work page header style. The real Shop design is `ShopStudioTable.dc.html` (not built).
- **404**: the plain default "page not found". The designed 404 + runner game is not built.

## 9. Admin (`/admin`) — `Admin.dc.html`

Sidebar (Dashboard · Content · Pages · Site) + one screen per item; every screen has a header with "view site ↗" and "save", and a "saved" toast.

| Screen | What it does |
|---|---|
| **Dashboard** | Date + greeting, quick buttons (new artwork, new project, edit home), 8 Selected Work slots, Instagram status ("not connected" for now), drafts, recently edited. |
| **Artworks** (list + editor) | List with ★ to feature on Home (max 8), draft/live, delete. Editor: images (drag to reorder, first = cover, crop focus), title, category, year, description, materials, links, animation preview video, URL & SEO. |
| **Projects** (list + editor) | Drag to set Work order. Editor: basics, cover (image or MP4), story paragraphs, process steps, YouTube, final pieces, Behance, URL & SEO, draft/live. |
| **Categories** | Order + add Gallery categories; shows piece counts and whether each is visible. |
| **Home** | Accordion per Home section (texts, videos, stills, buttons, info cards). |
| **About page** | Layout switch, freelance switch, accordion per About section (texts + editable lists). |
| **Navigation** | Rename, reorder, show/hide menu links; mobile menu wordmark. |
| **Music** | On/off switch, upload tracks (MP3/M4A), reorder, preview. |
| **Footer & social** | Footer texts + Instagram/Behance/YouTube links (Instagram panel "not connected" for now). |
| **Microcopy** | Small lines: scroll hints, empty-category text. **Change:** the "cursor labels" group was removed. |
| Shop · Contact page · 404 game · Loader | Shown as "soon" in the sidebar; not built. |

Admin sign-in (`AdminLogin.dc.html`) is built but switched off for now.

## 10. Summary of changes vs. the design

1. HeroIntro heading 122px / intro 19px on desktop (design 172 / 22).
2. Footer wordmark 254px on desktop (design 260).
3. Normal cursor instead of the custom cursor; Microcopy cursor labels removed.
4. "home" link in the menu on every page except Home.
5. Project covers can be an MP4 loop.
6. About story paragraphs edited as one list in the admin (the page has 4 paragraphs).
7. `/shop` "in progress" page (not designed).
8. Instagram handle `@yurriiix`, email `hey@yurix.art`.
9. Temporary sample images/artworks/projects everywhere until the real work is uploaded.
