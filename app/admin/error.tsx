"use client"

import { Button } from "@/components/ui/button"

/* Shown when an admin page cannot load — most often because the Go API is not running. */
export default function AdminError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="grid min-h-svh place-items-center bg-app p-6">
      <div className="grid max-w-md gap-4 rounded-lg border bg-card p-8 text-center">
        <h1 className="font-serif text-2xl">This page could not load</h1>
        <p className="text-sm text-muted-foreground">
          The admin could not reach the API. Check that the Go server is running, then try again.
        </p>
        <Button type="button" variant="clay" className="justify-self-center" onClick={() => retry()}>
          Try again
        </Button>
      </div>
    </div>
  )
}
