"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { emailSchema, type EmailValues } from "@/lib/admin/schemas"
import type { ApiError } from "@/lib/api/client"
import { applyServerErrors } from "@/lib/validation"

/* Compose an email to a lead. "Send email" goes out through the API (branded
   template, logged on the record). "Open in mail app" hands the same text to
   the computer's mail client as a fallback. */
export function EmailDialog({
  open,
  onOpenChange,
  to,
  name,
  draft,
  onSend,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  to: string
  name: string
  draft: EmailValues
  onSend: (email: EmailValues, onError: (err: ApiError) => void) => Promise<boolean>
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-[1.3rem] font-normal">New email</DialogTitle>
          <DialogDescription>
            to {name} &lt;{to}&gt;
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so every open starts from the draft. */}
        {open && <EmailForm to={to} draft={draft} onSend={onSend} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function EmailForm({
  to,
  draft,
  onSend,
  onDone,
}: {
  to: string
  draft: EmailValues
  onSend: (email: EmailValues, onError: (err: ApiError) => void) => Promise<boolean>
  onDone: () => void
}) {
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({ resolver: zodResolver(emailSchema), defaultValues: draft })

  async function openMailApp() {
    if (!(await trigger())) return
    const { subject, body } = getValues()
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`
  }

  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={handleSubmit(async (values) => {
        if (await onSend(values, (err) => applyServerErrors(err, setError))) onDone()
      })}
    >
      <FormField id="e-to" label="To">
        {(control) => <Input {...control} type="email" value={to} readOnly className="bg-muted text-muted-foreground" />}
      </FormField>
      <FormField id="e-sub" label="Subject" required error={errors.subject?.message}>
        {(control) => <Input {...control} placeholder="What is this about?" {...register("subject")} />}
      </FormField>
      <FormField
        id="e-body"
        label="Message"
        required
        error={errors.body?.message}
        hint="Edit freely — the draft above is only a starting point."
      >
        {(control) => <Textarea {...control} className="min-h-56" {...register("body")} />}
      </FormField>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="button" variant="outline" onClick={openMailApp}>
          Open in mail app
        </Button>
        <Button type="submit" variant="clay" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          Send email
        </Button>
      </DialogFooter>
    </form>
  )
}
