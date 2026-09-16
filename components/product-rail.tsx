'use client'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product-card'

function useRail() {
  const ref = useRef<HTMLDivElement>(null)
  const restore = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = () => {
    const el = ref.current
    if (!el) return
    setAtStart(el.scrollLeft <= 6)
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 6)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scroll = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const step = dir * Math.max(600, Math.round(el.clientWidth * 0.66))
    // scroll-snap fights an animated programmatic scroll in Chrome — disable during the animation
    el.style.scrollSnapType = 'none'
    el.scrollBy({ left: step, behavior: 'smooth' })
    clearTimeout(restore.current)
    restore.current = setTimeout(() => {
      el.style.scrollSnapType = ''
      update()
    }, 550)
  }

  return { ref, scroll, atStart, atEnd }
}

function Arrows({ scroll, atStart, atEnd }: { scroll: (d: 1 | -1) => void; atStart: boolean; atEnd: boolean }) {
  return (
    <>
      <button className="rail-arr rail-prev" onClick={() => scroll(-1)} disabled={atStart} aria-label="Назад" type="button">
        ‹
      </button>
      <button className="rail-arr rail-next" onClick={() => scroll(1)} disabled={atEnd} aria-label="Вперёд" type="button">
        ›
      </button>
    </>
  )
}

export function ProductRail({ items }: { items: Product[] }) {
  const { ref, scroll, atStart, atEnd } = useRail()
  return (
    <div className="rail">
      <div className="carousel" ref={ref}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} big />
        ))}
      </div>
      <Arrows scroll={scroll} atStart={atStart} atEnd={atEnd} />
    </div>
  )
}

export function Rail({ children }: { children: React.ReactNode }) {
  const { ref, scroll, atStart, atEnd } = useRail()
  return (
    <div className="rail">
      <div className="carousel" ref={ref}>
        {children}
      </div>
      <Arrows scroll={scroll} atStart={atStart} atEnd={atEnd} />
    </div>
  )
}
