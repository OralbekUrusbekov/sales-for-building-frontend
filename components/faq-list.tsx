import type { FaqItem } from '@/types'

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((it, i) => (
        <details key={i} open={i === 0}>
          <summary>{it.q}</summary>
          <p>{it.a}</p>
        </details>
      ))}
    </div>
  )
}
