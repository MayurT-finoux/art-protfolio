"use client";

import { createAuthClient } from "better-auth/react";

// Browser client for the admin sign-in screens (same-origin /api/auth).
export const authClient = createAuthClient();
