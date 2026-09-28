"use client"

import { PlusIcon, XIcon } from "lucide-react"

import { EmptyState } from "@/components/admin/empty-state"
import { Facts, MiniLabel } from "@/components/admin/facts"
import { FileLink, Initials } from "@/components/admin/person-cell"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cents, percent, sumJobs } from "@/lib/admin/finance"
import { DISCIPLINE_LABEL, JOB_STATUS } from "@/lib/admin/labels"
import { formatDate, money, money0 } from "@/lib/format"
import { DISCIPLINE_ORDER } from "@/lib/site"
import type { Client, Job, Service } from "@/lib/types"

/* One client's full history: what they were charged, what they paid, what is still owed. */
export function ClientDetailDialog({
  client,
  jobs,
  services,
  onClose,
  onEdit,
  onAddWork,
  onRecordPayment,
  onDeleteJob,
  onDeleteClient,
}: {
  client: Client
  jobs: Job[]
  services: Map<string, Service>
  onClose: () => void
  onEdit: () => void
  onAddWork: () => void
  onRecordPayment: (job: Job) => void
  onDeleteJob: (job: Job) => void
  onDeleteClient: () => void
}) {
  const f = sumJobs(jobs)
  const collected = percent(f.paid, f.billed)
  const history = jobs.toSorted((a, b) => b.date.localeCompare(a.date))
  const mix = DISCIPLINE_ORDER.map((d) => ({
    d,
    n: jobs.filter((j) => services.get(j.serviceId)?.discipline === d).length,
  })).filter((m) => m.n > 0)

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl">
        <DialogHeader className="flex-row items-start gap-3.5 pr-8">
          <Initials name={client.name} className="size-10.5 text-[0.9rem]" />
          <div className="min-w-0">
            <DialogTitle className="font-serif text-[1.3rem] font-normal">{client.company || client.name}</DialogTitle>
            <DialogDescription>
              {client.name} ·{" "}
              <a href={`mailto:${encodeURIComponent(client.email)}`} className="border-b border-input">
                {client.email}
              </a>{" "}
              · {client.country || "—"} · client since {formatDate(client.since)}
            </DialogDescription>
          </div>
        </DialogHeader>

        <Facts
          items={[
            { label: "Jobs", value: f.count },
            { label: "Charged", value: money0(f.billed) },
            { label: "Received", value: money0(f.paid), tone: "ok" },
            { label: "Still owed", value: money0(f.due), tone: f.due > 0 ? "bad" : "ok" },
          ]}
        />

        <div>
          <div className="mb-2 flex justify-between text-[0.8rem]">
            <span className="text-muted-foreground">Collected</span>
            <span className="tabular-nums">
              {collected}% of {money(f.billed)}
            </span>
          </div>
          <Progress value={collected} aria-label="Share collected" className="h-1.75 [&>[data-slot=progress-indicator]]:bg-clay" />
        </div>

        {mix.length > 0 && (
          <div>
            <MiniLabel>Works with you on</MiniLabel>
            <div className="flex flex-wrap gap-1.5">
              {mix.map((m) => (
                <StatusBadge key={m.d}>
                  {DISCIPLINE_LABEL[m.d]} · {m.n}
                </StatusBadge>
              ))}
            </div>
          </div>
        )}

        <div className="min-w-0">
          <div className="mb-2.5 flex items-center gap-2.5">
            <MiniLabel className="mb-0">Service history</MiniLabel>
            <Button type="button" size="sm" variant="clay" className="ml-auto" onClick={onAddWork}>
              <PlusIcon /> Add work
            </Button>
          </div>
          {history.length ? (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full min-w-140 text-[0.84rem]">
                <thead className="bg-muted/60 text-[0.7rem] tracking-[0.1em] text-muted-foreground uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Date</th>
                    <th className="px-3 py-2 text-left font-semibold">Service</th>
                    <th className="px-3 py-2 text-left font-semibold">Qty</th>
                    <th className="px-3 py-2 text-right font-semibold">Charged</th>
                    <th className="px-3 py-2 text-right font-semibold">Paid</th>
                    <th className="px-3 py-2 text-right font-semibold">Due</th>
                    <th className="px-3 py-2">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((j) => {
                    const service = services.get(j.serviceId)
                    const due = cents(j.amount - j.paid)
                    const status = JOB_STATUS[j.status]
                    return (
                      <tr key={j.id} className="border-t align-top">
                        <td className="px-3 py-2.5 whitespace-nowrap">{formatDate(j.date)}</td>
                        <td className="px-3 py-2.5">
                          <b className="font-semibold">{service?.name ?? "Removed service"}</b>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.78rem]">
                            <StatusBadge tone={status.tone} className="px-2 py-0 text-[0.68rem]">
                              {status.label}
                            </StatusBadge>
                            {j.link && <FileLink url={j.link} />}
                          </div>
                          {j.details && <p className="mt-1 text-[0.78rem] text-muted-foreground">{j.details}</p>}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap tabular-nums">
                          {j.qty} {service?.unit}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{money(j.amount)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{money(j.paid)}</td>
                        <td className={due > 0 ? "px-3 py-2.5 text-right font-semibold text-bad tabular-nums" : "px-3 py-2.5 text-right"}>
                          {due > 0 ? money(due) : "—"}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-1">
                            {due > 0 && (
                              <Button type="button" variant="outline" size="sm" onClick={() => onRecordPayment(j)}>
                                Record payment
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Delete job"
                              onClick={() => onDeleteJob(j)}
                            >
                              <XIcon />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-md border">
              <EmptyState title="No work logged yet" description="Add the first job to start tracking what this client owes." />
            </div>
          )}
        </div>

        {client.notes && <p className="text-[0.8rem] whitespace-pre-line text-muted-foreground">{client.notes}</p>}

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="destructive" onClick={onDeleteClient}>
            Delete client
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={onEdit}>
              Edit details
            </Button>
            <Button asChild variant="outline">
              <a href={`mailto:${encodeURIComponent(client.email)}`}>Email {client.name.trim().split(/\s+/)[0]}</a>
            </Button>
            <Button type="button" onClick={onClose}>
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
