import type { UseFormRegisterReturn } from "react-hook-form"

/* A field only bots fill in. Hidden from people and screen readers, skipped by
   Tab; the API quietly drops any submission where it has a value. */
export function Honeypot({ id, registration }: { id: string; registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>Website</label>
      <input id={id} type="text" tabIndex={-1} autoComplete="off" {...registration} />
    </div>
  )
}
