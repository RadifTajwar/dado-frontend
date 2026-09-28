"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { FIELD_LABEL, FormField } from "@/components/shared/form-field"
import { CONTROL, SELECT, TEXTAREA } from "@/components/site/form-styles"
import { FormSuccess } from "@/components/site/form-success"
import { Honeypot } from "@/components/site/honeypot"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api/client"
import { API } from "@/lib/api/endpoints"
import { DISCIPLINE_ORDER, DISCIPLINES, TRIAL_DEADLINES, TRIAL_VOLUMES } from "@/lib/site"
import { cn } from "@/lib/utils"
import { applyServerErrors, trialSchema, type TrialValues } from "@/lib/validation"

// Bordered checkbox "chips" that turn clay when ticked.
const CHOICE =
  "inline-flex cursor-pointer items-center gap-[9px] rounded-[2px] border border-input px-[18px] py-3 text-[0.9rem] font-medium transition-colors has-data-checked:border-clay has-data-checked:bg-clay-soft"
const CHECK = "rounded-[1px] data-checked:border-clay data-checked:bg-clay data-checked:text-clay-foreground dark:data-checked:bg-clay"

export function TrialForm() {
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState("")
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TrialValues>({
    resolver: zodResolver(trialSchema),
    mode: "onTouched", // check a field when you leave it, then live while you fix it
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      services: [],
      link: "",
      volume: "",
      deadline: "",
      brief: "",
      nda: false,
      website: "",
    },
  })

  async function onSubmit(values: TrialValues) {
    setFormError("")
    try {
      await apiFetch(API.trials, { method: "POST", body: values })
      setSent(true)
    } catch (err) {
      setFormError(applyServerErrors(err, setError))
    }
  }

  if (sent) {
    return (
      <FormSuccess title="Trial request received.">
        A producer is opening your link now. You will have a reply — with scope, timing and any questions — within 30
        minutes. Check your spam folder if nothing has landed in an hour.
      </FormSuccess>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="grid gap-5 min-[641px]:grid-cols-2">
        <FormField id="t-name" label="Full name" required error={errors.name?.message}>
          {(c) => <Input {...c} autoComplete="name" placeholder="Jordan Ali" className={CONTROL} {...register("name")} />}
        </FormField>
        <FormField id="t-email" label="Work email" required error={errors.email?.message}>
          {(c) => (
            <Input
              {...c}
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
        <FormField id="t-company" label="Company" error={errors.company?.message}>
          {(c) => (
            <Input {...c} autoComplete="organization" placeholder="Optional" className={CONTROL} {...register("company")} />
          )}
        </FormField>
        <FormField id="t-phone" label="Phone / WhatsApp" error={errors.phone?.message}>
          {(c) => (
            <Input {...c} type="tel" autoComplete="tel" placeholder="Optional" className={CONTROL} {...register("phone")} />
          )}
        </FormField>
      </div>

      {/* Validated on submit (not on blur) so tabbing through doesn't flag it early. */}
      <Controller
        name="services"
        control={control}
        render={({ field, fieldState }) => (
          <FieldSet
            aria-describedby={fieldState.error ? "t-services-error" : undefined}
            className="gap-[7px]"
          >
            <FieldLegend variant="label" className={cn(FIELD_LABEL, "mb-0 data-[variant=label]:text-[0.76rem]")}>
              What do you need?{" "}
              <span aria-hidden className="text-clay">
                *
              </span>
            </FieldLegend>
            <div className="flex flex-wrap gap-2.5">
              {DISCIPLINE_ORDER.map((d, i) => (
                <label key={d} className={CHOICE}>
                  <Checkbox
                    ref={i === 0 ? field.ref : undefined}
                    checked={field.value.includes(d)}
                    onCheckedChange={(on) =>
                      field.onChange(on === true ? [...field.value, d] : field.value.filter((v) => v !== d))
                    }
                    aria-invalid={fieldState.invalid || undefined}
                    className={CHECK}
                  />
                  {DISCIPLINES[d].long}
                </label>
              ))}
            </div>
            <FieldError id="t-services-error" className="text-[0.79rem] font-semibold">
              {fieldState.error?.message}
            </FieldError>
          </FieldSet>
        )}
      />

      <FormField
        id="t-link"
        label="Link to your files"
        required
        error={errors.link?.message}
        hint={
          <>
            Drive, Dropbox, WeTransfer, OneDrive, Box, Frame.io, iCloud, S3 or MEGA. Set sharing to{" "}
            <strong>anyone with the link can view</strong> — otherwise we cannot open it and the clock does not start.
          </>
        }
      >
        {(c) => (
          <Input
            {...c}
            type="url"
            inputMode="url"
            spellCheck={false}
            placeholder="https://drive.google.com/drive/folders/..."
            className={CONTROL}
            {...register("link")}
          />
        )}
      </FormField>

      <div className="grid gap-5 min-[641px]:grid-cols-2">
        <FormField id="t-volume" label="Roughly how many files?" error={errors.volume?.message}>
          {(c) => (
            <NativeSelect {...c} className={SELECT} {...register("volume")}>
              <NativeSelectOption value="">Select a range</NativeSelectOption>
              {TRIAL_VOLUMES.map((v) => (
                <NativeSelectOption key={v} value={v}>
                  {v}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}
        </FormField>
        <FormField id="t-deadline" label="When do you need it back?" error={errors.deadline?.message}>
          {(c) => (
            <NativeSelect {...c} className={SELECT} {...register("deadline")}>
              <NativeSelectOption value="">Select a turnaround</NativeSelectOption>
              {TRIAL_DEADLINES.map((d) => (
                <NativeSelectOption key={d} value={d}>
                  {d}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}
        </FormField>
      </div>

      <FormField
        id="t-brief"
        label="What should we do to them?"
        required
        error={errors.brief?.message}
        hint="The more specific the brief, the closer the first pass lands. Reference files and style guides are welcome in the same folder."
      >
        {(c) => (
          <Textarea
            {...c}
            placeholder="e.g. Cut out on pure white, add a natural shadow, match colour to the swatch in the folder, export 2000px square JPG named by SKU."
            className={TEXTAREA}
            {...register("brief")}
          />
        )}
      </FormField>

      <Controller
        name="nda"
        control={control}
        render={({ field }) => (
          <label className={cn(CHOICE, "w-full")}>
            <Checkbox
              ref={field.ref}
              checked={field.value}
              onCheckedChange={(on) => field.onChange(on === true)}
              className={CHECK}
            />
            I need an NDA signed before you open the files
          </label>
        )}
      />

      <Honeypot id="t-website" registration={register("website")} />

      <Button type="submit" variant="clay" size="xl" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          "Sending…"
        ) : (
          <>
            Send trial request <span aria-hidden>→</span>
          </>
        )}
      </Button>
      {formError && (
        <p role="alert" className="text-center text-[0.86rem] font-medium text-destructive">
          {formError}
        </p>
      )}
      <p className="text-center text-[0.86rem] text-muted-foreground">
        A producer replies within 30 minutes, day or night. We never pass your files or your details to anyone.
      </p>
    </form>
  )
}
