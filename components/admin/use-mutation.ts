"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { refreshPublicData } from "@/lib/actions"
import { ApiError } from "@/lib/api/client"
import type { PublicTag } from "@/lib/api/endpoints"

type Options = {
  success?: React.ReactNode // toast shown when it worked
  publicTags?: PublicTag[] // public pages to refresh (services, media, portfolio)
  onError?: (err: ApiError) => void // e.g. put field messages on a form
}

/**
 * Runs one admin API call and does the follow-up every change needs:
 * error toast, public cache refresh, success toast, fresh server data.
 * Resolves to true when the call worked.
 */
export function useMutation() {
  const router = useRouter()

  return async function mutate(action: () => Promise<unknown>, { success, publicTags, onError }: Options = {}) {
    try {
      await action()
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError("Something went wrong. Please try again.", 0)
      onError?.(apiErr)
      toast.error(apiErr.message)
      return false
    }

    // The save already worked. If the cache refresh fails (e.g. the tab is on
    // an old build after a deploy), say so, but never report the save as failed.
    let rendered = false
    let refreshFailed = false
    if (publicTags?.length) {
      try {
        rendered = await refreshPublicData(publicTags)
      } catch {
        refreshFailed = true
      }
    }

    if (refreshFailed) toast.warning("Saved. The public site will catch up within 10 minutes.")
    else if (success) toast.success(success)
    // A Server Action that expired a tag already sent this page's fresh render.
    if (!rendered) router.refresh()
    return true
  }
}
