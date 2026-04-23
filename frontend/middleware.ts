// Edge middleware — injects the shared BIAZMARK_API_KEY into every /api/*
// request as `x-api-key` before Next.js proxies it to the FastAPI backend.
// Browsers never see the key.
//
// Env var is set on Vercel (BIAZMARK_API_KEY, Production environment).
// Locally, if the var is blank, we silently skip — matches the backend's
// "blank key = auth disabled" behaviour.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/api/:path*", "/media/:path*"],
};

export function middleware(req: NextRequest) {
  const key = process.env.BIAZMARK_API_KEY || "";
  if (!key) return NextResponse.next();

  // OAuth callbacks need to be reachable without the key — the browser will
  // be redirected here by the provider, and the backend whitelists these paths.
  if (req.nextUrl.pathname.startsWith("/api/oauth/callback")) {
    return NextResponse.next();
  }

  const headers = new Headers(req.headers);
  headers.set("x-api-key", key);
  return NextResponse.next({ request: { headers } });
}
