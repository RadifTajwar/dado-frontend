import { NextResponse, type NextRequest } from "next/server"

import { AUTH_COOKIE } from "@/lib/api/endpoints"

/* Runs before admin pages render. It only checks that the auth cookie exists
   (a quick, optimistic check); the Go API verifies the JWT on every request,
   so a forged or expired cookie still gets nothing. */
export function proxy(request: NextRequest) {
  if (request.cookies.has(AUTH_COOKIE)) return NextResponse.next()

  const login = new URL("/admin/login", request.url)
  login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(login)
}

export const config = {
  // Admin pages only. /api is left out on purpose so uploads stream straight to Go.
  matcher: ["/admin", "/admin/((?!login|reset-password).*)"],
}
