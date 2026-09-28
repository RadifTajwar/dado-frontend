/* Server-side API calls. Use from Server Components only (never in the browser):
   they talk to the Go server directly on BACKEND_URL, not through the rewrite. */

import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { API, AUTH_COOKIE, type PublicTag } from "@/lib/api/endpoints"
import type { AdminUser } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080"

/**
 * Public data (services, media, portfolio). Cached and served from the
 * rendered page, so visitors never wait on the API or see a loading state.
 * Admin edits refresh it at once via refreshPublicData(); the timer is a backstop.
 * ponytail: `next build` pre-renders these pages, so the Go API must be running during a build.
 */
export async function getPublic<T>(path: string, tag: PublicTag): Promise<T> {
  const res = await fetch(BACKEND_URL + path, { next: { revalidate: 600, tags: [tag] } })
  if (!res.ok) throw new Error(`GET ${path} failed with ${res.status}`)
  return res.json() as Promise<T>
}

/**
 * Admin data. Forwards the visitor's auth cookie and is never cached.
 * A missing or expired token sends the admin to the login page.
 */
export async function getAdmin<T>(path: string): Promise<T> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  if (!token) redirect("/admin/login")

  const res = await fetch(BACKEND_URL + path, {
    headers: { Cookie: `${AUTH_COOKIE}=${token}` },
    cache: "no-store",
  })
  if (res.status === 401) redirect("/admin/login")
  if (!res.ok) throw new Error(`GET ${path} failed with ${res.status}`)
  return res.json() as Promise<T>
}

/** The signed-in admin, or null. Never redirects (safe on the login page). */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  if (!token) return null
  const res = await fetch(BACKEND_URL + API.auth.me, {
    headers: { Cookie: `${AUTH_COOKIE}=${token}` },
    cache: "no-store",
  }).catch(() => null)
  return res?.ok ? ((await res.json()) as AdminUser) : null
}
