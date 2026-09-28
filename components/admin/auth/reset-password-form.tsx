"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { AuthHeading } from "@/components/admin/auth/auth-shell"
import { PasswordInput } from "@/components/admin/auth/password-input"
import { Notice } from "@/components/admin/facts"
import { FormField } from "@/components/shared/form-field"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { apiFetch, ApiError } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { resetSchema, type ResetValues } from "@/lib/validation"

const NEW_LINK = "/admin/login?view=forgot"

export function ResetPasswordForm({ token }: { token: string }) {
  const [done, setDone] = useState(false)
  const [linkError, setLinkError] = useState(token ? "" : "This reset link is incomplete.")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirm: "" } })

  async function save({ password }: ResetValues) {
    try {
      await apiFetch(API.auth.reset, { method: "POST", body: { token, password } })
      setDone(true)
    } catch (err) {
      setLinkError(err instanceof ApiError ? err.message : "Could not reset the password. Please try again.")
    }
  }

  if (done) {
    return (
      <section>
        <AuthHeading title="Password updated">Your new password is ready. Sign in with it now.</AuthHeading>
        <Button asChild variant="clay" size="lg" className="w-full">
          <Link href="/admin/login">Sign in</Link>
        </Button>
      </section>
    )
  }

  return (
    <section>
      <AuthHeading title="Choose a new password">Use at least 8 characters. The link works once.</AuthHeading>
      {linkError && (
        <div className="mb-5">
          <Notice>
            {linkError}{" "}
            <Link href={NEW_LINK} className="font-semibold underline underline-offset-3">
              Request a new link
            </Link>
          </Notice>
        </div>
      )}
      {token && (
        <form noValidate onSubmit={handleSubmit(save)} className="grid gap-4">
          <FormField id="new-password" label="New password" error={errors.password?.message}>
            {(control) => <PasswordInput {...control} autoComplete="new-password" autoFocus {...register("password")} />}
          </FormField>
          <FormField id="confirm-password" label="Confirm new password" error={errors.confirm?.message}>
            {(control) => <PasswordInput {...control} autoComplete="new-password" {...register("confirm")} />}
          </FormField>
          <Button type="submit" variant="clay" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            Save new password
          </Button>
        </form>
      )}
    </section>
  )
}
