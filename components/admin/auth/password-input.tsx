"use client"

import { useState } from "react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

/* Password field with a Show/Hide toggle. Spread react-hook-form's register() into it. */
export function PasswordInput(props: Omit<React.ComponentProps<"input">, "type">) {
  const [shown, setShown] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput {...props} type={shown ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={() => setShown((s) => !s)} aria-label={shown ? "Hide password" : "Show password"}>
          {shown ? "Hide" : "Show"}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
