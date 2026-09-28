import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

/** The small uppercase label style, also used for fieldset legends. */
export const FIELD_LABEL = "text-[0.76rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase"

/** Props that tie a control to its label, hint and error for screen readers. */
export type ControlProps = {
  id: string
  required?: boolean
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

/* Label + control + hint + error, for every form on the site and in the admin.
   The control is a render prop so it gets the right id and aria attributes
   (label link, "invalid", hint and error read out on focus) without repeating
   them at each call site:

     <FormField id="c-name" label="Your name" required error={errors.name?.message}>
       {(control) => <Input {...control} {...register("name")} />}
     </FormField>
*/
export function FormField({
  id,
  label,
  required = false,
  optional = false,
  hint,
  error,
  className,
  children,
}: {
  id: string
  label: React.ReactNode
  required?: boolean
  optional?: boolean
  hint?: React.ReactNode
  error?: string
  className?: string
  children: (control: ControlProps) => React.ReactNode
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ")

  return (
    <Field data-invalid={error ? true : undefined} className={cn("gap-1.5", className)}>
      <FieldLabel htmlFor={id} className={cn(FIELD_LABEL, "gap-1 leading-snug")}>
        {label}
        {required && (
          <span aria-hidden className="text-clay">
            *
          </span>
        )}
        {optional && <span className="font-normal tracking-normal normal-case">(optional)</span>}
      </FieldLabel>
      {children({ id, required, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy || undefined })}
      {hint && (
        <FieldDescription id={`${id}-hint`} className="text-[0.78rem]">
          {hint}
        </FieldDescription>
      )}
      <FieldError id={`${id}-error`} className="text-[0.78rem] font-semibold">
        {error}
      </FieldError>
    </Field>
  )
}
