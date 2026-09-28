/* A row of big serif numbers between hairlines. Static on purpose: a count-up
   would render "0" first and flash. */
export function StatStrip({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="reveal grid grid-cols-2 gap-px border-y bg-border min-[761px]:grid-cols-4">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse justify-end bg-background px-4 py-5 min-[761px]:px-6 min-[761px]:py-7"
        >
          <dt className="mt-2 text-[0.78rem] tracking-[0.1em] text-muted-foreground uppercase">{stat.label}</dt>
          <dd className="font-serif text-[clamp(1.8rem,3.4vw,2.5rem)] leading-none">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
