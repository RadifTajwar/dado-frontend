"use client"

import { useState } from "react"
import { PlusIcon, XIcon } from "lucide-react"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { DataTable, type Column } from "@/components/admin/data-table"
import { KpiCard, KpiGrid } from "@/components/admin/kpi-card"
import { Segmented } from "@/components/admin/segmented"
import { ServiceDialog } from "@/components/admin/services/service-dialog"
import { StatusBadge } from "@/components/admin/status-badge"
import { ToggleSwitch } from "@/components/admin/toggle-switch"
import { useMutation } from "@/components/admin/use-mutation"
import { Button } from "@/components/ui/button"
import { cents } from "@/lib/admin/finance"
import { DISCIPLINE_LABEL } from "@/lib/admin/labels"
import { apiFetch } from "@/lib/api/client"
import { API, PUBLIC_TAGS } from "@/lib/api/endpoints"
import { money } from "@/lib/format"
import { DISCIPLINE_ORDER } from "@/lib/site"
import type { Discipline, Job, Service, ServiceInput } from "@/lib/types"

type Filter = "all" | "active" | "inactive" | Discipline
type Row = Service & { sold: number; revenue: number }
type Modal = { kind: "new" } | { kind: "edit" | "delete"; id: string }

export function ServicesView({ services, jobs }: { services: Service[]; jobs: Job[] }) {
  const mutate = useMutation()
  const [filter, setFilter] = useState<Filter>("all")
  const [modal, setModal] = useState<Modal | null>(null)

  const all: Row[] = services.map((s) => {
    const used = jobs.filter((j) => j.serviceId === s.id)
    return { ...s, sold: used.length, revenue: cents(used.reduce((n, j) => n + j.amount, 0)) }
  })
  const rows = all.filter((s) =>
    filter === "all" ? true : filter === "active" ? s.active : filter === "inactive" ? !s.active : s.discipline === filter,
  )
  const current = modal && modal.kind !== "new" ? all.find((s) => s.id === modal.id) : undefined

  // Send only the changed fields: the API merges them onto the stored service, so two
  // quick toggles can't undo each other with a stale copy of the row.
  const update = (s: Service, change: Partial<ServiceInput>, success: React.ReactNode) =>
    mutate(() => apiFetch<Service>(API.admin.service(s.id), { method: "PUT", body: change }), {
      success,
      publicTags: [PUBLIC_TAGS.services],
    })

  const columns: Column<Row>[] = [
    {
      id: "name",
      header: "Service",
      sortValue: (s) => s.name,
      cell: (s) => (
        <div className="grid min-w-0 gap-px">
          <b className="font-semibold">{s.name}</b>
          <span className="max-w-72 truncate text-[0.78rem] text-muted-foreground">
            {[s.group, s.use].filter(Boolean).join(" · ")}
          </span>
        </div>
      ),
    },
    {
      id: "discipline",
      header: "Discipline",
      sortValue: (s) => DISCIPLINE_ORDER.indexOf(s.discipline),
      cell: (s) => <StatusBadge>{DISCIPLINE_LABEL[s.discipline]}</StatusBadge>,
    },
    { id: "rate", header: "Rate", className: "text-right tabular-nums", sortValue: (s) => s.rate, cell: (s) => money(s.rate) },
    { id: "unit", header: "Unit", sortValue: (s) => s.unit, cell: (s) => <span className="text-muted-foreground">per {s.unit}</span> },
    { id: "sold", header: "Times sold", className: "text-right tabular-nums", sortValue: (s) => s.sold, cell: (s) => s.sold },
    {
      id: "revenue",
      header: "Revenue",
      className: "text-right tabular-nums",
      sortValue: (s) => s.revenue,
      cell: (s) => (s.revenue ? money(s.revenue) : "—"),
    },
    {
      id: "featured",
      header: "Featured",
      sortValue: (s) => Number(s.featured),
      cell: (s) => (
        <ToggleSwitch
          key={s.updatedAt}
          checked={s.featured}
          label={`Feature ${s.name} on the home page`}
          onChange={(featured) =>
            update(s, { featured }, featured ? `${s.name} is now on the home page` : `${s.name} is off the home page`)
          }
        />
      ),
    },
    {
      id: "live",
      header: "Live",
      sortValue: (s) => Number(s.active),
      cell: (s) => (
        <ToggleSwitch
          key={s.updatedAt}
          checked={s.active}
          label={`Show ${s.name} on the public site`}
          onText="Active"
          offText="Hidden"
          onChange={(active) =>
            update(
              s,
              { active },
              <span>
                <b>{s.name}</b> is now {active ? "active" : "hidden"}
              </span>,
            )
          }
        />
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-px whitespace-nowrap text-right", // shrink to the buttons, never squash them
      cell: (s) => (
        <div className="flex justify-end gap-1">
          <Button type="button" variant="outline" size="sm" onClick={() => setModal({ kind: "edit", id: s.id })}>
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${s.name}`}
            onClick={() => setModal({ kind: "delete", id: s.id })}
          >
            <XIcon />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <KpiGrid>
        <KpiCard
          label="Services"
          value={all.length}
          meta={`${all.filter((s) => s.active).length} active · ${all.filter((s) => !s.active).length} hidden`}
        />
        {DISCIPLINE_ORDER.map((d) => {
          const list = all.filter((s) => s.discipline === d)
          return (
            <KpiCard
              key={d}
              label={DISCIPLINE_LABEL[d]}
              value={list.length}
              meta={`${money(list.reduce((n, s) => n + s.revenue, 0))} earned`}
            />
          )
        })}
      </KpiGrid>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(s) => s.id}
        searchText={(s) => `${s.name} ${s.group} ${s.use}`}
        searchLabel="Search services…"
        actions={
          <Button type="button" variant="clay" onClick={() => setModal({ kind: "new" })}>
            <PlusIcon /> New service
          </Button>
        }
        filters={
          <Segmented
            label="Show"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Hidden" },
              { value: "photo", label: "Photo" },
              { value: "video", label: "Video" },
              { value: "voice", label: "Voice" },
            ]}
          />
        }
        rowClassName={(s) => (s.active ? undefined : "text-muted-foreground")}
        empty={{ title: "No services yet", description: "Add the first line of your price list." }}
      />

      {modal?.kind === "new" && <ServiceDialog services={services} onDone={() => setModal(null)} />}
      {modal?.kind === "edit" && current && <ServiceDialog service={current} services={services} onDone={() => setModal(null)} />}

      {modal?.kind === "delete" && current && (
        <DeleteServiceDialog
          service={current}
          onClose={() => setModal(null)}
          onHide={async () => {
            if (await update(current, { active: false }, <span><b>{current.name}</b> is now hidden</span>)) setModal(null)
          }}
          onDelete={async () => {
            const ok = await mutate(() => apiFetch(API.admin.service(current.id), { method: "DELETE" }), {
              success: "Service deleted",
              publicTags: [PUBLIC_TAGS.services],
            })
            if (ok) setModal(null)
          }}
        />
      )}
    </>
  )
}

/* A service that has been sold can't be deleted (its jobs would lose their
   name), so the dialog offers to hide it instead. */
function DeleteServiceDialog({
  service,
  onClose,
  onHide,
  onDelete,
}: {
  service: Row
  onClose: () => void
  onHide: () => Promise<void>
  onDelete: () => Promise<void>
}) {
  const jobsText = `${service.sold} logged job${service.sold === 1 ? "" : "s"}`

  if (service.sold === 0) {
    return (
      <ConfirmDialog
        open
        onOpenChange={(open) => !open && onClose()}
        title="Delete this service?"
        description={`“${service.name}” has never been sold. Removing it is safe.`}
        onConfirm={onDelete}
      />
    )
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="This service has been sold"
      description={
        service.active
          ? `“${service.name}” is attached to ${jobsText}, so it can't be deleted. Hide it instead — it disappears from the site and from Add work, and those jobs keep their service name.`
          : `“${service.name}” is attached to ${jobsText}, so it can't be deleted. It is already hidden from the public site.`
      }
      confirmLabel={service.active ? "Hide it" : "OK"}
      destructive={false}
      onConfirm={service.active ? onHide : async () => onClose()}
    />
  )
}
