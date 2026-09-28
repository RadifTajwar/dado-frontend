"use client"

import { MiniLabel, Notice } from "@/components/admin/facts"
import { Initials } from "@/components/admin/person-cell"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDate, timeAgo } from "@/lib/format"
import type { Contact } from "@/lib/types"

export function ContactDetailsDialog({
  contact: c,
  onClose,
  onReply,
  onFlag,
  onArchive,
}: {
  contact: Contact
  onClose: () => void
  onReply: () => void
  onFlag: () => void
  onArchive: () => void
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="flex-row items-start gap-3.5 pr-8">
          <Initials name={c.name} className="size-10" />
          <div className="min-w-0">
            <DialogTitle className="font-serif text-[1.3rem] font-normal">{c.name}</DialogTitle>
            <DialogDescription>
              <a href={`mailto:${encodeURIComponent(c.email)}`} className="border-b border-input">
                {c.email}
              </a>{" "}
              · {formatDate(c.createdAt)}
              {c.phone && ` · ${c.phone}`}
            </DialogDescription>
          </div>
        </DialogHeader>

        {c.status === "flagged" && (
          <Notice>
            <strong>Flagged</strong>
            <br />
            {c.flagReason}
          </Notice>
        )}

        <div>
          <MiniLabel>Asking about</MiniLabel>
          <p>{c.service || "—"}</p>
        </div>
        <div>
          <MiniLabel>Message</MiniLabel>
          <p className="leading-relaxed whitespace-pre-line text-muted-foreground">{c.message}</p>
        </div>
        {c.lastEmailedAt && (
          <p className="text-[0.8rem] text-muted-foreground">You emailed this sender {timeAgo(c.lastEmailedAt)}.</p>
        )}

        <DialogFooter>
          {c.status !== "flagged" && (
            <Button type="button" variant="destructive" onClick={onFlag}>
              Flag sender
            </Button>
          )}
          {c.status !== "archived" && (
            <Button type="button" variant="outline" onClick={onArchive}>
              Archive
            </Button>
          )}
          <Button type="button" variant="clay" onClick={onReply}>
            Reply by email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
