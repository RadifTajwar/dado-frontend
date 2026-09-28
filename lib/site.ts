/* Site-wide constants: contact details, navigation and the option lists used
   by the public forms. Edit copy here once instead of in every component. */

import type { Discipline } from "@/lib/types"

export const SITE = {
  name: "DADO",
  tagline: "Post Production",
  description: "Photo, video and voice post-production for brands that ship on a schedule.",
  email: "hello@dado.studio",
  quotesEmail: "quotes@dado.studio",
  phone: "+880 1841 33 44 73",
  phoneHref: "tel:+8801841334473",
  city: "Dhaka, Bangladesh",
  address: ["Ring Road, Shyamoli", "Adabor, Dhaka 1207", "Bangladesh"],
  responseNote: "Replies within 30 minutes, 24/7",
} as const

export const TRIAL_HREF = "/free-trial#free"

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export const DISCIPLINE_ORDER: Discipline[] = ["photo", "video", "voice"]

export const DISCIPLINES: Record<Discipline, { label: string; long: string; href: string }> = {
  photo: { label: "Photo", long: "Photo post-production", href: "/services#photo" },
  video: { label: "Video", long: "Video post-production", href: "/services#video" },
  voice: { label: "Voice", long: "Voice over & audio", href: "/services#voice" },
}

export const FOOTER_LINKS = {
  services: [
    { href: "/services#photo", label: "Photo post-production" },
    { href: "/services#video", label: "Video post-production" },
    { href: "/services#voice", label: "Voice over & audio" },
    { href: "/services#pricing", label: "Price list" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: TRIAL_HREF, label: "Free trial" },
  ],
} as const

/* ---------- form option lists ---------- */

export const CONTACT_SERVICE_GROUPS = [
  {
    group: "Photo post-production",
    options: [
      "Clipping path & background removal",
      "Ghost mannequin & liquify",
      "Colour correction & matching",
      "Model / beauty retouching",
      "Jewellery & product retouching",
      "Masking, shadow & reflection",
      "Photo restoration",
    ],
  },
  {
    group: "Video post-production",
    options: [
      "Editing & assembly",
      "Colour grading",
      "Motion graphics",
      "Rotoscoping & clean-up",
      "Subtitles & platform cut-downs",
    ],
  },
  {
    group: "Voice over & audio",
    options: [
      "Commercial / explainer read",
      "E-learning narration",
      "IVR & phone prompts",
      "Mixing, mastering & repair",
    ],
  },
] as const
export const CONTACT_SERVICE_OTHER = "Something else / not sure yet"

export const TRIAL_VOLUMES = [
  "1–5 (the free trial)",
  "Under 100",
  "100–500",
  "500–2,000",
  "2,000+ / ongoing catalogue",
] as const

export const TRIAL_DEADLINES = [
  "Standard — 24h photo / voice, 48h video",
  "Rush — within 12 hours",
  "Same day",
  "No rush, quality first",
] as const

export const FILE_HOSTS = [
  "Google Drive",
  "Dropbox",
  "WeTransfer",
  "OneDrive",
  "Box",
  "Frame.io",
  "iCloud",
  "S3",
  "MEGA",
] as const
