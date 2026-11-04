// Server-side admin check for server actions and route handlers.
import { headers } from "next/headers";
import { getAuth } from "./auth";

/**
 * Admin sign-in is switched OFF at Yurix's request (2026-11-04): /admin opens
 * directly and every check below passes. To turn it back on: set this to true
 * and restore the sign-in screen + gate from git (src/proxy.ts,
 * src/app/admin/login, src/app/admin/reset-password, components/admin/AdminLogin).
 */
export const ADMIN_LOGIN_ENABLED = false;

/** The signed-in admin session, or null. */
export async function getAdminSession(requestHeaders?: Headers) {
  return getAuth().api.getSession({ headers: requestHeaders ?? (await headers()) });
}

/** True when the request may use the admin (always, while sign-in is off). */
export async function isAdmin(requestHeaders?: Headers) {
  if (!ADMIN_LOGIN_ENABLED) return true;
  return Boolean(await getAdminSession(requestHeaders));
}

/** Throws unless an admin is signed in (no-op while sign-in is off). Call at the top of every admin action. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Please sign in again.");
}
