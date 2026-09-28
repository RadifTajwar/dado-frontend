/* Everything the dashboard shows, computed from the raw lists in one pure
   function. ponytail: fine for thousands of jobs; move to a Mongo aggregation
   endpoint if the job list ever gets large enough to slow the page. */

import { financeByClient, monthsBetween, NO_FINANCE, percent, sumJobs } from "@/lib/admin/finance"
import { DISCIPLINE_LABEL } from "@/lib/admin/labels"
import { money } from "@/lib/format"
import { DISCIPLINE_ORDER, DISCIPLINES } from "@/lib/site"
import type { Client, Contact, Job, Service, Trial } from "@/lib/types"

export type BarRow = { label: string; value: number; meta?: string }
export type MonthPoint = { month: string; billed: number; collected: number }
export type OwingRow = { id: string; label: string; name: string; billed: number; due: number; jobs: number }
export type FeedItem = { at: string; kind: "Job" | "Trial" | "Message"; title: string; detail: string }

const monthName = new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" })
/** "2026-03" → "Mar 26" (the year keeps two Marches apart) */
const monthLabel = (ym: string) => monthName.format(new Date(`${ym}-15T00:00:00Z`))

// "YYYY-MM-DD" (a studio day) and ISO timestamps on one comparable scale.
const time = (v: string) => Date.parse(v.length === 10 ? `${v}T12:00:00+06:00` : v)

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

export function dashboardStats(data: {
  clients: Client[]
  jobs: Job[]
  services: Service[]
  trials: Trial[]
  contacts: Contact[]
}) {
  const { clients, jobs, services, trials, contacts } = data
  const service = new Map(services.map((s) => [s.id, s]))
  const client = new Map(clients.map((c) => [c.id, c]))
  const total = sumJobs(jobs)
  const perClient = financeByClient(jobs)

  const trialCount = (status: Trial["status"]) => trials.filter((t) => t.status === status).length
  const converted = trialCount("converted")

  // Every month from the first job to the last (empty ones as 0), at most the last 24 so a mistyped date can't stretch the chart.
  const used = jobs.map((j) => j.date.slice(0, 7)).sort()
  const months = used.length ? monthsBetween(used[0], used.at(-1)!).slice(-24) : []
  const monthly: MonthPoint[] = months.map((m) => {
    const inMonth = sumJobs(jobs.filter((j) => j.date.startsWith(m)))
    return { month: monthLabel(m), billed: inMonth.billed, collected: inMonth.paid }
  })

  const byClient = clients
    .map((c) => {
      const f = perClient.get(c.id) ?? NO_FINANCE
      return { id: c.id, label: c.company || c.name, name: c.name, billed: f.billed, due: f.due, jobs: f.count }
    })
    .filter((c) => c.jobs > 0)
    .sort((a, b) => b.billed - a.billed)

  const byDiscipline: BarRow[] = DISCIPLINE_ORDER.map((d) => {
    const list = jobs.filter((j) => service.get(j.serviceId)?.discipline === d)
    return { label: DISCIPLINE_LABEL[d], value: sumJobs(list).billed, meta: plural(list.length, "job") }
  }).sort((a, b) => b.value - a.value)

  const serviceTotals = new Map<string, { value: number; n: number }>()
  for (const j of jobs) {
    const row = serviceTotals.get(j.serviceId) ?? { value: 0, n: 0 }
    serviceTotals.set(j.serviceId, { value: row.value + j.amount, n: row.n + 1 })
  }
  const byService: BarRow[] = [...serviceTotals]
    .map(([id, r]) => ({ label: service.get(id)?.name ?? "Removed service", value: r.value, meta: plural(r.n, "job") }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7)

  const owing: OwingRow[] = byClient.filter((c) => c.due > 0).sort((a, b) => b.due - a.due)

  const feed: FeedItem[] = [
    ...jobs.map((j) => ({
      at: j.date,
      kind: "Job" as const,
      title: client.get(j.clientId)?.company || client.get(j.clientId)?.name || "—",
      detail: `${service.get(j.serviceId)?.name ?? "Removed service"} · ${money(j.amount)}`,
    })),
    ...trials.map((t) => ({
      at: t.createdAt,
      kind: "Trial" as const,
      title: t.company || t.name,
      detail: t.services.map((d) => DISCIPLINES[d].label).join(", "),
    })),
    ...contacts.map((c) => ({
      at: c.createdAt,
      kind: "Message" as const,
      title: c.name,
      detail: c.service || "General enquiry",
    })),
  ]
    .sort((a, b) => time(b.at) - time(a.at))
    .slice(0, 8)

  return {
    total,
    collectRate: percent(total.paid, total.billed),
    avgJob: jobs.length ? total.billed / jobs.length : 0,
    jobCount: jobs.length,
    clientCount: clients.length,
    newTrials: trialCount("new"),
    flaggedTrials: trialCount("flagged"),
    convertedTrials: converted,
    conversion: percent(converted, trials.length),
    monthly,
    monthRange: months.length ? `Monthly, ${monthLabel(months[0])} – ${monthLabel(months.at(-1)!)}` : "No jobs logged yet",
    byClient: byClient.map((c): BarRow => ({ label: c.label, value: c.billed, meta: plural(c.jobs, "job") })),
    byDiscipline,
    byService,
    owing,
    feed,
  }
}
