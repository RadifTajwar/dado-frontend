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
import { mediaSchema, type MediaValues } from "@/lib/admin/schemas"
import { apiFetch } from "@/lib/api/client"
import { API, PUBLIC_TAGS } from "@/lib/api/endpoints"
import { applyServerErrors } from "@/lib/validation"
import type { MediaImage, MediaSlot } from "@/lib/types"

/* Replace one of the fixed images on the public site. */
export function MediaDialog({
  slot,
  label,
  aspect,
  image,
  onDone,
}: {
  slot: MediaSlot
  label: string
  aspect: string
  image?: MediaImage
  onDone: () => void
}) {
  const mutate = useMutation()
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MediaValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: { url: image?.url ?? "", alt: image?.alt ?? "" },
  })

  async function save(values: MediaValues) {
    const ok = await mutate(() => apiFetch<MediaImage>(API.admin.media(slot), { method: "PUT", body: values }), {
      success: `${label} image updated`,
      publicTags: [PUBLIC_TAGS.media],
      onError: (err) => applyServerErrors(err, setError),
    })
    if (ok) onDone()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onDone()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-[1.3rem] font-normal">{label} image</DialogTitle>
          <DialogDescription>Shown on the public site as soon as you save.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(save)} className="grid gap-4">
          <FormField id="m-url" label="Image" required error={errors.url?.message}>
            {(input) => (
              <Controller
                control={control}
                name="url"
                render={({ field }) => (
                  <ImageField {...input} value={field.value} onChange={field.onChange} aspect={aspect} />
                )}
              />
            )}
          </FormField>
          <FormField
            id="m-alt"
            label="Alt text"
            required
            error={errors.alt?.message}
            hint="What the picture shows, for screen readers and search engines."
          >
            {(control) => <Input {...control} {...register("alt")} />}
          </FormField>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="clay" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              Save image
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
