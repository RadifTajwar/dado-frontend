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
import { Textarea } from "@/components/ui/textarea"
import { clientSchema, type ClientValues } from "@/lib/admin/schemas"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { applyServerErrors } from "@/lib/validation"
import type { Client, ClientInput } from "@/lib/types"

/* Add a client who never went through a trial, or fix an existing one's details. */
export function ClientFormDialog({ client, onDone }: { client?: Client; onDone: () => void }) {
  const mutate = useMutation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name ?? "",
      company: client?.company ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      country: client?.country === "—" ? "" : (client?.country ?? ""),
      notes: client?.notes ?? "",
    },
  })

  async function save(values: ClientValues) {
    const body: ClientInput = client ? { ...values, since: client.since, source: client.source } : { ...values, source: "direct" }
    const ok = await mutate(
      () => apiFetch<Client>(client ? API.admin.client(client.id) : API.admin.clients, { method: client ? "PUT" : "POST", body }),
      { success: client ? "Client updated" : "Client added", onError: (err) => applyServerErrors(err, setError) },
    )
    if (ok) onDone()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onDone()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-[1.3rem] font-normal">{client ? "Edit client" : "New client"}</DialogTitle>
          <DialogDescription>
            {client ? client.company || client.name : "For clients who never went through a trial"}
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(save)} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="n-name" label="Contact name" required error={errors.name?.message}>
              {(control) => <Input {...control} placeholder="Jordan Ali" {...register("name")} />}
            </FormField>
            <FormField id="n-co" label="Company" error={errors.company?.message}>
              {(control) => <Input {...control} placeholder="Brand Ltd" {...register("company")} />}
            </FormField>
            <FormField id="n-em" label="Email" required error={errors.email?.message}>
              {(control) => <Input {...control} type="email" placeholder="jordan@brand.com" {...register("email")} />}
            </FormField>
            <FormField id="n-ph" label="Phone" error={errors.phone?.message}>
              {(control) => <Input {...control} type="tel" placeholder="Optional" {...register("phone")} />}
            </FormField>
            <FormField id="n-country" label="Country" error={errors.country?.message}>
              {(control) => <Input {...control} placeholder="United Kingdom" {...register("country")} />}
            </FormField>
          </div>
          <FormField id="n-notes" label="Notes" error={errors.notes?.message}>
            {(control) => <Textarea {...control} placeholder="Anything worth remembering about this client" {...register("notes")} />}
          </FormField>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="clay" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {client ? "Save changes" : "Add client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
