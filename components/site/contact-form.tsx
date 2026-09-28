"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { FormField } from "@/components/shared/form-field"
import { CONTROL, SELECT, TEXTAREA } from "@/components/site/form-styles"
import { FormSuccess } from "@/components/site/form-success"
import { Honeypot } from "@/components/site/honeypot"
import { TextLink } from "@/components/site/text-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { CONTACT_SERVICE_GROUPS, CONTACT_SERVICE_OTHER, TRIAL_HREF } from "@/lib/site"
import { applyServerErrors, contactSchema, type ContactValues } from "@/lib/validation"

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState("")
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched", // check a field when you leave it, then live while you fix it
    defaultValues: { name: "", email: "", phone: "", service: "", message: "", website: "" },
  })

  async function onSubmit(values: ContactValues) {
    setFormError("")
    try {
      await apiFetch(API.contacts, { method: "POST", body: values })
      setSent(true)
    } catch (err) {
      setFormError(applyServerErrors(err, setError))
    }
  }

  if (sent) {
    return (
      <FormSuccess title="Message sent.">
        A producer has it and will reply within 30 minutes. If it is urgent, WhatsApp the number on this page and you
        will get someone straight away.
      </FormSuccess>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="grid gap-5 min-[641px]:grid-cols-2">
        <FormField id="c-name" label="Your name" required error={errors.name?.message}>
          {(control) => (
            <Input {...control} autoComplete="name" placeholder="Jordan Ali" className={CONTROL} {...register("name")} />
          )}
        </FormField>
        <FormField id="c-email" label="Email address" required error={errors.email?.message}>
          {(control) => (
            <Input
              {...control}
              type="email"
              autoComplete="email"
              placeholder="jordan@brand.com"
              className={CONTROL}
              {...register("email")}
            />
          )}
        </FormField>
      </div>

      <div className="grid gap-5 min-[641px]:grid-cols-2">
        <FormField id="c-phone" label="Phone" optional error={errors.phone?.message}>
          {(control) => (
            <Input
              {...control}
              type="tel"
              autoComplete="tel"
              placeholder="+44 7700 900000"
              className={CONTROL}
              {...register("phone")}
            />
          )}
        </FormField>
        <FormField id="c-service" label="Service you are asking about" error={errors.service?.message}>
          {(control) => (
            <NativeSelect {...control} className={SELECT} {...register("service")}>
              <NativeSelectOption value="">Select a service</NativeSelectOption>
              {CONTACT_SERVICE_GROUPS.map(({ group, options }) => (
                <NativeSelectOptGroup key={group} label={group}>
                  {options.map((option) => (
                    <NativeSelectOption key={option} value={option}>
                      {option}
                    </NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
              ))}
              <NativeSelectOption value={CONTACT_SERVICE_OTHER}>{CONTACT_SERVICE_OTHER}</NativeSelectOption>
            </NativeSelect>
          )}
        </FormField>
      </div>

      <FormField id="c-message" label="Message" required error={errors.message?.message}>
        {(control) => (
          <Textarea
            {...control}
            placeholder="Tell us what you are working on — volumes, deadlines, formats, anything you are unsure about."
            className={TEXTAREA}
            {...register("message")}
          />
        )}
      </FormField>

      <Honeypot id="c-website" registration={register("website")} />

      <Button type="submit" variant="clay" size="xl" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          "Sending…"
        ) : (
          <>
            Send message <span aria-hidden>→</span>
          </>
        )}
      </Button>
      {formError && (
        <p role="alert" className="text-center text-[0.86rem] font-medium text-destructive">
          {formError}
        </p>
      )}
      <p className="text-center text-[0.86rem] text-muted-foreground">
        Ready to send files instead?{" "}
        <TextLink href={TRIAL_HREF} arrow={false} className="relative before:absolute before:inset-x-0 before:-inset-y-1.5 text-[length:inherit]">
          Start the free trial
        </TextLink>
      </p>
    </form>
  )
}
