/* Price helpers shared by the home teaser table and the services page. */

import { DISCIPLINE_ORDER } from "@/lib/site"
import type { Discipline, Service } from "@/lib/types"

// The unit each discipline is normally priced in (the price tables say so in their captions).
const DEFAULT_UNIT: Record<Discipline, string> = { photo: "image", video: "minute", voice: "100 words" }

/** "per minute" under a price: always when asked, otherwise only when the unit
    differs from the discipline's usual one (the table caption already says that). */
export const unitNote = (s: Service, always = false) =>
  always || s.unit !== DEFAULT_UNIT[s.discipline] ? `per ${s.unit}` : undefined

/** Photo → video → voice, then the admin's order. */
export function sortServices(services: Service[]) {
  return [...services].sort(
    (a, b) => DISCIPLINE_ORDER.indexOf(a.discipline) - DISCIPLINE_ORDER.indexOf(b.discipline) || a.order - b.order,
  )
}

/** One discipline's services grouped by price-table caption, in first-seen order. */
export function groupByCaption(services: Service[]): [string, Service[]][] {
  const groups = new Map<string, Service[]>()
  for (const s of services) groups.set(s.group, [...(groups.get(s.group) ?? []), s])
  return [...groups]
}
