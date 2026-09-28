/* A definition list between hairlines: contact details, trial small print. */
export function ContactInfo({ items }: { items: { term: string; detail: React.ReactNode }[] }) {
  return (
    <dl className="reveal border-t">
      {items.map((item) => (
        <div key={item.term} className="border-b py-[22px]">
          <dt className="mb-2 text-[0.74rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {item.term}
          </dt>
          <dd className="text-base [&_a:not([class])]:transition-colors [&_a:not([class])]:hover:text-clay">
            {item.detail}
          </dd>
        </div>
      ))}
    </dl>
  )
}
