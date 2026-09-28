"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { DataTable, type Column } from "@/components/admin/data-table"
import { EmailDialog } from "@/components/admin/email-dialog"
import { FlagDialog } from "@/components/admin/flag-dialog"
import { FileLink, PersonCell } from "@/components/admin/person-cell"
import { Segmented } from "@/components/admin/segmented"
import { StatusBadge } from "@/components/admin/status-badge"
import { TrialDetailsDialog } from "@/components/admin/trials/trial-details-dialog"
import { useMutation } from "@/components/admin/use-mutation"
import { Button } from "@/components/ui/button"
import { trialDraft } from "@/lib/admin/drafts"
import { TRIAL_FLAG_REASONS, TRIAL_STATUS } from "@/lib/admin/labels"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { formatDate, hostOf, timeAgo } from "@/lib/format"
import { DISCIPLINES } from "@/lib/site"
import type { Trial, TrialStatus } from "@/lib/types"

type StatusFilter = "all" | TrialStatus
type ReadFilter = "all" | "unread" | "read"
type Patch = { status?: TrialStatus; flagReason?: string; read?: true }
type Modal = { kind: "details" | "email" | "convert" | "flag"; id: string }

const who = (t: Trial) => t.company || t.name || t.email

export function TrialsView({ trials }: { trials: Trial[] }) {
  const mutate = useMutation()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [read, setRead] = useState<ReadFilter>("all")
  const [modal, setModal] = useState<Modal | null>(null)

  const current = modal && trials.find((t) => t.id === modal.id)
  const count = (s: TrialStatus) => trials.filter((t) => t.status === s).length
  const unread = trials.filter((t) => !t.read).length
  const rows = trials.filter(
    (t) => (status === "all" || t.status === status) && (read === "all" || (read === "read") === t.read),
  )

  const patch = (t: Trial, body: Patch, success?: React.ReactNode) =>
    mutate(() => apiFetch<Trial>(API.admin.trial(t.id), { method: "PATCH", body }), { success })

  function openDetails(t: Trial) {
    setModal({ kind: "details", id: t.id })
    if (!t.read) patch(t, { read: true }) // opening a request counts as reading it
  }

  const columns: Column<Trial>[] = [
    {
      id: "requester",
      header: "Requester",
      sortValue: who,
      cell: (t) => <PersonCell name={t.name || t.email} title={who(t)} sub={t.email} unread={!t.read} />,
    },
    {
      id: "needs",
      header: "Needs",
      sortValue: (t) => t.services.join(" "),
      cell: (t) => (
        <div className="flex gap-1">
          {t.services.map((d) => (
            <StatusBadge key={d}>{DISCIPLINES[d].label}</StatusBadge>
          ))}
        </div>
      ),
    },
    { id: "link", header: "Link", sortValue: (t) => hostOf(t.link), cell: (t) => <FileLink url={t.link} /> },
    {
      id: "received",
      header: "Received",
      sortValue: (t) => Date.parse(t.createdAt),
      cell: (t) => <span title={formatDate(t.createdAt)}>{timeAgo(t.createdAt)}</span>,
    },
    {
      id: "status",
      header: "Status",
      sortValue: (t) => t.status,
      cell: (t) => (
        <StatusBadge tone={TRIAL_STATUS[t.status].tone} dot>
          {TRIAL_STATUS[t.status].label}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-px whitespace-nowrap text-right", // shrink to the buttons, never squash them
      cell: (t) => (
        <div className="flex justify-end gap-1.5">
          {t.read ? (
            <StatusBadge tone="ok" className="self-center">
              <span title="Marked as read — this cannot be undone">✓ Read</span>
            </StatusBadge>
          ) : (
            <Button type="button" variant="ghost" size="sm" onClick={() => patch(t, { read: true }, "Marked as read")}>
              Read
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => openDetails(t)}>
            Details
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setModal({ kind: "email", id: t.id })}>
            Email
          </Button>
          {t.status === "converted" && t.clientId ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/clients?c=${t.clientId}`}>Open client</Link>
            </Button>
          ) : (
            <Button type="button" variant="clay" size="sm" onClick={() => setModal({ kind: "convert", id: t.id })}>
              <PlusIcon /> Client
            </Button>
          )}
          {t.status === "flagged" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => patch(t, { status: "new" }, <span>Unflagged <b>{who(t)}</b></span>)}
            >
              Unflag
            </Button>
          ) : (
            <Button type="button" variant="destructive" size="sm" onClick={() => setModal({ kind: "flag", id: t.id })}>
              Flag
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(t) => t.id}
        searchText={(t) => `${t.name} ${t.company} ${t.email}`}
        searchLabel="Search name, company or email…"
        filters={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Segmented
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All", count: trials.length },
                { value: "new", label: "New", count: count("new") },
                { value: "converted", label: "Clients", count: count("converted") },
                { value: "flagged", label: "Flagged", count: count("flagged") },
                { value: "declined", label: "Declined", count: count("declined") },
              ]}
            />
            <Segmented
              label="Read"
              value={read}
              onChange={setRead}
              options={[
                { value: "all", label: "All" },
                { value: "unread", label: "Unread", count: unread },
                { value: "read", label: "Read", count: trials.length - unread },
              ]}
            />
          </div>
        }
        rowClassName={(t) =>
          [
            t.status === "flagged" && "bg-bad-soft hover:bg-bad-soft",
            !t.read && "[&>td:first-child]:shadow-[inset_2px_0_0_var(--clay)]",
          ]
            .filter(Boolean)
            .join(" ")
        }
        empty={{ title: "No trial requests yet", description: "Requests from the free-trial form will land here." }}
      />

      {modal?.kind === "details" && current && (
        <TrialDetailsDialog
          trial={current}
          onClose={() => setModal(null)}
          onEmail={() => setModal({ kind: "email", id: current.id })}
          onConvert={() => setModal({ kind: "convert", id: current.id })}
          onSetStatus={(next) => patch(current, { status: next }, next === "declined" ? "Marked as declined" : "Reopened")}
        />
      )}

      {current && (
        <EmailDialog
          open={modal?.kind === "email"}
          onOpenChange={(open) => !open && setModal(null)}
          to={current.email}
          name={current.name || current.email}
          draft={trialDraft(current)}
          onSend={(email, onError) =>
            mutate(() => apiFetch<Trial>(API.admin.trialEmail(current.id), { method: "POST", body: email }), {
              onError,
              success: (
                <span>
                  Email sent to <b>{current.email}</b>
                </span>
              ),
            })
          }
        />
      )}

      {current && (
        <FlagDialog
          open={modal?.kind === "flag"}
          onOpenChange={(open) => !open && setModal(null)}
          title="Flag this requester"
          sub={`${current.name || current.email} · ${current.email}`}
          okLabel="Flag requester"
          reasons={TRIAL_FLAG_REASONS}
          onFlag={(reason) =>
            patch(current, { status: "flagged", flagReason: reason }, <span>Flagged <b>{who(current)}</b></span>)
          }
        />
      )}

      {modal?.kind === "convert" && current && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setModal(null)}
          title={`Add ${who(current)} to your clients?`}
          description="They will be moved into your Client list, where you can log work, record payments and track what they owe. The trial stays on this page, marked as converted."
          confirmLabel="Yes, add to clients"
          destructive={false}
          note={current.status === "flagged" ? `Heads up — this requester is flagged: “${current.flagReason}”` : undefined}
          onConfirm={async () => {
            const ok = await mutate(() => apiFetch(API.admin.trialConvert(current.id), { method: "POST" }), {
              success: (
                <span>
                  <b>{who(current)}</b> added to Clients
                </span>
              ),
            })
            if (ok) setModal(null)
          }}
        />
      )}
    </>
  )
}
