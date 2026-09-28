"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, type Control } from "react-hook-form"

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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { cents } from "@/lib/admin/finance"
import { DISCIPLINE_LABEL, SERVICE_UNITS } from "@/lib/admin/labels"
import { serviceSchema, type ServiceValues } from "@/lib/admin/schemas"
import { apiFetch } from "@/lib/api/client"
import { API, PUBLIC_TAGS } from "@/lib/api/endpoints"
import { DISCIPLINE_ORDER } from "@/lib/site"
import { applyServerErrors } from "@/lib/validation"
import type { Service, ServiceInput } from "@/lib/types"

/* Create or edit one line of the public price list. */
export function ServiceDialog({
  service,
  services,
  onDone,
}: {
  service?: Service
  services: Service[] // for group suggestions and the next sort order
  onDone: () => void
}) {
  const mutate = useMutation()
  const groups = [...new Set(services.map((s) => s.group))]
  const units = service && !SERVICE_UNITS.includes(service.unit) ? [service.unit, ...SERVICE_UNITS] : SERVICE_UNITS
  const nextOrder = Math.max(0, ...services.filter((s) => s.discipline === "photo").map((s) => s.order)) + 1

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          discipline: service.discipline,
          group: service.group,
          use: service.use,
          rate: String(service.rate),
          unit: service.unit,
          turnaround: service.turnaround,
          order: String(service.order),
          featured: service.featured,
          active: service.active,
        }
      : {
          name: "",
          discipline: "photo",
          group: groups[0] ?? "",
          use: "",
          rate: "",
          unit: "image",
          turnaround: "24 hours",
          order: String(nextOrder),
          featured: false,
          active: true,
        },
  })

  async function save(v: ServiceValues) {
    const body: ServiceInput = { ...v, rate: cents(Number(v.rate)), order: Number(v.order) }
    const ok = await mutate(
      () =>
        apiFetch<Service>(service ? API.admin.service(service.id) : API.admin.services, {
          method: service ? "PUT" : "POST",
          body,
        }),
      {
        success: service ? "Service updated" : "Service created",
        publicTags: [PUBLIC_TAGS.services],
        onError: (err) => applyServerErrors(err, setError),
      },
    )
    if (ok) onDone()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onDone()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-[1.3rem] font-normal">{service ? "Edit service" : "New service"}</DialogTitle>
          <DialogDescription>{service ? service.name : "It appears on the public price list once active."}</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(save)} className="grid gap-4">
          <FormField id="s-name" label="Name" required error={errors.name?.message}>
            {(control) => <Input {...control} placeholder="e.g. Ghost mannequin (full)" {...register("name")} />}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="s-disc" label="Discipline">
              {(control) => (
                <NativeSelect {...control} className="w-full" {...register("discipline")}>
                  {DISCIPLINE_ORDER.map((d) => (
                    <NativeSelectOption key={d} value={d}>
                      {DISCIPLINE_LABEL[d]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </FormField>
            <FormField
              id="s-group"
              label="Price table"
              required
              error={errors.group?.message}
              hint="The table it is listed under on the Services page."
            >
              {(control) => (
                <>
                  <Input {...control} list="s-groups" {...register("group")} />
                  <datalist id="s-groups">
                    {groups.map((g) => (
                      <option key={g} value={g} />
                    ))}
                  </datalist>
                </>
              )}
            </FormField>
          </div>

          <FormField id="s-use" label="Typical use" error={errors.use?.message}>
            {(control) => <Input {...control} placeholder="e.g. Apparel on white" {...register("use")} />}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="s-rate" label="Rate (USD)" required error={errors.rate?.message}>
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  {...register("rate")}
                />
              )}
            </FormField>
            <FormField id="s-unit" label="Per" error={errors.unit?.message}>
              {(control) => (
                <NativeSelect {...control} className="w-full" {...register("unit")}>
                  {units.map((u) => (
                    <NativeSelectOption key={u} value={u}>
                      {u}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            </FormField>
            <FormField id="s-turn" label="Turnaround" error={errors.turnaround?.message}>
              {(control) => <Input {...control} placeholder="24 hours" {...register("turnaround")} />}
            </FormField>
          </div>

          <FormField id="s-order" label="Sort order" error={errors.order?.message} hint="Lower numbers are listed first.">
            {(control) => <Input {...control} type="number" min={0} step={1} className="sm:max-w-40" {...register("order")} />}
          </FormField>

          <div className="grid gap-3 rounded-md border p-3.5">
            <SwitchRow control={control} name="active" label="Active — show on the public price list and in Add work" />
            <SwitchRow control={control} name="featured" label="Featured — list it in the home page “most-ordered” table" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="clay" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {service ? "Save changes" : "Create service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SwitchRow({ control, name, label }: { control: Control<ServiceValues>; name: "active" | "featured"; label: string }) {
  const id = `s-${name}`
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-[0.86rem]">
          <Switch id={id} checked={field.value} onCheckedChange={field.onChange} />
          {label}
        </label>
      )}
    />
  )
}
