# Phase 3 — Cloudflare R2 (media uploads)

Status: **working** (2026-10-11) — bucket, public r2.dev URL, CORS and token set up; `npm run r2:check` passes. Browser upload from the admin still failing — see Progress.

Requested 2026-10-08: set up Cloudflare. R2 stores everything uploaded in the admin:
artwork images, preview loops, project covers / process / finals, hero and about videos, music tracks.

---

## How uploads will work

```
Admin (browser) ──1. "I want to upload clay-ghost.jpg (2 MB, image/jpeg)"──▶ Next.js /api/uploads
                ◀─2. signed upload URL (valid 5 min) + final public URL ─────
                ──3. PUT the file straight to R2 ──────────────────────────▶ Cloudflare R2 bucket
Site visitors   ◀──────────── files served from the public bucket URL ───── (e.g. media.yurix.art)
```

- Files go **directly from the browser to R2**, not through our server (no size limits from Vercel/Netlify functions).
- The server only signs the request, after checking file type and size.
- Keys: `artworks/{slug}/{random-id}.jpg`, `projects/{slug}/…`, `home/…`, `about/…`, `music/…`.

## Steps

### Step 1 — Cloudflare setup (you, in the Cloudflare dashboard; I'll guide you)
1. Create an R2 bucket, e.g. `yurix-media`, location hint **Asia-Pacific**.
2. Public access: connect a custom domain (e.g. `media.yurix.art`) — **question 1**.
3. CORS rule on the bucket so the admin can upload from the browser (I'll give you the exact JSON).
4. Create an R2 API token: **Object Read & Write**, limited to this bucket.
5. Paste the values into `.env.local` (never committed):

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=yurix-media
R2_PUBLIC_URL=https://media.yurix.art
```
(`.env.example` gets the same keys with empty values.)

### Step 2 — Server code
- `src/lib/r2.ts` — R2 client (S3-compatible API).
- `src/app/api/uploads/route.ts` — checks type + size, returns a signed upload URL.
- `npm run r2:check` — test script: uploads a tiny file, reads it back from the public URL, deletes it.

### Step 3 — Wire the admin upload buttons
- Artwork images (+ add image), preview loop (replace), project cover / process / finals, Home & About files (replace), music (+ add track).
- Upload progress on the tile, then the uploaded image shows in place.
- Until the database is connected, uploaded files appear in the admin but **aren't saved to the page** (reload forgets them; the file stays in R2).

### Step 4 — Show R2 images on the site
- Allow the R2 domain in `next.config.ts` so `next/image` can optimise images later.

## Allowed files (proposal)

| Kind | Types | Max size |
|---|---|---|
| Images | JPG, PNG, WebP | 20 MB |
| Preview loops / videos | MP4, WebM, MOV (HEVC) | 200 MB |
| Music | MP3, M4A | 30 MB |

## Install — needs your OK (not in the stack list)

- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` — Cloudflare's recommended way to sign R2 uploads.
  (Smaller alternative: `aws4fetch`, one tiny package, also listed in Cloudflare's docs.) — **question 2**

## Security until the login exists

Without a login, anyone who finds `/api/uploads` could upload files to your bucket.
Proposal: **uploads only work on the local dev server** (`npm run dev`) until Better Auth is added;
on a deployed site the endpoint refuses every request. — **question 3**

## Questions

| # | Question | Answer |
|---|---|---|
| 1 | Do you own `yurix.art`, and is it (or can it be) on Cloudflare DNS? | **No domain yet** → use the bucket's `r2.dev` URL for now; switch to a custom domain before launch. |
| 2 | OK to install `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`? | **Yes** (installed) |
| 3 | OK that uploads only work locally until the login is built? | **Yes** |
| 4 | File types and size limits above OK? | **Yes** |

## Done when

- [ ] Bucket, CORS and token set up; keys only in `.env.local`
- [ ] `npm run r2:check` passes
- [ ] Every upload button in the admin uploads to R2 and shows the file
- [ ] Upload endpoint refuses requests outside local dev (until login)
- [ ] `npm run lint` + `npm run build` pass; no secrets in git

## Progress (2026-10-08)

- [x] `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` installed
- [x] `src/lib/uploads.ts` (rules), `src/lib/r2.ts` (client + signing), `src/app/api/uploads/route.ts` (dev-only), `src/lib/uploadFile.ts` (browser upload with progress)
- [x] `npm run r2:check`; R2 keys in `.env.example`; empty R2 keys added to `.env.local`
- [x] `next.config.ts`: `*.r2.dev` allowed for `next/image`
- [x] Admin upload buttons wired via `FilePicker`: artwork images + preview loop, project cover / process / finals, Home & About files, music tracks (name + duration read from the file, preview plays)
- [x] Cloudflare dashboard: bucket `yurix-media` (APAC, Standard), public URL `https://pub-eca174b5059b4f439ba018f94a1a7d2c.r2.dev`, CORS, API token → `.env.local`
- [x] `npm run r2:check` passes; signed PUT + CORS preflight verified for localhost and the Codespace URL
- [ ] Real upload tested in the admin — **open (2026-10-11)**: browser PUT fails with a CORS-style error from the Codespace origin, although the same preflight + PUT succeed via curl with that Origin. Next step: read the exact reason in the browser console (Network/Console) or test in an incognito window (extensions).

Note: the signed URL fixes the file type but not the size; size is checked before signing. Fine while uploads are dev-only; tighten when the login lands.

### CORS rule (bucket → Settings → CORS policy)

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://stunning-journey-q7q65rw4j5jwhv7p-3000.app.github.dev"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["content-type"],
    "MaxAgeSeconds": 3600
  }
]
```
Add the production site URL here when it exists.
