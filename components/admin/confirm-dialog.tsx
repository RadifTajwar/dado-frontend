"use client"

import { useState } from "react"

import { Notice } from "@/components/admin/facts"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

/* "Are you sure?" before anything destructive or hard to undo. It stays open
   (and busy) while `onConfirm` runs; the caller closes it, or moves on to
   whatever comes next, when the action succeeds. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  destructive = true,
  note,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  confirmLabel?: string
  destructive?: boolean
  note?: React.ReactNode
  onConfirm: () => Promise<unknown>
}) {
  const [pending, setPending] = useState(false)

  async function confirm(e: React.MouseEvent) {
    e.preventDefault() // keep Radix from closing before the request finishes
    setPending(true)
    try {
      await onConfirm()
    } finally {
      setPending(false) // never leave the dialog stuck busy, even if onConfirm throws
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-[1.3rem] font-normal tracking-[-0.01em]">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {note && <Notice>{note}</Notice>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={destructive ? "destructive" : "default"} disabled={pending} onClick={confirm}>
            {pending && <Spinner />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
