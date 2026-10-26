import { NextResponse, type NextRequest } from "next/server";
import { getAuth } from "@/lib/auth";

// Admin gate: every /admin page needs a signed-in admin, except the sign-in
// and reset-password screens. Server actions and /api/uploads check again.
//
// Without a session the sign-in screen is shown *at the requested address*
// (a rewrite, not a redirect): absolute redirects would point at the internal
// host behind proxies such as Codespaces. After sign-in the page reloads in place.
const OPEN = ["/admin/login", "/admin/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (OPEN.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;

  const session = await getAuth().api.getSession({ headers: request.headers });
  if (session) return;

  return NextResponse.rewrite(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
