"use client"

import { Facts, MiniLabel, Notice } from "@/components/admin/facts"
import { FileLink, Initials } from "@/components/admin/person-cell"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TRIAL_STATUS } from "@/lib/admin/labels"
import { formatDate, timeAgo } from "@/lib/format"
import { DISCIPLINES } from "@/lib/site"
import type { Trial } from "@/lib/types"

export function TrialDetailsDialog({
  trial: t,
  onClose,
  onEmail,
  onConvert,
  onSetStatus,
}: {
  trial: Trial
  onClose: () => void
  onEmail: () => void
  onConvert: () => void
  onSetStatus: (status: "new" | "declined") => void
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="flex-row items-start gap-3.5 pr-8">
          <Initials name={t.name || t.email} className="size-10" />
          <div className="min-w-0">
            <DialogTitle className="font-serif text-[1.3rem] font-normal">{t.company || t.name}</DialogTitle>
            <DialogDescription>
              {t.name} ·{" "}
              <a href={`mailto:${encodeURIComponent(t.email)}`} className="border-b border-input">
                {t.email}
              </a>
              {t.phone && ` · ${t.phone}`}
            </DialogDescription>
          </div>
        </DialogHeader>

        {t.status === "flagged" && (
          <Notice>
            <strong>Flagged</strong>
            <br />
            {t.flagReason}
          </Notice>
        )}

        <Facts
          small
          items={[
            { label: "Received", value: formatDate(t.createdAt) },
            { label: "Batch size", value: t.volume || "—" },
            { label: "NDA", value: t.nda ? "Requested" : "Not requested" },
            { label: "Status", value: TRIAL_STATUS[t.status].label },
            { label: "Last emailed", value: t.lastEmailedAt ? timeAgo(t.lastEmailedAt) : "Never" },
          ]}
        />

        <div>
          <MiniLabel>Services requested</MiniLabel>
          <div className="flex flex-wrap gap-1.5">
            {t.services.map((d) => (
              <StatusBadge key={d}>{DISCIPLINES[d].label}</StatusBadge>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <MiniLabel>Files</MiniLabel>
          <FileLink url={t.link} />
          <p className="mt-1.5 text-[0.78rem] break-all text-muted-foreground">{t.link}</p>
        </div>

        <div>
          <MiniLabel>Brief</MiniLabel>
          <p className="whitespace-pre-line text-muted-foreground">{t.brief}</p>
        </div>

        <div>
          <MiniLabel>Turnaround wanted</MiniLabel>
          <p className="text-muted-foreground">{t.deadline || "—"}</p>
        </div>

        <DialogFooter>
          {t.status === "new" && (
            <Button type="button" variant="ghost" onClick={() => onSetStatus("declined")}>
              Decline
            </Button>
          )}
          {t.status === "declined" && (
            <Button type="button" variant="ghost" onClick={() => onSetStatus("new")}>
              Reopen
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onEmail}>
            Send email
          </Button>
          {t.status !== "converted" && (
            <Button type="button" variant="clay" onClick={onConvert}>
              + Add to clients
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
