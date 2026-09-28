type Value = { title: string; body: string }

/* Numbered list between hairlines ("How billing works", "Five commitments"). */
export function ValueList({ items }: { items: Value[] }) {
  return (
    <ol className="reveal border-t">
      {items.map((value, i) => (
        <li key={value.title} className="grid grid-cols-[auto_1fr] gap-5 border-b py-6">
          <span aria-hidden className="font-serif text-base text-clay">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="mb-1.5 text-[1.05rem] font-semibold">{value.title}</h3>
            <p className="text-[0.94rem] text-foreground/70">{value.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
