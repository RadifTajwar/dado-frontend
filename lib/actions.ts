"use server"

import { updateTag } from "next/cache"

import { PUBLIC_TAGS, type PublicTag } from "@/lib/api/endpoints"
import { getCurrentAdmin } from "@/lib/api/server"

const KNOWN = new Set<string>(Object.values(PUBLIC_TAGS))

/**
 * Call after an admin edit to services, media or the portfolio so the public
 * pages show the change on the next visit instead of after the cache timer.
 * Server Actions can be called by anyone who knows their ID, so the admin's
 * token is verified with the API (not just "a cookie exists").
 * Resolves to true when a tag was expired: Next then re-renders the current
 * page in the same response, so the caller needs no router.refresh().
 */
export async function refreshPublicData(tags: PublicTag[]): Promise<boolean> {
  const valid = tags.filter((tag) => KNOWN.has(tag))
  if (valid.length === 0 || !(await getCurrentAdmin())) return false
  for (const tag of valid) updateTag(tag)
  return true
}
