// Admin sign-in (Better Auth): one owner account, email + password, no sign-ups.
// Relative .ts imports so scripts/admin-create.mts can use it from plain Node.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db/index.ts";
import { account, rateLimit, session, user, verification } from "../db/schema.ts";
import { sendEmail } from "./email.ts";

const MINUTE = 60;

/** Hosts the admin is used from: local dev, Codespaces, Vercel (+ ADMIN_HOSTS, comma-separated). */
const hosts = [
  "localhost:3000",
  "*.app.github.dev",
  "art-protfolio-mayurs-projects-a86f5cd0.vercel.app",
  "art-protfolio-*-mayurs-projects-a86f5cd0.vercel.app",
  ...(process.env.ADMIN_HOSTS?.split(",").map((h) => h.trim()).filter(Boolean) ?? []),
];

/** Browser origins allowed to call the auth API (CSRF check). */
const trustedOrigins = hosts.map((h) => (h.startsWith("localhost") ? `http://${h}` : `https://${h}`));

function createAuth() {
  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    // Links in emails (password reset) use the host the request came from, if it's
    // one of ours; BETTER_AUTH_URL pins one address instead.
    baseURL: process.env.BETTER_AUTH_URL || { allowedHosts: hosts, fallback: "http://localhost:3000" },
    advanced: { trustedProxyHeaders: true },
    trustedOrigins,
    database: drizzleAdapter(db(), {
      provider: "pg",
      schema: { user, session, account, verification, rateLimit },
    }),
    emailAndPassword: {
      enabled: true,
      // Single owner account, created with `npm run admin:create`.
      disableSignUp: true,
      minPasswordLength: 10,
      // The reset link works for 30 minutes; other sessions are signed out after a reset.
      resetPasswordTokenExpiresIn: 30 * MINUTE,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user: u, url }) => {
        await sendEmail({
          to: u.email,
          subject: "Reset your yurix admin password",
          text: `Someone asked to reset the password for the yurix admin.\n\nSet a new password (valid for 30 minutes):\n${url}\n\nIf it wasn't you, ignore this email.`,
        });
      },
    },
    rateLimit: {
      // On in every environment, stored in the database (serverless-safe).
      enabled: true,
      storage: "database",
      customRules: {
        // 5 sign-in tries per 15 minutes, then locked until the window passes.
        "/sign-in/email": { window: 15 * MINUTE, max: 5 },
        "/request-password-reset": { window: 15 * MINUTE, max: 3 },
      },
    },
    // Must be the last plugin: lets server actions set the session cookie.
    plugins: [nextCookies()],
  });
}

let instance: ReturnType<typeof createAuth> | undefined;

/** The auth instance, created on first use (needs DATABASE_URL). */
export function getAuth() {
  instance ??= createAuth();
  return instance;
}
