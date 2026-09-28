/* ==========================================================================
   Shared data types — the contract between this app and the Go API.
   JSON is camelCase. IDs are MongoDB ObjectID hex strings.
   `createdAt` / `updatedAt` / `lastEmailedAt` are RFC 3339 timestamps.
   `date` / `since` are plain calendar days: "YYYY-MM-DD".
   Money is USD as a number, rounded to cents by the API.
   ========================================================================== */

export type Discipline = "photo" | "video" | "voice"

/* ---------- public content ---------- */

export interface Service {
  id: string
  name: string
  discipline: Discipline
  group: string // price-table caption, e.g. "Cut-out & path"
  use: string // "Typical use" column, e.g. "Simple shapes, hard edges"
  rate: number // "from" price in USD
  unit: string // "image" | "minute" | "100 words" | "prompt" | "finished hour"
  turnaround: string // e.g. "24 hours"; shown in the home page table
  featured: boolean // listed in the home page "most-ordered" table
  active: boolean // hidden everywhere public when false
  order: number // sort order inside its discipline
  createdAt: string
  updatedAt: string
}
export type ServiceInput = Omit<Service, "id" | "createdAt" | "updatedAt">

/* Fixed image slots on the public site, replaceable from the admin. */
export type MediaSlot = "hero" | "about" | "photo" | "video" | "voice"

export interface MediaImage {
  slot: MediaSlot
  url: string
  alt: string
  updatedAt: string
}
export type MediaInput = Pick<MediaImage, "url" | "alt">

/* A before/after pair for the "Recent work" sliders. */
export interface PortfolioItem {
  id: string
  title: string // "Model & skin retouch"
  label: string // "Photo" | "Video frame" | …
  alt: string // describes the subject; the UI appends "before" / "after"
  beforeUrl: string
  afterUrl: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}
export type PortfolioInput = Omit<PortfolioItem, "id" | "createdAt" | "updatedAt">

/* ---------- public form submissions ---------- */

export interface ContactInput {
  name: string
  email: string
  phone?: string
  service?: string // free text picked from a list; "" when not chosen
  message: string
  website?: string // honeypot: real people leave it empty
}

export interface TrialInput {
  name: string
  email: string
  company?: string
  phone?: string
  services: Discipline[] // at least one
  link: string // http(s) link to a cloud folder (Drive, Dropbox, …)
  volume?: string
  deadline?: string
  brief: string
  nda: boolean
  website?: string // honeypot
}

/* ---------- admin records ---------- */

export type ContactStatus = "new" | "replied" | "archived" | "flagged"

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: ContactStatus
  flagReason: string // "" unless status is "flagged"
  read: boolean // one-way: once true it never goes back
  lastEmailedAt: string | null
  createdAt: string
}

export type TrialStatus = "new" | "converted" | "declined" | "flagged"

export interface Trial {
  id: string
  name: string
  email: string
  company: string
  phone: string
  services: Discipline[]
  link: string
  volume: string
  deadline: string
  brief: string
  nda: boolean
  status: TrialStatus
  flagReason: string
  read: boolean
  lastEmailedAt: string | null
  clientId: string | null // set once converted
  createdAt: string
}

export type ClientSource = "trial" | "direct"

export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  country: string
  since: string // YYYY-MM-DD
  source: ClientSource
  notes: string
  createdAt: string
}
export type ClientInput = Pick<Client, "name" | "company" | "email" | "phone" | "country" | "notes"> &
  Partial<Pick<Client, "since" | "source">>

export type JobStatus = "quoted" | "in-progress" | "delivered"

/* One piece of billed work for a client ("works" in the prototype). */
export interface Job {
  id: string
  clientId: string
  serviceId: string
  date: string // YYYY-MM-DD
  qty: number
  amount: number // what was charged
  paid: number // received so far, 0 ≤ paid ≤ amount
  status: JobStatus
  details: string
  link: string // "" or an http(s) link to the files
  createdAt: string
}
export type JobInput = Omit<Job, "id" | "createdAt">

export interface AdminUser {
  id: string
  email: string
}

export interface AdminCounts {
  clients: number
  unreadTrials: number
  unreadContacts: number
  activeServices: number
}

/* Body for "send an email" from the admin (trials and contacts). */
export interface EmailInput {
  subject: string
  body: string // plain text; the API wraps it in the branded template
}

export interface UploadResult {
  url: string // https URL on res.cloudinary.com
  publicId: string
  width: number
  height: number
}

/* Every non-2xx response has this shape. `fields` maps input names to messages. */
export interface ApiErrorBody {
  error: string
  fields?: Record<string, string>
}
