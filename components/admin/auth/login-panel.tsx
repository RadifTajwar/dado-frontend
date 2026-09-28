"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { AuthHeading } from "@/components/admin/auth/auth-shell"
import { PasswordInput } from "@/components/admin/auth/password-input"
import { FormField } from "@/components/shared/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { apiFetch, ApiError } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import type { AdminUser } from "@/lib/types"
import { applyServerErrors, forgotSchema, loginSchema, type ForgotValues, type LoginValues } from "@/lib/validation"

type View = "signin" | "forgot" | "sent"

/* Sign in → Forgot password → Check your inbox, on one page. */
export function LoginPanel({ next, initialView = "signin" }: { next: string; initialView?: View }) {
  const [view, setView] = useState<View>(initialView)
  const [email, setEmail] = useState("")

  if (view === "forgot") {
    return (
      <ForgotForm
        defaultEmail={email}
        onBack={() => setView("signin")}
        onSent={(sentTo) => {
          setEmail(sentTo)
          setView("sent")
        }}
      />
    )
  }

  if (view === "sent") {
    return (
      <section>
        <div aria-hidden className="mt-5 grid size-11.5 place-items-center rounded-full bg-ok-soft text-ok">
          <CheckIcon className="size-5" />
        </div>
        <AuthHeading title="Check your inbox">
          If an admin account exists for <strong className="text-foreground">{email}</strong>, a reset link is on its
          way. Nothing arrived? Check spam, then try again in a few minutes.
        </AuthHeading>
        <Button type="button" variant="outline" className="w-full" onClick={() => setView("signin")}>
          Back to sign in
        </Button>
      </section>
    )
  }

  return (
    <SignInForm
      next={next}
      onForgot={(typed) => {
        setEmail(typed)
        setView("forgot")
      }}
    />
  )
}

function SignInForm({ next, onForgot }: { next: string; onForgot: (email: string) => void }) {
  const router = useRouter()
  const [signedIn, setSignedIn] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } })

  async function signIn(values: LoginValues) {
    try {
      await apiFetch<AdminUser>(API.auth.login, { method: "POST", body: values })
    } catch (err) {
      const message = applyServerErrors(err, setError)
      if (message) setError("password", { message })
      return
    }
    setSignedIn(true) // keep the button busy while the dashboard loads
    router.replace(next)
    router.refresh()
  }

  const busy = isSubmitting || signedIn

  return (
    <section>
      <AuthHeading title="Sign in">Admin access to the DADO workspace.</AuthHeading>
      <form noValidate onSubmit={handleSubmit(signIn)} className="grid gap-4">
        <FormField id="login-email" label="Email" error={errors.email?.message}>
          {(control) => (
            <Input
              {...control}
              type="email"
              autoComplete="username"
              {...register("email")}
            />
          )}
        </FormField>
        <FormField id="login-password" label="Password" error={errors.password?.message}>
          {(control) => (
            <PasswordInput
              {...control}
              autoComplete="current-password"
              {...register("password")}
            />
          )}
        </FormField>
        <div className="flex justify-end">
          <Button type="button" variant="link" size="sm" className="h-auto px-0 text-muted-foreground" onClick={() => onForgot(getValues("email"))}>
            Forgot password?
          </Button>
        </div>
        <Button type="submit" variant="clay" size="lg" className="w-full" disabled={busy}>
          {busy && <Spinner />}
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </section>
  )
}

function ForgotForm({
  defaultEmail,
  onBack,
  onSent,
}: {
  defaultEmail: string
  onBack: () => void
  onSent: (email: string) => void
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: defaultEmail } })

  async function send({ email }: ForgotValues) {
    try {
      await apiFetch(API.auth.forgot, { method: "POST", body: { email } })
      onSent(email)
    } catch (err) {
      setError("email", { message: err instanceof ApiError ? err.message : "Could not send the link. Please try again." })
    }
  }

  return (
    <section>
      <AuthHeading title="Reset password">
        Enter the admin email and we will send a reset link. It expires in 30 minutes.
      </AuthHeading>
      <form noValidate onSubmit={handleSubmit(send)} className="grid gap-4">
        <FormField id="forgot-email" label="Email" error={errors.email?.message}>
          {(control) => (
            <Input
              {...control}
              type="email"
              autoComplete="username"
              autoFocus
              {...register("email")}
            />
          )}
        </FormField>
        <Button type="submit" variant="clay" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          Send reset link
        </Button>
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={onBack}>
          Back to sign in
        </Button>
      </form>
    </section>
  )
}
