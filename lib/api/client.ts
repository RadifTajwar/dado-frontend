/* Browser-side API calls. Use from Client Components for form submits and
   admin mutations. Paths are relative (/api/...), so they go through the
   Next.js rewrite to the Go server and carry the auth cookie automatically. */

import type { ApiErrorBody } from "@/lib/types"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields: Record<string, string> = {},
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown // sent as JSON
  formData?: FormData // sent as multipart (file uploads)
}

export async function apiFetch<T = void>(path: string, { method = "GET", body, formData }: Options = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: formData ?? (body === undefined ? undefined : JSON.stringify(body)),
    })
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0)
  }

  // A signed-out admin gets sent back to the login page.
  if (res.status === 401 && path.startsWith("/api/admin")) {
    // A full reload is intended here: it drops any stale admin state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)
  }

  if (res.status === 204) return undefined as T

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const err = (data ?? {}) as Partial<ApiErrorBody>
    throw new ApiError(err.error ?? "Something went wrong. Please try again.", res.status, err.fields)
  }
  return data as T
}
