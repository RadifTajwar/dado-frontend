/* Form rules for the browser (instant feedback). The Go API checks the same
   rules again — never trust the browser alone. Keep limits and wording in sync
   with backend/internal/handlers (validate.go and the resource files). */

import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { z } from "zod"

import { ApiError } from "@/lib/api/client"
import { isSafeUrl } from "@/lib/format"

/* The domain is letters, digits, dots and hyphens only, so an address can't
   smuggle "?bcc=…" into a mailto: link or a mail header. Mirrored in the Go API. */
const EMAIL = /^[^\s@]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i

/** Cloud hosts we accept for trial files, matched against the URL's hostname. Mirrored in the Go API. */
export const CLOUD_HOSTS =
  /(^|\.)(drive\.google\.com|docs\.google\.com|dropbox\.com|dropboxusercontent\.com|wetransfer\.com|we\.tl|onedrive\.live\.com|1drv\.ms|sharepoint\.com|icloud\.com|box\.com|mega\.nz|mega\.io|amazonaws\.com|frame\.io|f\.io|pcloud\.com|pcloud\.link|sync\.com|terabox\.com|mediafire\.com)$/i

/* ---------- shared rules (public forms and admin dialogs) ---------- */

export const required = (label: string, max: number, message = `${label} is required.`) =>
  z.string().trim().min(1, message).max(max, `${label} is too long.`)

export const optional = (label: string, max: number) => z.string().trim().max(max, `${label} is too long.`)

export const email = (label: string) => required(label, 254).regex(EMAIL, "Enter a valid email address.")

export const optionalPhone = z
  .string()
  .trim()
  .max(40, "That phone number is too long.")
  .refine((v) => v === "" || v.replace(/\D/g, "").length >= 7, "Enter a valid phone number.")

const detail = (label: string) =>
  required(label, 5000).refine((v) => v.length >= 10, "Please add a little more detail.")

/** Empty, or an http(s) link. */
export const optionalLink = optional("Link", 2000).refine(
  (v) => v === "" || isSafeUrl(v),
  "Link must start with http:// or https://",
)

export const cloudLink = required("File link", 2000).superRefine((v, ctx) => {
  let url: URL
  try {
    url = new URL(v)
  } catch {
    ctx.addIssue({ code: "custom", message: "Paste a full link starting with https://" })
    return
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    ctx.addIssue({ code: "custom", message: "Link must start with http:// or https://" })
  } else if (!CLOUD_HOSTS.test(url.hostname)) {
    ctx.addIssue({
      code: "custom",
      message:
        "That does not look like a shared cloud link. Drive, Dropbox, WeTransfer, OneDrive and similar are accepted.",
    })
  }
})

/* ---------- public forms ---------- */

export const contactSchema = z.object({
  name: required("Your name", 100),
  email: email("Email address"),
  phone: optionalPhone,
  service: optional("Service", 120),
  message: detail("Message"),
  website: z.string().optional(), // honeypot, never shown to people
})
export type ContactValues = z.infer<typeof contactSchema>

export const trialSchema = z.object({
  name: required("Full name", 100),
  email: email("Work email"),
  company: optional("Company", 120),
  phone: optionalPhone,
  services: z.array(z.enum(["photo", "video", "voice"])).min(1, "Pick at least one service."),
  link: cloudLink,
  volume: optional("Volume", 60),
  deadline: optional("Deadline", 80),
  brief: detail("The brief"),
  nda: z.boolean(),
  website: z.string().optional(),
})
export type TrialValues = z.infer<typeof trialSchema>

/* ---------- admin auth ---------- */

export const loginSchema = z.object({
  email: email("Email"),
  password: z.string().min(1, "Password is required."),
})
export type LoginValues = z.infer<typeof loginSchema>

export const forgotSchema = z.object({ email: email("Email") })
export type ForgotValues = z.infer<typeof forgotSchema>

export const resetSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters.").max(128, "That password is too long."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "The passwords do not match.", path: ["confirm"] })
export type ResetValues = z.infer<typeof resetSchema>

/* ---------- server errors ---------- */

/**
 * Puts the API's per-field messages ({ fields }) on the form and focuses the
 * first one. Returns a message for the whole form when there were none.
 */
export function applyServerErrors<T extends FieldValues>(err: unknown, setError: UseFormSetError<T>): string {
  const fields = err instanceof ApiError ? Object.entries(err.fields) : []
  fields.forEach(([name, message], i) => setError(name as Path<T>, { message }, { shouldFocus: i === 0 }))
  if (fields.length) return ""
  return err instanceof ApiError ? err.message : "Something went wrong. Please try again."
}
