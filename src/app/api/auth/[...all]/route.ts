import { getAuth } from "@/lib/auth";

// Better Auth endpoints: /api/auth/sign-in/email, /sign-out, /request-password-reset, …
export function GET(request: Request) {
  return getAuth().handler(request);
}

export function POST(request: Request) {
  return getAuth().handler(request);
}
