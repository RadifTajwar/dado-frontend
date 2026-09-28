/* Human labels and badge tones for every status the admin shows. */

import type { ContactStatus, Discipline, JobStatus, TrialStatus } from "@/lib/types"

/** Badge colours. ok/bad are reserved for status and always sit next to a label. */
export type Tone = "clay" | "ok" | "bad" | "outline" | "muted"

type Status = { label: string; tone: Tone }

export const TRIAL_STATUS: Record<TrialStatus, Status> = {
  new: { label: "New", tone: "clay" },
  converted: { label: "Client", tone: "ok" },
  flagged: { label: "Flagged", tone: "bad" },
  declined: { label: "Declined", tone: "outline" },
}

export const CONTACT_STATUS: Record<ContactStatus, Status> = {
  new: { label: "New", tone: "clay" },
  replied: { label: "Replied", tone: "ok" },
  archived: { label: "Archived", tone: "outline" },
  flagged: { label: "Flagged", tone: "bad" },
}

export const JOB_STATUS: Record<JobStatus, Status> = {
  delivered: { label: "Delivered", tone: "ok" },
  "in-progress": { label: "In progress", tone: "clay" },
  quoted: { label: "Quoted", tone: "outline" },
}

/** Short discipline names used in admin chips and charts. */
export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  photo: "Photo",
  video: "Video",
  voice: "Voice over",
}

/** Units offered when editing a service (a service's own unit is always kept). */
export const SERVICE_UNITS = ["image", "minute", "100 words", "prompt", "finished hour", "hour", "project"]

export const TRIAL_FLAG_REASONS = [
  "Email bounces — no way to reach them.",
  "Disposable inbox, no company, placeholder name.",
  "Cloud link is private or dead.",
  "No reply after three attempts.",
]

export const CONTACT_FLAG_REASONS = [
  "Address bounces — nothing to reply to.",
  "Bulk spam, not a real enquiry.",
  "Disposable inbox, no company, placeholder name.",
  "No reply after three attempts.",
]
