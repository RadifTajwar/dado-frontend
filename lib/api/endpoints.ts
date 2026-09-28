/* ==========================================================================
   Every API route in one place. The browser calls these paths on the Next.js
   origin; next.config.ts rewrites /api/* to the Go server (BACKEND_URL), so
   there is no CORS and the auth cookie stays first-party.

   The Go side registers the same list in backend/internal/routes/routes.go.

   METHOD  PATH                              BODY              → RESPONSE
   ------  --------------------------------  ----------------  ------------------------
   Public
   GET     /api/health                                         { ok: true }
   GET     /api/services                                       Service[]   (active only)
   GET     /api/media                                          MediaImage[]
   GET     /api/portfolio                                      PortfolioItem[] (active only)
   POST    /api/contacts                     ContactInput      201 { ok: true }
   POST    /api/trials                       TrialInput        201 { ok: true }

   Auth (cookie: AUTH_COOKIE, httpOnly JWT, expires after 24 hours)
   POST    /api/auth/login                   { email, password } AdminUser + Set-Cookie
   POST    /api/auth/logout                                    204, clears cookie
   GET     /api/auth/me                                        AdminUser | 401
   POST    /api/auth/forgot                  { email }         200 { ok: true } (always)
   POST    /api/auth/reset                   { token, password } 200 { ok: true }

   Admin (401 without a valid cookie)
   GET     /api/admin/counts                                   AdminCounts
   GET     /api/admin/services                                 Service[]   (all)
   POST    /api/admin/services               ServiceInput      201 Service
   PUT     /api/admin/services/{id}          ServiceInput      Service
   DELETE  /api/admin/services/{id}                            204 | 409 when jobs use it
   GET     /api/admin/clients                                  Client[]
   POST    /api/admin/clients                ClientInput       201 Client
   PUT     /api/admin/clients/{id}           ClientInput       Client
   DELETE  /api/admin/clients/{id}                             204 (also deletes its jobs,
                                                                    un-converts its trials)
   GET     /api/admin/jobs?clientId=         (filter optional) Job[]
   POST    /api/admin/jobs                   JobInput          201 Job
   PATCH   /api/admin/jobs/{id}              Partial<JobInput> Job
   DELETE  /api/admin/jobs/{id}                                204
   GET     /api/admin/trials                                   Trial[]  (newest first)
   PATCH   /api/admin/trials/{id}            { status?, flagReason?, read?: true } Trial
   POST    /api/admin/trials/{id}/convert                      201 { client: Client, trial: Trial }
   POST    /api/admin/trials/{id}/email      EmailInput        Trial (lastEmailedAt set)
   GET     /api/admin/contacts                                 Contact[] (newest first)
   PATCH   /api/admin/contacts/{id}          { status?, flagReason?, read?: true } Contact
   POST    /api/admin/contacts/{id}/email    EmailInput        Contact (status new → replied)
   GET     /api/admin/portfolio                                PortfolioItem[] (all)
   POST    /api/admin/portfolio              PortfolioInput    201 PortfolioItem
   PUT     /api/admin/portfolio/{id}         PortfolioInput    PortfolioItem
   DELETE  /api/admin/portfolio/{id}                           204
   PUT     /api/admin/media/{slot}           MediaInput        MediaImage
   POST    /api/admin/uploads                multipart "file"  201 UploadResult
                                                               (503 until Cloudinary keys are set)

   Errors: { error: string, fields?: Record<string, string> } with
   400 invalid input · 401 signed out · 404 not found · 409 conflict ·
   413 too large · 429 too many requests · 502 email failed · 503 not configured
   ========================================================================== */

import type { MediaSlot } from "@/lib/types"

/** Name of the httpOnly cookie that carries the admin JWT. */
export const AUTH_COOKIE = "dado_token"

export const API = {
  health: "/api/health",
  services: "/api/services",
  media: "/api/media",
  portfolio: "/api/portfolio",
  contacts: "/api/contacts",
  trials: "/api/trials",

  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    forgot: "/api/auth/forgot",
    reset: "/api/auth/reset",
  },

  admin: {
    counts: "/api/admin/counts",
    services: "/api/admin/services",
    service: (id: string) => `/api/admin/services/${id}`,
    clients: "/api/admin/clients",
    client: (id: string) => `/api/admin/clients/${id}`,
    jobs: "/api/admin/jobs",
    job: (id: string) => `/api/admin/jobs/${id}`,
    trials: "/api/admin/trials",
    trial: (id: string) => `/api/admin/trials/${id}`,
    trialConvert: (id: string) => `/api/admin/trials/${id}/convert`,
    trialEmail: (id: string) => `/api/admin/trials/${id}/email`,
    contacts: "/api/admin/contacts",
    contact: (id: string) => `/api/admin/contacts/${id}`,
    contactEmail: (id: string) => `/api/admin/contacts/${id}/email`,
    portfolio: "/api/admin/portfolio",
    portfolioItem: (id: string) => `/api/admin/portfolio/${id}`,
    media: (slot: MediaSlot) => `/api/admin/media/${slot}`,
    uploads: "/api/admin/uploads",
  },
} as const

/** Cache tags for public data, so admin edits show up on the site immediately. */
export const PUBLIC_TAGS = {
  services: "services",
  media: "media",
  portfolio: "portfolio",
} as const
export type PublicTag = (typeof PUBLIC_TAGS)[keyof typeof PUBLIC_TAGS]
