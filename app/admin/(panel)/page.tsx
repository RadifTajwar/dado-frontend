import type { Metadata } from "next"
import Link from "next/link"

import { AdminCard } from "@/components/admin/admin-card"
import { ActivityFeed } from "@/components/admin/dashboard/activity-feed"
import { BilledCollectedChart } from "@/components/admin/dashboard/billed-collected-chart"
import { ChartCard } from "@/components/admin/dashboard/chart-card"
import { MoneyBars } from "@/components/admin/dashboard/money-bars"
import { OwingList } from "@/components/admin/dashboard/owing-list"
import { KpiCard, KpiGrid } from "@/components/admin/kpi-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { dashboardStats, type BarRow } from "@/lib/admin/stats"
import { API } from "@/lib/api/endpoints"
import { getAdmin } from "@/lib/api/server"
import { money, money0 } from "@/lib/format"
import type { Client, Contact, Job, Service, Trial } from "@/lib/types"

export const metadata: Metadata = { title: "Dashboard" }

const barTable = (head: string, rows: BarRow[]) => ({
  head: [head, "Revenue", "Jobs"],
  rows: rows.map((r) => [r.label, money(r.value), r.meta ?? ""]),
})

export default async function DashboardPage() {
  const [clients, jobs, services, trials, contacts] = await Promise.all([
    getAdmin<Client[]>(API.admin.clients),
    getAdmin<Job[]>(API.admin.jobs),
    getAdmin<Service[]>(API.admin.services),
    getAdmin<Trial[]>(API.admin.trials),
    getAdmin<Contact[]>(API.admin.contacts),
  ])
  const s = dashboardStats({ clients, jobs, services, trials, contacts })

  return (
    <>
      <KpiGrid>
        <KpiCard
          label="Billed"
          value={money0(s.total.billed)}
          meta={`${s.jobCount} jobs across ${s.clientCount} clients`}
          spark={s.monthly.map((m) => m.billed)}
        />
        <KpiCard
          label="Collected"
          value={money0(s.total.paid)}
          meta={
            <StatusBadge tone="ok" dot>
              {s.collectRate}% of billed
            </StatusBadge>
          }
          spark={s.monthly.map((m) => m.collected)}
        />
        <KpiCard
          label="Outstanding"
          value={money0(s.total.due)}
          meta={
            s.total.due > 0 ? (
              <StatusBadge tone="bad" dot>
                {s.owing.length} client{s.owing.length === 1 ? "" : "s"} owing
              </StatusBadge>
            ) : (
              <StatusBadge tone="ok" dot>
                All settled
              </StatusBadge>
            )
          }
        />
        <KpiCard
          label="Trials waiting"
          value={s.newTrials}
          meta={
            <>
              {s.flaggedTrials} flagged · {s.convertedTrials} converted
              <Link href="/admin/trials" className="font-semibold text-clay hover:underline">
                Review →
              </Link>
            </>
          }
        />
        <KpiCard label="Conversion" value={`${s.conversion}%`} meta="trial → paying client" />
        <KpiCard label="Avg job value" value={money0(s.avgJob)} meta="across all disciplines" />
      </KpiGrid>

      <ChartCard
        title="Billed vs collected"
        sub={s.monthRange}
        table={{
          head: ["Month", "Billed", "Collected"],
          rows: s.monthly.map((m) => [m.month, money(m.billed), money(m.collected)]),
        }}
      >
        <BilledCollectedChart points={s.monthly} />
      </ChartCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Top clients by revenue" sub="All time" table={barTable("Client", s.byClient)}>
          <MoneyBars rows={s.byClient} label="Revenue by client" />
        </ChartCard>
        <ChartCard title="Revenue by discipline" sub="Where the money comes from" table={barTable("Discipline", s.byDiscipline)}>
          <MoneyBars rows={s.byDiscipline} label="Revenue by discipline" />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Most valuable services" sub="Top 7 by revenue" table={barTable("Service", s.byService)}>
          <MoneyBars rows={s.byService} label="Revenue by service" />
        </ChartCard>
        <AdminCard title="Who owes money" sub="Unpaid balance by client" flush>
          <OwingList rows={s.owing} />
        </AdminCard>
      </div>

      <AdminCard title="Recent activity" sub="Latest jobs, trials and messages" flush>
        <ActivityFeed items={s.feed} />
      </AdminCard>
    </>
  )
}
