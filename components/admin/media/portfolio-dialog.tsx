"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { ImageField } from "@/components/admin/image-field"
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
import { Switch } from "@/components/ui/switch"
import { portfolioSchema, type PortfolioValues } from "@/lib/admin/schemas"
import { apiFetch } from "@/lib/api/client"
import { API, PUBLIC_TAGS } from "@/lib/api/endpoints"
import { applyServerErrors } from "@/lib/validation"
import type { PortfolioInput, PortfolioItem } from "@/lib/types"

/* Add or edit a before/after pair for the "Recent work" sliders. */
export function PortfolioDialog({ item, nextOrder, onDone }: { item?: PortfolioItem; nextOrder: number; onDone: () => void }) {
  const mutate = useMutation()
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: item?.title ?? "",
      label: item?.label ?? "Photo",
      alt: item?.alt ?? "",
      beforeUrl: item?.beforeUrl ?? "",
      afterUrl: item?.afterUrl ?? "",
      order: String(item?.order ?? nextOrder),
      active: item?.active ?? true,
    },
  })

  async function save(v: PortfolioValues) {
    const body: PortfolioInput = { ...v, order: Number(v.order) }
    const ok = await mutate(
      () =>
        apiFetch<PortfolioItem>(item ? API.admin.portfolioItem(item.id) : API.admin.portfolio, {
          method: item ? "PUT" : "POST",
          body,
        }),
      {
        success: item ? "Pair updated" : "Pair added",
        publicTags: [PUBLIC_TAGS.portfolio],
        onError: (err) => applyServerErrors(err, setError),
      },
    )
    if (ok) onDone()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onDone()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-[1.3rem] font-normal">{item ? "Edit pair" : "New before / after pair"}</DialogTitle>
          <DialogDescription>Upload the untouched file as “before” and the delivered file as “after”.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(save)} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="pf-title" label="Title" required error={errors.title?.message}>
              {(control) => <Input {...control} placeholder="Model & skin retouch" {...register("title")} />}
            </FormField>
            <FormField id="pf-label" label="Label" required error={errors.label?.message} hint="e.g. Photo, Video frame">
              {(control) => <Input {...control} {...register("label")} />}
            </FormField>
          </div>
          <FormField
            id="pf-alt"
            label="Alt text"
            required
            error={errors.alt?.message}
            hint="Describe the subject. “before” / “after” is added automatically."
          >
            {(control) => <Input {...control} placeholder="Portrait of a model against a grey backdrop" {...register("alt")} />}
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="pf-before" label="Before" required error={errors.beforeUrl?.message}>
              {(input) => (
                <Controller
                  control={control}
                  name="beforeUrl"
                  render={({ field }) => (
                    <ImageField {...input} value={field.value} onChange={field.onChange} />
                  )}
                />
              )}
            </FormField>
            <FormField id="pf-after" label="After" required error={errors.afterUrl?.message}>
              {(input) => (
                <Controller
                  control={control}
                  name="afterUrl"
                  render={({ field }) => (
                    <ImageField {...input} value={field.value} onChange={field.onChange} />
                  )}
                />
              )}
            </FormField>
          </div>
          <div className="flex flex-wrap items-end gap-6">
            <FormField id="pf-order" label="Sort order" error={errors.order?.message} className="w-40">
              {(control) => <Input {...control} type="number" min={0} step={1} {...register("order")} />}
            </FormField>
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <label htmlFor="pf-active" className="flex h-9 cursor-pointer items-center gap-3 text-[0.86rem]">
                  <Switch id="pf-active" checked={field.value} onCheckedChange={field.onChange} />
                  Show on the home page
                </label>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="clay" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {item ? "Save changes" : "Add pair"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
