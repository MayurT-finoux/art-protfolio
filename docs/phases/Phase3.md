# Phase 3 — Cloudflare R2 (media uploads)

Status: **plan, waiting for approval** (no code changes yet)

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
| 1 | Do you own `yurix.art`, and is it (or can it be) on Cloudflare DNS? A custom domain like `media.yurix.art` is needed for production. If not yet, we can start with the bucket's `r2.dev` URL (fine for testing, rate-limited, not for launch). | _open_ |
| 2 | OK to install `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (recommended), or prefer `aws4fetch`? | _open_ |
| 3 | OK that uploads only work locally until the login is built? | _open_ |
| 4 | File types and size limits above OK? | _open_ |

## Done when

- [ ] Bucket, CORS and token set up; keys only in `.env.local`
- [ ] `npm run r2:check` passes
- [ ] Every upload button in the admin uploads to R2 and shows the file
- [ ] Upload endpoint refuses requests outside local dev (until login)
- [ ] `npm run lint` + `npm run build` pass; no secrets in git
