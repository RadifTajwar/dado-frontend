"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"

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
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cents } from "@/lib/admin/finance"
import { DISCIPLINE_LABEL, JOB_STATUS } from "@/lib/admin/labels"
import { jobSchema, type JobValues } from "@/lib/admin/schemas"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { today } from "@/lib/format"
import { DISCIPLINE_ORDER } from "@/lib/site"
import { applyServerErrors } from "@/lib/validation"
import type { Client, Job, JobInput, JobStatus, Service } from "@/lib/types"

/* Log a piece of work for a client. The amount is suggested from rate × qty,
   but a number typed by hand is never overwritten. */
export function AddWorkDialog({ client, services, onDone }: { client: Client; services: Service[]; onDone: () => void }) {
  const mutate = useMutation()
  const active = services.filter((s) => s.active)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      serviceId: "",
      details: "",
      link: "",
      qty: "1",
      amount: "",
      date: today(),
      paid: "0",
      status: "delivered",
    },
  })
  const [serviceId, qty] = useWatch({ control, name: ["serviceId", "qty"] })
  const selected = active.find((s) => s.id === serviceId)
  const count = Math.max(1, Number(qty) || 1)

  function suggestAmount() {
    const service = active.find((s) => s.id === getValues("serviceId"))
    if (!service || dirtyFields.amount) return
    setValue("amount", (service.rate * Math.max(1, Number(getValues("qty")) || 1)).toFixed(2))
  }

  async function save(v: JobValues) {
    const body: JobInput = {
      clientId: client.id,
      serviceId: v.serviceId,
      date: v.date,
      qty: Number(v.qty),
      amount: cents(Number(v.amount)),
      paid: cents(Number(v.paid)),
      status: v.status,
      details: v.details,
      link: v.link,
    }
    const ok = await mutate(() => apiFetch<Job>(API.admin.jobs, { method: "POST", body }), {
      success: (
        <span>
          Work added for <b>{client.company || client.name}</b>
        </span>
      ),
      onError: (err) => applyServerErrors(err, setError),
    })
    if (ok) onDone()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onDone()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-[1.3rem] font-normal">Add work</DialogTitle>
          <DialogDescription>for {client.company || client.name}</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(save)} className="grid gap-4">
          <FormField
            id="w-svc"
            label="1 · Service"
            required
            error={errors.serviceId?.message}
            hint={
              selected
                ? `$${selected.rate.toFixed(2)} per ${selected.unit} × ${count} = $${(selected.rate * count).toFixed(2)} — edit the amount if you agreed a different price.`
                : "Only services marked active on the Services page appear here."
            }
          >
            {(control) => (
              <NativeSelect
                {...control}
                className="w-full"
                {...register("serviceId", { onChange: suggestAmount })}
              >
                <NativeSelectOption value="">Choose a service…</NativeSelectOption>
                {DISCIPLINE_ORDER.map((d) => {
                  const list = active.filter((s) => s.discipline === d)
                  return list.length ? (
                    <NativeSelectOptGroup key={d} label={DISCIPLINE_LABEL[d]}>
                      {list.map((s) => (
                        <NativeSelectOption key={s.id} value={s.id}>
                          {s.name} — ${s.rate.toFixed(2)}/{s.unit}
                        </NativeSelectOption>
                      ))}
                    </NativeSelectOptGroup>
                  ) : null
                })}
              </NativeSelect>
            )}
          </FormField>

          <FormField id="w-det" label="2 · Details" error={errors.details?.message}>
            {(control) => (
              <Textarea
                {...control}
                placeholder="e.g. 420 SS27 shots, pure white, natural shadow, 2000px square JPG named by SKU."
                {...register("details")}
              />
            )}
          </FormField>

          <FormField
            id="w-link"
            label="3 · File link"
            error={errors.link?.message}
            hint="Where the client put the files — Drive, Dropbox, WeTransfer, OneDrive, Frame.io."
          >
            {(control) => (
              <Input
                {...control}
                type="url"
                inputMode="url"
                spellCheck={false}
                placeholder="https://drive.google.com/drive/folders/…"
                {...register("link")}
              />
            )}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="w-qty" label="Quantity" error={errors.qty?.message}>
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  min={1}
                  step={1}
                  {...register("qty", { onChange: suggestAmount })}
                />
              )}
            </FormField>
            <FormField id="w-amt" label="4 · Charging" required error={errors.amount?.message}>
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  {...register("amount")}
                />
              )}
            </FormField>
            <FormField id="w-date" label="Date" error={errors.date?.message}>
              {(control) => <Input {...control} type="date" {...register("date")} />}
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="w-paid" label="Paid so far" error={errors.paid?.message}>
              {(control) => <Input {...control} type="number" min={0} step={0.01} {...register("paid")} />}
            </FormField>
            <FormField id="w-st" label="Status">
              {(control) => (
                <NativeSelect {...control} className="w-full" {...register("status")}>
                  {(Object.keys(JOB_STATUS) as JobStatus[]).map((s) => (
                    <NativeSelectOption key={s} value={s}>
                      {JOB_STATUS[s].label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </FormField>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="clay" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              Add work
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
