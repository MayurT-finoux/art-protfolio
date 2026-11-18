# Phase 2 — Admin section (CMS)

Status: **in progress** — 2026-10-08: Yurix approved building the **admin design first** (UI with placeholder data).
Database (steps 2, 3 wiring) and Cloudflare R2 come later. Questions 1–3 are deferred with them.

Requested 2026-10-08: start the admin section, plus a hidden shortcut — **click the footer "yurix" wordmark 3 times to go to `/admin`**.

The admin saves to the database and needs a login, so this phase pulls forward the original
Phase 4 (database schema) and Phase 5 (admin + Better Auth). Like the public pages, it's built
**one step at a time**, with a check-in after each step.

Source: `design/design_handoff_yurix_site/designs/Admin.dc.html` + handoff README ("Admin" and "Data model").

---

## Steps

### Step 1 — Hidden shortcut + admin shell
- **Footer Wordmark**: 3 clicks within ~600 ms → `/admin`. No visual change, no cursor label, not in the tab order.
  Only a shortcut: `/admin` itself is protected by the login (step 3).
- **AdminShell** (`src/app/admin/layout.tsx`): grid `248px | 1fr`, background `#f4f3ef`, no MusicPlayer / custom cursor.
- **AdminSidebar**: groups *overview* (Dashboard), *content* (Artworks, Projects, Categories + counts), *pages* (Home, About page; Shop, Contact page, 404 game "soon"), *site* (Navigation, Music, Footer & social, Microcopy; Loader "soon"). Active item ink-filled.
- **Header** (68px): title, back + breadcrumb on editors, draft/live control, "view site ↗", black "save" pill. Save toast "saved · live on the site in a few seconds".
- Shared admin controls: panel, input, field label, toggle (46×28), chips, reorder buttons (⋮⋮ + ↑ ↓).
- Placeholder data at first, so the screens can be reviewed before the database is wired.

### Step 2 — Database schema (Drizzle)
Tables from the handoff data model:
`categories`, `artworks`, `artwork_images`, `projects`, `project_process_steps`, `project_finals`,
`home_content`, `about_content`, `nav_items`, `tracks`, `site_settings` (footer, social, music on/off, microcopy),
`instagram` (handle, token, last sync, status), plus Better Auth's tables (`user`, `session`, `account`, `verification`).
- `npm run db:generate` → review the SQL → `npm run db:migrate` on Neon.
- Seed script with today's placeholder content (Home, categories, sample artworks/projects), so nothing on the site goes blank.
- Home page switches from `src/lib/placeholder/home.ts` to database queries.

### Step 3 — Login (Better Auth)
- `/admin/login`, email + password, **one admin account, sign-ups disabled**.
- The admin account is created by a script (`npm run admin:create`), password typed in the terminal — never stored in the repo.
- Every `/admin` route and admin server action checks the session.
- New secret in `.env.local`: `BETTER_AUTH_SECRET` (+ `BETTER_AUTH_URL`); added to `.env.example` with empty values.
- The design has no login screen → **question 3 below**.

### Step 4 — Screens, one at a time (each: build → you review → next)
1. **Dashboard** — greeting, quick actions, Selected Work slots (N of 8), Instagram status (placeholder until Phase 7), drafts, recently edited.
2. **Artworks** — ArtworkList (filters, search, table, ★ featured max 8) + ArtworkEditor (images + labels, preview MP4 for Animation, details, materials, links, URL & SEO, feature toggle, live card preview, delete).
3. **Projects** — ProjectList (6–12 rule, wide first, reorder) + ProjectEditor (basics, cover, story, process, YouTube, finals, Behance, URL & SEO).
4. **Categories** — CategoryManager (order, counts, shown/hidden state, add).
5. **Home** — HomeEditor accordion (hero, intro, Selected Work, Fresh, About section, Info cards).
6. **Navigation** — NavEditor (labels, paths, order, visibility, mobile-menu wordmark).
7. **Music** — MusicPlaylist (on/off, tracks, order). Playback on the site stays for later.
8. **Footer & social** — FooterEditor (fields, page links, social URLs, Instagram status).
9. **Microcopy** — MicrocopyEditor.
10. **About page** — AboutEditor (layout, freelance toggle, list fields). The public About page itself is built later.

Forms: React Hook Form + Zod. Reordering: dnd-kit drag-and-drop **and** the ↑ ↓ buttons, as designed.
Saving: Next.js server actions → Drizzle → revalidate the public pages.

## Install (all in the stack, one step at a time)

| Step | Packages |
|---|---|
| 2 | none (Drizzle already installed) |
| 3 | `better-auth` |
| 4 | `react-hook-form`, `zod`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| — | **ask**: `@hookform/resolvers` (connects React Hook Form to Zod; not named in the stack) |

Tiptap: the admin design only has plain text fields (descriptions, story paragraphs), so it isn't needed yet.

## Questions

| # | Question | Answer |
|---|---|---|
| 1 | Image/video uploads need Cloudflare R2 (Phase 6). Until then: **(a)** set up R2 now (needs your Cloudflare account + keys), or **(b)** temporarily paste an image URL in upload fields and switch to real uploads in Phase 6? | _open_ |
| 2 | Admin login email: `hey@yurix.art`? | _open_ |
| 3 | There's no login screen in the design. OK to build a minimal one in the admin style (white panel on `#f4f3ef`, same inputs and black pill button)? | _open_ |
| 4 | OK to add `@hookform/resolvers`? | _open_ |
| 5 | The admin is desktop-only in the design. Below ~1024px: collapse the sidebar into a top bar (README allows it), or just show "open on a computer"? | _open_ |

## Not included

- Instagram API sync (Phase 7) — the Instagram panels show placeholder status.
- Real uploads if question 1 = (b).
- Public Work / Gallery / About pages (built after admin, one at a time).

## Done when

- [ ] 3 clicks on the footer wordmark open `/admin`
- [ ] `/admin` requires login; only the one admin account can sign in
- [ ] Every admin screen matches `Admin.dc.html`
- [ ] Changes saved in the admin show on the Home page
- [ ] `npm run lint` + `npm run build` pass; no secrets in git

---

## Progress — admin design (2026-10-08)

Built with placeholder data (`src/lib/placeholder/admin.ts`), no database / login / uploads yet.

- [x] Footer wordmark: 3 clicks within 600 ms → `/admin`
- [x] AdminShell, AdminSidebar, header (draft/live, view site, save + toast)
- [x] Dashboard, ArtworkList, ArtworkEditor (+ new), ProjectList, ProjectEditor (+ new), CategoryManager,
      HomeEditor, AboutEditor, NavEditor, MusicPlaylist, FooterEditor, MicrocopyEditor, SlugSeoFields
- [x] Drag-and-drop (dnd-kit) + ↑ ↓ buttons: projects, categories, nav, tracks, artwork images, story, process, final pieces
- [x] Fields are real inputs; state is kept client-side in `AdminProvider` while you move between screens (resets on reload)

Notes:
- URLs: `/admin`, `/admin/artworks`, `/admin/artworks/{slug}`, `/admin/artworks/new`, `/admin/projects`, `/admin/projects/{slug}`,
  `/admin/projects/new`, `/admin/categories`, `/admin/home`, `/admin/about`, `/admin/nav`, `/admin/music`, `/admin/footer`, `/admin/microcopy`.
- "+ new artwork / project" open an empty editor (the design's prototype opened an existing draft).
- HomeEditor shows the live Home content; other screens use the design's placeholder content.
- Upload buttons (add image, replace, add track) are visual only until Cloudflare R2.
- Admin is desktop-only (question 5 still open).
- Not done here: React Hook Form + Zod (comes with saving to the database), login.
