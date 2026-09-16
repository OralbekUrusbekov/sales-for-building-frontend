import { Star } from 'lucide-react'

/** Row of 5 stars filled to `value` (supports halves). */
export function Stars({ value, size = 15 }: { value: number; size?: number }) {
  const v = Math.max(0, Math.min(5, value))
  return (
    <span className="stars-row" aria-label={`${v.toFixed(1)} из 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, v - i))
        return (
          <span className="star-slot" key={i} style={{ width: size, height: size }}>
            <Star size={size} className="star-bg" strokeWidth={1.5} />
            {fill > 0 && (
              <span className="star-fg" style={{ width: `${fill * 100}%` }}>
                <Star size={size} strokeWidth={1.5} />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}

const RU_PLURAL = (n: number, forms: [string, string, string]) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return forms[2]
  if (b > 1 && b < 5) return forms[1]
  if (b === 1) return forms[0]
  return forms[2]
}

export const reviewsWord = (n: number) => RU_PLURAL(n, ['отзыв', 'отзыва', 'отзывов'])
export const plural = RU_PLURAL
