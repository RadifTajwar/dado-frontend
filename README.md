# DADO — website + admin (Next.js)

Public site and admin panel for DADO Post-Production. Next.js 16 (App Router), React 19,
Tailwind CSS v4, shadcn/ui, zod + react-hook-form.

All data comes from the Go API ([dado-backend](https://github.com/RadifTajwar/dado-backend)). The browser only ever talks to
this site: `next.config.ts` forwards every `/api/*` request to the API (`BACKEND_URL`), so there is
no CORS and the admin's login cookie stays on this domain.

## Run locally

Needs Node 20.9+ and the API running on port 8080.

```bash
npm install
cp .env.example .env.local    # BACKEND_URL=http://localhost:8080
npm run dev                   # http://localhost:3000 — admin at /admin/login
```

## Where things are

| Path | What it does |
| --- | --- |
| `app/(site)/` | Public pages: home, services, about, contact, free trial |
| `app/admin/` | Admin: login, reset password, dashboard, clients, trials, contacts, services, media |
| `components/site/`, `components/admin/` | Our components, one per file |
| `components/shared/` | Used by both (logo, theme toggle, form field) |
| `components/ui/` | shadcn/ui (generated) |
| `lib/types.ts` | Data shapes: the contract with the API |
| `lib/api/endpoints.ts` | **Every API route, in one file** |
| `lib/api/server.ts` | Loading data in Server Components (`getPublic`, `getAdmin`) |
| `lib/api/client.ts` | Sending changes from Client Components (`apiFetch`) |
| `lib/actions.ts` | Refreshes the public pages right after an admin edit |
| `lib/validation.ts` | Form rules (the API checks the same rules again) |
| `lib/site.ts` | Contact details, navigation, form options |
| `app/globals.css` | Colours, fonts and shared styles |
| `proxy.ts` | Sends signed-out visitors from `/admin` to the login page |

**Server vs client:** components are Server Components unless the file starts with
`"use client"`, which is only used where the browser is needed (forms, dialogs, sliders, the
theme toggle). Public pages get their data on the server and are cached, so visitors never see a
loading state.

## Settings

| Variable | Value |
| --- | --- |
| `BACKEND_URL` | Where the Go API runs, e.g. `http://localhost:8080` or `https://dado-api.onrender.com` |
| `SITE_URL` | This site's public URL |

## Deploy (Vercel)

Deploy the API first: the build pre-renders the public pages with live prices, so it needs
`BACKEND_URL` to answer during the build.

1. vercel.com → **Add New → Project** → import this repository. Vercel detects Next.js; keep the
   default build settings.
2. **Environment Variables**: `BACKEND_URL` = the API's URL, `SITE_URL` = this site's URL
   (e.g. `https://dado.vercel.app`, or your own domain later).
3. **Deploy.** Every push to `main` redeploys.
4. Then set the API's `SITE_URL` to the same URL, so email links point here.

## Good to know

- Images are only loaded from our Cloudinary account (`dzmhtdw6b`) and Unsplash
  (`next.config.ts` → `images.remotePatterns`, mirrored in `lib/admin/images.ts` and the API).
- `npm run lint` and `npx tsc --noEmit` should stay clean; `node lib/admin/checks.mjs` checks the
  admin's money maths.
