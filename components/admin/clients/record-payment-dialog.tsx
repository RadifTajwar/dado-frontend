"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useMutation } from "@/components/admin/use-mutation"
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
import { cents } from "@/lib/admin/finance"
import { paymentSchema, type PaymentValues } from "@/lib/admin/schemas"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { formatDate, money } from "@/lib/format"
import type { Job } from "@/lib/types"

/* Adds a received amount to a job's "paid", never beyond what is owed. */
export function RecordPaymentDialog({ job, serviceName, onDone }: { job: Job; serviceName: string; onDone: () => void }) {
  const mutate = useMutation()
  const due = cents(job.amount - job.paid)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentValues>({ resolver: zodResolver(paymentSchema(due)), defaultValues: { amount: due.toFixed(2) } })

  async function save({ amount }: PaymentValues) {
    const received = cents(Number(amount))
    const ok = await mutate(
      () => apiFetch<Job>(API.admin.job(job.id), { method: "PATCH", body: { paid: cents(job.paid + received) } }),
      {
        success: (
          <span>
            Recorded <b>{money(received)}</b>
          </span>
        ),
      },
    )
    if (ok) onDone()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onDone()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-[1.3rem] font-normal">Record a payment</DialogTitle>
          <DialogDescription>
            {serviceName} · {formatDate(job.date)} · {money(due)} outstanding
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(save)} className="grid gap-4">
          <FormField
            id="p-amt"
            label="Amount received"
            error={errors.amount?.message}
            hint={`Charged ${money(job.amount)} · already received ${money(job.paid)}`}
          >
            {(control) => (
              <Input
                {...control}
                type="number"
                min={0.01}
                step={0.01}
                max={due}
                autoFocus
                {...register("amount")}
              />
            )}
          </FormField>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="clay" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
