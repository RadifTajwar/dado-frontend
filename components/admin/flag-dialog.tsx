"use client"

import { useState } from "react"

import { FormField } from "@/components/shared/form-field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"

const OTHER = "__other__"

/* Mark a lead as unreachable, with a reason the next person can read.
   Shared by Trials and Contacts; only the preset reasons differ. */
export function FlagDialog({
  open,
  onOpenChange,
  title,
  sub,
  reasons,
  okLabel = "Flag",
  onFlag,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  sub: string
  reasons: string[]
  okLabel?: string
  onFlag: (reason: string) => Promise<boolean>
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-[1.3rem] font-normal">{title}</DialogTitle>
          <DialogDescription>{sub}</DialogDescription>
        </DialogHeader>
        {open && <FlagForm reasons={reasons} okLabel={okLabel} onFlag={onFlag} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function FlagForm({
  reasons,
  okLabel,
  onFlag,
  onDone,
}: {
  reasons: string[]
  okLabel: string
  onFlag: (reason: string) => Promise<boolean>
  onDone: () => void
}) {
  const [choice, setChoice] = useState(reasons[0] ?? OTHER)
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const reason = choice === OTHER ? note.trim() : choice
    if (!reason) {
      setError("Give a reason so the next person knows.")
      return
    }
    setPending(true)
    const ok = await onFlag(reason)
    setPending(false)
    if (ok) onDone()
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-5">
      <FormField id="flag-why" label="Reason">
        {(control) => (
          <NativeSelect {...control} className="w-full" value={choice} onChange={(e) => setChoice(e.target.value)}>
            {reasons.map((r) => (
              <NativeSelectOption key={r} value={r}>
                {r}
              </NativeSelectOption>
            ))}
            <NativeSelectOption value={OTHER}>Something else…</NativeSelectOption>
          </NativeSelect>
        )}
      </FormField>
      {choice === OTHER && (
        <FormField id="flag-note" label="Your note" error={error}>
          {(control) => (
            <Input
              {...control}
              autoFocus
              value={note}
              maxLength={300}
              placeholder="Why can this lead not be contacted?"
              onChange={(e) => {
                setNote(e.target.value)
                setError("")
              }}
            />
          )}
        </FormField>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" variant="destructive" disabled={pending}>
          {pending && <Spinner />}
          {okLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
