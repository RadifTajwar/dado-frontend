import type { Metadata } from "next"

import { AuthShell } from "@/components/admin/auth/auth-shell"
import { ResetPasswordForm } from "@/components/admin/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset password",
  referrer: "no-referrer", // the URL carries the reset token; never pass it on
}

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams

  return (
    <AuthShell>
      <ResetPasswordForm token={typeof token === "string" ? token : ""} />
    </AuthShell>
  )
}
