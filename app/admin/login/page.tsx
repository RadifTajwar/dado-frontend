import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AuthShell } from "@/components/admin/auth/auth-shell"
import { LoginPanel } from "@/components/admin/auth/login-panel"
import { getCurrentAdmin } from "@/lib/api/server"

export const metadata: Metadata = { title: "Sign in" }

/* Only paths inside the admin are allowed as ?next= targets (no open redirect). */
function safeNext(next: string | string[] | undefined) {
  return typeof next === "string" && next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin"
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; view?: string | string[] }>
}) {
  const [{ next, view }, admin] = await Promise.all([searchParams, getCurrentAdmin()])
  const target = safeNext(next)
  if (admin) redirect(target)

  return (
    <AuthShell>
      <LoginPanel next={target} initialView={view === "forgot" ? "forgot" : "signin"} />
    </AuthShell>
  )
}
