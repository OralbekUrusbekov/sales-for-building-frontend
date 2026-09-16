'use client'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import type { Review } from '@/types'
import { useUi } from '@/lib/ui-store'
import { submitReview } from '@/lib/api/browser'
import { Stars, reviewsWord } from '@/components/stars'

const PER_PAGE = 9

function reviewStats(list: Review[]) {
  const total = list.length
  const avg = total ? list.reduce((s, r) => s + r.rating, 0) / total : 0
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = list.filter((r) => r.rating === star).length
    return { star, count, pct: total ? Math.round((count / total) * 100) : 0 }
  })
  return { total, avg, dist }
}

export function ReviewsBlock({
  reviews,
  showForm = true,
  paginate = false,
  labelFor,
  targetType,
  targetId,
}: {
  reviews: Review[]
  showForm?: boolean
  paginate?: boolean
  labelFor?: (r: Review) => string
  targetType?: string
  targetId?: string
}) {
  const stats = reviewStats(reviews)
  const { showToast } = useUi()
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [reviews])

  const pages = paginate ? Math.max(1, Math.ceil(reviews.length / PER_PAGE)) : 1
  const current = Math.min(page, pages)
  const shown = paginate ? reviews.slice((current - 1) * PER_PAGE, current * PER_PAGE) : reviews

  return (
    <div>
      <div className="rev-summary">
        <div className="score">{stats.avg.toFixed(1)}</div>
        <div className="bars">
          {stats.dist.map((d) => (
            <div className="rev-bar" key={d.star}>
              <span>{d.star} ★</span>
              <i><b style={{ width: `${d.pct}%` }} /></i>
              <span>{d.count}</span>
            </div>
          ))}
        </div>
        <div>
          <strong style={{ fontSize: 20 }}>{stats.total}</strong>
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>{reviewsWord(stats.total)}</div>
        </div>
      </div>

      <div className={`rev-list${paginate ? ' rev-grid' : ''}`}>
        {shown.map((r) => (
          <article className="rcard" key={r.id}>
            <div className="who">
              {r.avatar && <img src={r.avatar} alt="" />}
              <div>
                <b>{r.authorName}</b>
                <span> · {new Date(r.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
            <Stars value={r.rating} size={13} />
            {labelFor && <h4>{labelFor(r)}</h4>}
            <p>{r.text}</p>
          </article>
        ))}
        {!shown.length && (
          <article className="rcard">
            <b>Пока нет отзывов</b>
            <p>Станьте первым, кто оставит отзыв.</p>
          </article>
        )}
      </div>

      {pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button className={n === current ? 'on' : ''} onClick={() => setPage(n)} key={n}>
              {n}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <form
          className="review-form"
          onSubmit={async (e) => {
            e.preventDefault()
            if (targetType && targetId) {
              const ok = await submitReview({
                target_type: targetType,
                target_id: targetId,
                author_name: name,
                rating: rating || 5,
                text,
              })
              showToast(
                ok
                  ? 'Спасибо! Отзыв отправлен на модерацию'
                  : 'Не удалось отправить отзыв, попробуйте позже',
              )
            } else {
              showToast('Спасибо! Отзыв отправлен на модерацию')
            }
            setName('')
            setText('')
            setRating(0)
          }}
        >
          <h3>Оставить отзыв</h3>
          <div className="stars-pick">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={n <= rating ? 'on' : ''}
                onClick={() => setRating(n)}
                aria-label={`${n} звёзд`}
              >
                <Star size={22} strokeWidth={1.5} fill={n <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <input placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required />
          <textarea placeholder="Ваш отзыв" value={text} onChange={(e) => setText(e.target.value)} required />
          <button className="btn btn-green" type="submit">Опубликовать <span className="ico">→</span></button>
        </form>
      )}
    </div>
  )
}
