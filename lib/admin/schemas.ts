/* Form rules for the admin dialogs. Number inputs stay strings in the form
   (that is what inputs give you) and are converted when the form is sent.
   Limits and wording match the Go API (backend/internal/handlers), which
   validates everything again. Shared rules come from lib/validation.ts. */

import { z } from "zod"

import { isAllowedImageUrl } from "@/lib/admin/images"
import { email, optional, optionalLink, optionalPhone, required } from "@/lib/validation"

const isNumber = (v: string) => v.trim() !== "" && Number.isFinite(Number(v))

const amount = (message: string) => z.string().refine((v) => isNumber(v) && Number(v) >= 0 && Number(v) <= 1_000_000, message)

const wholeNumber = (message: string) => z.string().refine((v) => isNumber(v) && Number.isInteger(Number(v)) && Number(v) >= 0, message)

const imageUrl = (which: string) =>
  z
    .string()
    .trim()
    .min(1, `Add the ${which}.`)
    .max(2000, "That image link is too long.")
    .refine(isAllowedImageUrl, "Upload an image, or use an https link on res.cloudinary.com or images.unsplash.com.")

/* ---------- clients & jobs ---------- */

export const clientSchema = z.object({
  name: required("Name", 100),
  company: optional("Company", 120),
  email: email("Email"),
  phone: optionalPhone,
  country: optional("Country", 60),
  notes: optional("Notes", 2000),
})
export type ClientValues = z.infer<typeof clientSchema>

export const jobSchema = z
  .object({
    serviceId: z.string().min(1, "Pick a service."),
    details: optional("Details", 2000),
    link: optionalLink,
    qty: z.string().refine((v) => isNumber(v) && Number.isInteger(Number(v)) && Number(v) >= 1, "Quantity must be at least 1."),
    amount: amount("Enter what you are charging."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date."),
    paid: amount("Enter an amount of $0 or more."),
    status: z.enum(["quoted", "in-progress", "delivered"]),
  })
  .refine((v) => Number(v.paid) <= Number(v.amount), {
    message: "Paid cannot exceed the amount charged.",
    path: ["paid"],
  })
export type JobValues = z.infer<typeof jobSchema>

/** A payment must be at least a cent and no more than what is still owed. */
export const paymentSchema = (due: number) =>
  z.object({
    amount: z
      .string()
      .refine((v) => isNumber(v) && Number(v) >= 0.01, "Enter an amount of at least $0.01.")
      .refine((v) => Number(v) <= due + 0.001, "That is more than what is outstanding."),
  })
export type PaymentValues = z.infer<ReturnType<typeof paymentSchema>>

/* ---------- services ---------- */

export const serviceSchema = z.object({
  name: required("Name", 120, "Give the service a name."),
  discipline: z.enum(["photo", "video", "voice"]),
  group: required("Group", 80, "Say which price table it belongs to."),
  use: optional("Typical use", 160),
  rate: amount("Enter a price of $0 or more."),
  unit: required("Unit", 40),
  turnaround: optional("Turnaround", 40),
  order: wholeNumber("Use a whole number, 0 or more."),
  featured: z.boolean(),
  active: z.boolean(),
})
export type ServiceValues = z.infer<typeof serviceSchema>

/* ---------- site images ---------- */

export const mediaSchema = z.object({
  url: imageUrl("image"),
  alt: required("Alt text", 200, "Describe the picture for people who cannot see it."),
})
export type MediaValues = z.infer<typeof mediaSchema>

export const portfolioSchema = z.object({
  title: required("Title", 120),
  label: optional("Label", 40),
  alt: required("Alt text", 200, "Describe the subject for people who cannot see it."),
  beforeUrl: imageUrl("before image"),
  afterUrl: imageUrl("after image"),
  order: wholeNumber("Use a whole number, 0 or more."),
  active: z.boolean(),
})
export type PortfolioValues = z.infer<typeof portfolioSchema>

/* ---------- email ---------- */

export const emailSchema = z.object({
  subject: required("Subject", 200, "Give the email a subject."),
  body: z.string().trim().min(10, "Write a message first.").max(10000, "That message is too long."),
})
export type EmailValues = z.infer<typeof emailSchema>
