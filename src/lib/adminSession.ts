// Server-side admin check for server actions and route handlers.
import { headers } from "next/headers";
import { getAuth } from "./auth";

/** The signed-in admin session, or null. */
export async function getAdminSession(requestHeaders?: Headers) {
  return getAuth().api.getSession({ headers: requestHeaders ?? (await headers()) });
}

/** Throws unless an admin is signed in. Call at the top of every admin action. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Please sign in again.");
  return session;
}
