/* The bordered bone card that holds a form (and its success message). */
export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="reveal rounded-[2px] border bg-background p-[clamp(26px,4vw,44px)]">{children}</div>
  )
}
