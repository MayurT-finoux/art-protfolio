# Phase 8 — Admin sign-in + Contact page

Status: **built** (2026-10-19) — waiting for Yurix to create the admin account and test.

Requested 2026-10-19 with a new design handoff (zip): "refer it for admin auth design, contact page".
The new handoff replaced `design/design_handoff_yurix_site/` (Admin.dc.html + README updated; new: AdminLogin,
ContactPage, ShopStudioTable, 404 Sketchbook + RunnerGame, Artist Portfolio v7, HomeCollage). Pages already
built were unchanged in the handoff.

## Admin sign-in (`AdminLogin.dc.html`)
- **Better Auth**, email + password, one owner account, **sign-ups disabled** (`src/lib/auth.ts`).
- Screens: sign in (show/hide password, inline errors), "forgot?" → "check your inbox", and the page the emailed
  link opens (`/admin/reset-password`, *not in the design* — same card + controls). Link valid 30 minutes;
  other sessions are signed out after a reset.
- **Lockout**: 5 sign-in attempts per 15 minutes (per visitor IP, stored in the database) → "Too many tries…".
- **Gate**: `src/proxy.ts` shows the sign-in screen on any `/admin…` address without a session (rewrite, not redirect —
  works behind the Codespaces proxy). After sign-in the requested page loads.
- **Every admin action and `/api/uploads` check the session** (`requireAdmin()` / `getAdminSession()`).
- **Sign out** link in the sidebar user block (*not in the design*).
- Create / reset the account: `npm run admin:create` (asks for email + password in the terminal).
- Tested: wrong password 401 · sign-in 200 · admin pages need a session · uploads 401 without one · sign-up refused · lockout after 5 tries · reset email generated. Test account removed afterwards.

## Contact (`ContactPage.dc.html`) — `/contact`
- ContactIntro + AvailabilityBadge, the postcard ContactForm (topics, topic-dependent fields, postmark date + live
  Mumbai clock computed in the browser, inline validation, "sent!" stamp), DirectLines (copy email, Instagram),
  GoodToKnow. Copy in `src/lib/placeholder/contact.ts`.
- Messages saved to `contact_messages`; email notification to `NOTIFY_EMAIL` via Resend when `RESEND_API_KEY` is set
  (an email failure never fails the message). Spam: hidden honeypot field + validation.
- Tested: valid saved · honeypot not saved · bad email / blank message / bad topic rejected. Test row removed.

## Database
Migration `drizzle/0001_*`: `user`, `session`, `account`, `verification`, `rate_limit`, `contact_messages` (only new tables).

## Environment (add to Vercel too)
| Key | Needed |
|---|---|
| `BETTER_AUTH_SECRET` | **yes** (sign-in fails without it) |
| `RESEND_API_KEY`, `NOTIFY_EMAIL`, `EMAIL_FROM` | for real emails (reset links, contact notifications) |
| `BETTER_AUTH_URL` | optional (pins the address used in emailed links) |

Without `RESEND_API_KEY`, emails are printed to the server log. Resend's default sender (`onboarding@resend.dev`)
only delivers to your own Resend account email until a domain is verified.

## Open points / questions
- Admin sidebar still has the earlier groups; the new design adds *shop* (Products, Shop categories, Shop page) and a
  404 page screen — added when those screens are built.
- The contact "network error" wording, the stamp picture (plain swatch for now) and the "small print" link (→ /shop) need Yurix's OK.
- No contact inbox screen in the admin yet ("Contact page" is "soon" in the design); messages are in the database.
- New handoff calls `Artist Portfolio v7` the newest overview, with a **"Cut & Paste" Home**. Home stays v6 unless Yurix says otherwise.
