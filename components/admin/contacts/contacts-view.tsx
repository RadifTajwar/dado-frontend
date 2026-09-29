"use client"

import { useState } from "react"

import { ContactDetailsDialog } from "@/components/admin/contacts/contact-details-dialog"
import { DataTable, type Column } from "@/components/admin/data-table"
import { EmailDialog } from "@/components/admin/email-dialog"
import { FlagDialog } from "@/components/admin/flag-dialog"
import { PersonCell } from "@/components/admin/person-cell"
import { Segmented } from "@/components/admin/segmented"
import { RowMenu } from "@/components/admin/row-menu"
import { StatusBadge } from "@/components/admin/status-badge"
import { useMutation } from "@/components/admin/use-mutation"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { contactDraft } from "@/lib/admin/drafts"
import { CONTACT_FLAG_REASONS, CONTACT_STATUS } from "@/lib/admin/labels"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { formatDate, timeAgo } from "@/lib/format"
import type { Contact, ContactStatus } from "@/lib/types"

type StatusFilter = "all" | ContactStatus
type ReadFilter = "all" | "unread" | "read"
type Patch = { status?: ContactStatus; flagReason?: string; read?: true }
type Modal = { kind: "details" | "email" | "flag"; id: string }

export function ContactsView({ contacts }: { contacts: Contact[] }) {
  const mutate = useMutation()
  const [status, setStatus] = useState<StatusFilter>("all")
  const [read, setRead] = useState<ReadFilter>("all")
  const [modal, setModal] = useState<Modal | null>(null)

  const current = modal && contacts.find((c) => c.id === modal.id)
  const count = (s: ContactStatus) => contacts.filter((c) => c.status === s).length
  const unread = contacts.filter((c) => !c.read).length
  const rows = contacts.filter(
    (c) => (status === "all" || c.status === status) && (read === "all" || (read === "read") === c.read),
  )

  const patch = (c: Contact, body: Patch, success?: React.ReactNode) =>
    mutate(() => apiFetch<Contact>(API.admin.contact(c.id), { method: "PATCH", body }), { success })

  function openDetails(c: Contact) {
    setModal({ kind: "details", id: c.id })
    if (!c.read) patch(c, { read: true }) // opening a message counts as reading it
  }

  async function archive(c: Contact) {
    if (await patch(c, { status: "archived" }, "Message archived")) setModal(null)
  }

  const columns: Column<Contact>[] = [
    {
      id: "from",
      header: "From",
      sortValue: (c) => c.name,
      cell: (c) => <PersonCell name={c.name} title={c.name} sub={c.email} unread={!c.read} />,
    },
    {
      id: "about",
      header: "About",
      sortValue: (c) => c.service,
      cell: (c) => <span className="block max-w-44 truncate">{c.service || "—"}</span>,
    },
    {
      id: "message",
      header: "Message",
      // takes the room left over and truncates, so the row never gets wider than the table
      className: "w-full max-w-0",
      cell: (c) => (
        <span className="block truncate text-muted-foreground" title={c.message}>
          {c.message}
        </span>
      ),
    },
    {
      id: "received",
      header: "Received",
      sortValue: (c) => Date.parse(c.createdAt),
      cell: (c) => <span title={formatDate(c.createdAt)}>{timeAgo(c.createdAt)}</span>,
    },
    {
      id: "status",
      header: "Status",
      sortValue: (c) => c.status,
      cell: (c) => (
        <div className="grid justify-items-start gap-1">
          <StatusBadge tone={CONTACT_STATUS[c.status].tone} dot>
            {CONTACT_STATUS[c.status].label}
          </StatusBadge>
          {c.flagReason && (
            <span className="block max-w-40 truncate text-[0.72rem] text-bad" title={c.flagReason}>
              {c.flagReason}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-px whitespace-nowrap text-right", // shrink to the buttons, never squash them
      cell: (c) => (
        <div className="flex justify-end gap-1.5">
          {c.read ? (
            <StatusBadge tone="ok" className="self-center">
              <span title="Marked as read — this cannot be undone">✓ Read</span>
            </StatusBadge>
          ) : (
            <Button type="button" variant="ghost" size="sm" onClick={() => patch(c, { read: true }, "Marked as read")}>
              Read
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => openDetails(c)}>
            Details
          </Button>
          <RowMenu label={`More actions for ${c.name}`}>
            <DropdownMenuItem onSelect={() => setModal({ kind: "email", id: c.id })}>Email</DropdownMenuItem>
            {c.status !== "archived" && <DropdownMenuItem onSelect={() => archive(c)}>Archive</DropdownMenuItem>}
            {c.status === "flagged" ? (
              <DropdownMenuItem onSelect={() => patch(c, { status: "new" }, <span>Unflagged <b>{c.name}</b></span>)}>
                Unflag
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem variant="destructive" onSelect={() => setModal({ kind: "flag", id: c.id })}>
                Flag
              </DropdownMenuItem>
            )}
          </RowMenu>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(c) => c.id}
        searchText={(c) => `${c.name} ${c.email} ${c.service} ${c.message}`}
        searchLabel="Search sender, service or message…"
        filters={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Segmented
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All", count: contacts.length },
                { value: "new", label: "New", count: count("new") },
                { value: "replied", label: "Replied", count: count("replied") },
                { value: "flagged", label: "Flagged", count: count("flagged") },
                { value: "archived", label: "Archived", count: count("archived") },
              ]}
            />
            <Segmented
              label="Read"
              value={read}
              onChange={setRead}
              options={[
                { value: "all", label: "All" },
                { value: "unread", label: "Unread", count: unread },
                { value: "read", label: "Read", count: contacts.length - unread },
              ]}
            />
          </div>
        }
        rowClassName={(c) =>
          [
            c.status === "flagged" && "bg-bad-soft hover:bg-bad-soft",
            !c.read && "[&>td:first-child]:shadow-[inset_2px_0_0_var(--clay)]",
          ]
            .filter(Boolean)
            .join(" ")
        }
        empty={{ title: "No messages yet", description: "Messages from the contact form will land here." }}
      />

      {modal?.kind === "details" && current && (
        <ContactDetailsDialog
          contact={current}
          onClose={() => setModal(null)}
          onReply={() => setModal({ kind: "email", id: current.id })}
          onFlag={() => setModal({ kind: "flag", id: current.id })}
          onArchive={() => archive(current)}
        />
      )}

      {current && (
        <EmailDialog
          open={modal?.kind === "email"}
          onOpenChange={(open) => !open && setModal(null)}
          to={current.email}
          name={current.name}
          draft={contactDraft(current)}
          onSend={(email, onError) =>
            mutate(() => apiFetch<Contact>(API.admin.contactEmail(current.id), { method: "POST", body: email }), {
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
          title="Flag this sender"
          sub={`${current.name} · ${current.email}`}
          okLabel="Flag sender"
          reasons={CONTACT_FLAG_REASONS}
          onFlag={(reason) => patch(current, { status: "flagged", flagReason: reason }, <span>Flagged <b>{current.name}</b></span>)}
        />
      )}
    </>
  )
}
