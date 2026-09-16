'use client'
import { useEffect, useMemo, useState } from 'react'
import { PublicShell } from '@/components/public-shell'
import { ReviewsBlock } from '@/components/reviews-block'
import { reviews as mockReviews } from '@/lib/data/reviews'
import { fetchAllProducts, fetchAllReviews, fetchMasters, fetchServices } from '@/lib/api/browser'
import type { Review, ReviewTargetType } from '@/types'

const tabs: { key: 'all' | ReviewTargetType; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'product', label: 'Товары' },
  { key: 'master', label: 'Мастера' },
  { key: 'service', label: 'Услуги' },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews as Review[])
  const [names, setNames] = useState<Record<string, string>>({})
  const [tab, setTab] = useState<'all' | ReviewTargetType>('all')

  useEffect(() => {
    fetchAllReviews().then((r) => r && setReviews(r))
    Promise.all([fetchAllProducts(), fetchMasters(), fetchServices()]).then(([p, m, s]) => {
      const map: Record<string, string> = {}
      p?.forEach((x) => (map[`product:${x.id}`] = x.name))
      m?.forEach((x) => (map[`master:${x.id}`] = x.name))
      s?.forEach((x) => (map[`service:${x.slug}`] = x.name))
      setNames(map)
    })
  }, [])

  const label = (r: Review) =>
    names[`${r.targetType}:${r.targetId}`] ??
    (r.targetType === 'product' ? 'Товар' : r.targetType === 'master' ? 'Мастер' : 'Услуга')

  const list = useMemo(
    () => (tab === 'all' ? reviews : reviews.filter((r) => r.targetType === tab)),
    [reviews, tab],
  )

  return (
    <PublicShell
      title="Отзывы клиентов"
      subtitle="Реальные отзывы о материалах, мастерах и услугах RemontHub."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Отзывы' }]}
    >
      <section className="wrap sec-sm">
        <div className="rev-filter">
          {tabs.map((t) => (
            <button className={`chip chip-btn ${tab === t.key ? 'on' : ''}`} onClick={() => setTab(t.key)} key={t.key}>
              {t.label}
            </button>
          ))}
        </div>
        <ReviewsBlock reviews={list} labelFor={label} paginate />
      </section>

      <section className="sec-sm">
        <div className="wrap">
          <div className="callout">
            <div>
              <div className="eyebrow light">Готовы начать?</div>
              <h2>Материалы и мастера <em>в одном месте</em></h2>
              <p>Оставьте заявку — поможем с расчётом, выбором и ремонтом под ключ.</p>
            </div>
            <a className="btn btn-light" href="/request">Оставить заявку <span className="ico">→</span></a>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
