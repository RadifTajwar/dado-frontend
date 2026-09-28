/* Money derived from jobs. Totals are never stored, so they can never drift
   from the jobs they come from. */

import type { Job } from "@/lib/types"

export type Finance = { billed: number; paid: number; due: number; count: number }

export const NO_FINANCE: Finance = { billed: 0, paid: 0, due: 0, count: 0 }

/** Rounds to cents so floating-point sums print cleanly. */
export const cents = (n: number) => Math.round(n * 100) / 100

export function sumJobs(jobs: Job[]): Finance {
  let billed = 0
  let paid = 0
  for (const j of jobs) {
    billed += j.amount
    paid += j.paid
  }
  return { billed: cents(billed), paid: cents(paid), due: cents(billed - paid), count: jobs.length }
}

/** clientId → that client's totals. */
export function financeByClient(jobs: Job[]) {
  const groups = new Map<string, Job[]>()
  for (const j of jobs) groups.set(j.clientId, [...(groups.get(j.clientId) ?? []), j])
  return new Map([...groups].map(([id, list]) => [id, sumJobs(list)]))
}

/** Every month from `first` to `last` inclusive, as "YYYY-MM", so months without jobs still get a (zero) bar. */
export function monthsBetween(first: string, last: string): string[] {
  const months: string[] = []
  let [year, month] = first.split("-").map(Number)
  const [lastYear, lastMonth] = last.split("-").map(Number)
  while (year < lastYear || (year === lastYear && month <= lastMonth)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`)
    if (month === 12) {
      year += 1
      month = 1
    } else month += 1
  }
  return months
}

/** Share of `part` in `whole` as a whole percentage (0 when there is nothing). */
export const percent = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0)
