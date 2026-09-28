"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon, UploadIcon } from "lucide-react"

import type { ControlProps } from "@/components/shared/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { isAllowedImageUrl, MAX_UPLOAD_BYTES, UPLOAD_TYPES } from "@/lib/admin/images"
import { apiFetch, ApiError } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import type { UploadResult } from "@/lib/types"
import { cn } from "@/lib/utils"

/* An image URL input with an upload button that fills it in. The URL is the
   value that gets saved; uploading is just the easy way to get one. */
export function ImageField({
  value,
  onChange,
  aspect = "aspect-[3/2]",
  ...control // id + aria wiring from <FormField>, for the URL input
}: ControlProps & {
  value: string
  onChange: (url: string) => void
  aspect?: string
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadsOff, setUploadsOff] = useState(false)
  const [error, setError] = useState("")

  async function upload(file: File) {
    setError("")
    if (!UPLOAD_TYPES.includes(file.type)) return setError("Upload a JPG, PNG, WebP, AVIF or GIF image.")
    if (file.size > MAX_UPLOAD_BYTES) return setError("Images must be 10 MB or smaller.")

    const formData = new FormData()
    formData.append("file", file)
    setUploading(true)
    try {
      const result = await apiFetch<UploadResult>(API.admin.uploads, { method: "POST", formData })
      onChange(result.url)
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) setUploadsOff(true)
      else setError(err instanceof ApiError ? (err.fields.file ?? err.message) : "The upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid gap-2.5">
      <div className={cn("relative overflow-hidden rounded-md border bg-muted", aspect)}>
        {isAllowedImageUrl(value) ? (
          <Image src={value} alt="" fill sizes="(max-width: 640px) 100vw, 420px" className="object-cover" />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <span className="flex items-center gap-2 text-[0.8rem]">
              <ImageIcon className="size-4" /> No image yet
            </span>
          </div>
        )}
      </div>

      {uploadsOff ? (
        <p className="rounded-md bg-clay-soft px-3 py-2 text-[0.8rem]">
          Uploads aren&apos;t set up yet. Paste an image URL instead.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            {uploading ? <Spinner /> : <UploadIcon />}
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          <span className="text-[0.78rem] text-muted-foreground">JPG, PNG, WebP, AVIF or GIF, up to 10 MB — or paste a link below.</span>
          <input
            ref={fileInput}
            type="file"
            accept={UPLOAD_TYPES.join(",")}
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = "" // allow picking the same file again
              if (file) upload(file)
            }}
          />
        </div>
      )}

      <Input
        {...control}
        type="url"
        inputMode="url"
        spellCheck={false}
        value={value}
        aria-invalid={control["aria-invalid"] || !!error || undefined}
        placeholder="https://res.cloudinary.com/… or https://images.unsplash.com/…"
        onChange={(e) => onChange(e.target.value.trim())}
      />
      {error && (
        <p role="alert" className="text-[0.78rem] font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
