"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"

export function SignOutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function signOut() {
    setPending(true)
    // Clearing the cookie is the API's job; go to the login page even if the call fails.
    await apiFetch(API.auth.logout, { method: "POST" }).catch(() => undefined)
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <Button type="button" variant="outline" disabled={pending} onClick={signOut}>
      <LogOutIcon />
      <span className="max-sm:sr-only">Sign out</span>
    </Button>
  )
}
