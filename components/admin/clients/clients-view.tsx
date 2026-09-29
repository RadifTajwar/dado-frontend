"use client"

import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"

import { AddWorkDialog } from "@/components/admin/clients/add-work-dialog"
import { ClientDetailDialog } from "@/components/admin/clients/client-detail-dialog"
import { ClientFormDialog } from "@/components/admin/clients/client-form-dialog"
import { RecordPaymentDialog } from "@/components/admin/clients/record-payment-dialog"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { DataTable, type Column } from "@/components/admin/data-table"
import { DateRangeFilter, FilterSelect } from "@/components/admin/filter-controls"
import { KpiCard, KpiGrid } from "@/components/admin/kpi-card"
import { PersonCell } from "@/components/admin/person-cell"
import { StatusBadge } from "@/components/admin/status-badge"
import { useMutation } from "@/components/admin/use-mutation"
import { Button } from "@/components/ui/button"
import { NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"
import { inRange, NO_RANGE, type DateRange } from "@/lib/admin/filters"
import { financeByClient, NO_FINANCE, percent, sumJobs, type Finance } from "@/lib/admin/finance"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { dayOf, formatDate, money, money0 } from "@/lib/format"
import { DISCIPLINE_ORDER, DISCIPLINES } from "@/lib/site"
import type { Client, Job, Service } from "@/lib/types"

type Row = { client: Client; f: Finance }

// Which dialog is open. Sub-dialogs return to the client's detail view, like the prototype.
type Modal =
  | { kind: "detail" | "edit" | "addWork" | "deleteClient"; clientId: string }
  | { kind: "payment" | "deleteJob"; clientId: string; jobId: string }
  | { kind: "newClient" }

export function ClientsView({
  clients,
  jobs,
  services,
  openId,
}: {
  clients: Client[]
  jobs: Job[]
  services: Service[]
  openId?: string
}) {
  const mutate = useMutation()
  const [modal, setModal] = useState<Modal | null>(() =>
    openId && clients.some((c) => c.id === openId) ? { kind: "detail", clientId: openId } : null,
  )

  // A deep link (?c=<id>, from Trials or the dashboard) opens that client once;
  // drop it from the URL so a refresh doesn't open it again.
  useEffect(() => {
    if (openId) window.history.replaceState(null, "", "/admin/clients")
  }, [openId])

  const [service, setService] = useState("all") // a service id
  const [since, setSince] = useState<DateRange>(NO_RANGE)

  const finance = financeByClient(jobs)
  const serviceById = new Map(services.map((s) => [s.id, s]))
  // Clients who have had at least one job for the chosen service.
  const boughtIt = new Set(jobs.filter((j) => j.serviceId === service).map((j) => j.clientId))
  const rows: Row[] = clients
    .filter((c) => (service === "all" || boughtIt.has(c.id)) && inRange(dayOf(c.since), since))
    .map((client) => ({ client, f: finance.get(client.id) ?? NO_FINANCE }))
    .sort((a, b) => b.f.billed - a.f.billed)
  const totals = sumJobs(jobs)
  const fromTrial = clients.filter((c) => c.source === "trial").length

  const current = modal && "clientId" in modal ? clients.find((c) => c.id === modal.clientId) : undefined
  const job = modal && "jobId" in modal ? jobs.find((j) => j.id === modal.jobId) : undefined
  const currentJobs = current ? jobs.filter((j) => j.clientId === current.id) : []
  const backToDetail = () => setModal(current ? { kind: "detail", clientId: current.id } : null)

  const columns: Column<Row>[] = [
    {
      id: "client",
      header: "Client",
      sortValue: (r) => r.client.company || r.client.name,
      cell: (r) => (
        <PersonCell name={r.client.name} title={r.client.company || r.client.name} sub={`${r.client.name} · ${r.client.email}`} />
      ),
    },
    {
      id: "country",
      header: "Country",
      // wide screens only, so the row fits a laptop; still searchable and shown in Details
      className: "hidden 2xl:table-cell",
      sortValue: (r) => r.client.country,
      cell: (r) => r.client.country || "—",
    },
    {
      id: "source",
      header: "Source",
      sortValue: (r) => r.client.source,
      cell: (r) =>
        r.client.source === "trial" ? <StatusBadge tone="clay">Free trial</StatusBadge> : <StatusBadge>Direct</StatusBadge>,
    },
    {
      id: "since",
      header: "Since",
      className: "whitespace-nowrap tabular-nums",
      sortValue: (r) => r.client.since,
      cell: (r) => formatDate(r.client.since),
    },
    {
      id: "jobs",
      header: "Jobs",
      // from 1400px up; the count is also in Details
      className: "hidden text-right tabular-nums min-[1400px]:table-cell",
      sortValue: (r) => r.f.count,
      cell: (r) => r.f.count,
    },
    { id: "billed", header: "Billed", className: "text-right tabular-nums", sortValue: (r) => r.f.billed, cell: (r) => money(r.f.billed) },
    { id: "paid", header: "Paid", className: "text-right tabular-nums", sortValue: (r) => r.f.paid, cell: (r) => money(r.f.paid) },
    {
      id: "due",
      header: "Due",
      className: "text-right tabular-nums",
      sortValue: (r) => r.f.due,
      cell: (r) => (r.f.due > 0 ? <span className="font-semibold text-bad">{money(r.f.due)}</span> : "—"),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-px whitespace-nowrap text-right", // shrink to the buttons, never squash them
      cell: (r) => (
        <div className="flex justify-end gap-1.5">
          <Button type="button" variant="outline" size="sm" onClick={() => setModal({ kind: "detail", clientId: r.client.id })}>
            Details
          </Button>
          <Button type="button" variant="clay" size="sm" onClick={() => setModal({ kind: "addWork", clientId: r.client.id })}>
            <PlusIcon /> Add work
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <KpiGrid>
        <KpiCard label="Clients" value={clients.length} meta={`${fromTrial} came from a free trial`} />
        <KpiCard label="Billed" value={money0(totals.billed)} meta="across all jobs" />
        <KpiCard
          label="Collected"
          value={money0(totals.paid)}
          meta={
            <StatusBadge tone="ok" dot>
              {percent(totals.paid, totals.billed)}%
            </StatusBadge>
          }
        />
        <KpiCard
          label="Outstanding"
          value={money0(totals.due)}
          meta={
            totals.due > 0 ? (
              <StatusBadge tone="bad" dot>
                chase these
              </StatusBadge>
            ) : (
              <StatusBadge tone="ok" dot>
                all settled
              </StatusBadge>
            )
          }
        />
      </KpiGrid>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.client.id}
        searchText={(r) => `${r.client.name} ${r.client.company} ${r.client.email} ${r.client.country}`}
        searchLabel="Search client, company or email…"
        actions={
          <Button type="button" variant="clay" onClick={() => setModal({ kind: "newClient" })}>
            <PlusIcon /> New client
          </Button>
        }
        filters={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FilterSelect label="Service" value={service} onChange={setService}>
              <NativeSelectOption value="all">All services</NativeSelectOption>
              {DISCIPLINE_ORDER.map((d) => (
                <NativeSelectOptGroup key={d} label={DISCIPLINES[d].long}>
                  {services
                    .filter((s) => s.discipline === d)
                    .map((s) => (
                      <NativeSelectOption key={s.id} value={s.id}>
                        {s.name}
                      </NativeSelectOption>
                    ))}
                </NativeSelectOptGroup>
              ))}
            </FilterSelect>
            <DateRangeFilter label="Client since" value={since} onChange={setSince} />
          </div>
        }
        empty={{ title: "No clients yet", description: "Add one here, or convert a trial over on the Trials page." }}
      />

      {modal?.kind === "detail" && current && (
        <ClientDetailDialog
          client={current}
          jobs={currentJobs}
          services={serviceById}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ kind: "edit", clientId: current.id })}
          onAddWork={() => setModal({ kind: "addWork", clientId: current.id })}
          onRecordPayment={(j) => setModal({ kind: "payment", clientId: current.id, jobId: j.id })}
          onDeleteJob={(j) => setModal({ kind: "deleteJob", clientId: current.id, jobId: j.id })}
          onDeleteClient={() => setModal({ kind: "deleteClient", clientId: current.id })}
        />
      )}

      {modal?.kind === "newClient" && <ClientFormDialog onDone={() => setModal(null)} />}
      {modal?.kind === "edit" && current && <ClientFormDialog client={current} onDone={backToDetail} />}
      {modal?.kind === "addWork" && current && <AddWorkDialog client={current} services={services} onDone={backToDetail} />}
      {modal?.kind === "payment" && job && (
        <RecordPaymentDialog job={job} serviceName={serviceById.get(job.serviceId)?.name ?? "Job"} onDone={backToDetail} />
      )}

      {modal?.kind === "deleteJob" && job && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && backToDetail()}
          title="Delete this job?"
          description={`${serviceById.get(job.serviceId)?.name ?? "Job"} · ${money(job.amount)} on ${formatDate(job.date)}. This cannot be undone.`}
          onConfirm={async () => {
            if (await mutate(() => apiFetch(API.admin.job(job.id), { method: "DELETE" }), { success: "Job deleted" })) backToDetail()
          }}
        />
      )}

      {modal?.kind === "deleteClient" && current && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && backToDetail()}
          title="Delete this client?"
          description={`${current.company || current.name} and all ${currentJobs.length} logged job(s) will be removed. Any trial they came from goes back to New.`}
          confirmLabel="Delete client"
          onConfirm={async () => {
            if (await mutate(() => apiFetch(API.admin.client(current.id), { method: "DELETE" }), { success: "Client deleted" }))
              setModal(null)
          }}
        />
      )}
    </>
  )
}
