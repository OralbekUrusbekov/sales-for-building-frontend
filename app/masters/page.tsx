'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Master } from '@/types'
import { masters as mockMasters } from '@/lib/data/masters'
import { fetchMasters } from '@/lib/api/browser'
import { money } from '@/lib/remonthub-data'
import { PublicShell } from '@/components/public-shell'
import { FaqList } from '@/components/faq-list'
import { Stars, reviewsWord } from '@/components/stars'

const specs = ['Все', 'Сантехника', 'Плитка', 'Электромонтаж', 'Малярные', 'Отделка', 'Полы', 'Демонтаж', 'Дизайн']

export default function MastersPage() {
  const [masters, setMasters] = useState<Master[]>(mockMasters as Master[])
  const [spec, setSpec] = useState('Все')
  const [district, setDistrict] = useState('Все районы')
  const [verified, setVerified] = useState(false)
  const [rating, setRating] = useState('Все')
  const [sort, setSort] = useState('rating')

  useEffect(() => {
    fetchMasters().then((m) => m && setMasters(m))
  }, [])

  const districts = useMemo(
    () => ['Все районы', ...Array.from(new Set(masters.map((m) => m.district)))],
    [masters],
  )

  const list = useMemo(() => {
    const d = masters.filter(
      (m) =>
        (spec === 'Все' || m.specialty.some((s) => s.includes(spec))) &&
        (district === 'Все районы' || m.district === district) &&
        (!verified || m.verified) &&
        (rating === 'Все' || m.rating >= Number(rating)),
    )
    if (sort === 'rating') d.sort((a, b) => b.rating - a.rating)
    if (sort === 'rate') d.sort((a, b) => a.rate - b.rate)
    if (sort === 'jobs') d.sort((a, b) => b.jobs - a.jobs)
    return d
  }, [masters, spec, district, verified, rating, sort])

  return (
    <PublicShell
      title="Проверенные мастера Астаны"
      subtitle="Специалисты с портфолио, отзывами и понятной ставкой. Все данные и документы проверены."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Мастера' }]}
    >
      <section className="wrap catalog-layout">
        <aside className="filters">
          <strong>Найти специалиста</strong>
          <label>Специализация</label>
          {specs.map((s) => (
            <button className={spec === s ? 'on' : ''} onClick={() => setSpec(s)} key={s}>{s}</button>
          ))}
          <label>Район</label>
          <select className="select" value={district} onChange={(e) => setDistrict(e.target.value)}>
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
          <label>Рейтинг</label>
          <select className="select" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="Все">Любой</option>
            <option value="4.5">От 4.5 ★</option>
            <option value="4.8">От 4.8 ★</option>
          </select>
          <label className="check">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} /> Только проверенные
          </label>
        </aside>

        <div className="catalog-main">
          <div className="toolbar">
            <span className="count">Найдено: <b>{list.length}</b> специалистов</span>
            <select className="select" style={{ width: 180, marginLeft: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rating">По рейтингу</option>
              <option value="rate">По ставке</option>
              <option value="jobs">По опыту</option>
            </select>
          </div>
          <div className="mcard-grid">
            {list.map((m) => (
              <article className="mcard" key={m.id}>
                <div className="top">
                  <h3>{m.name}</h3>
                  {m.verified && <span className="verified">Проверен</span>}
                </div>
                <div className="chips">{m.specialty.map((s) => <span key={s}>{s}</span>)}</div>
                <div className="pcard-rating">
                  <Stars value={m.rating} size={13} />
                  <span>{m.rating.toFixed(1)} · {m.reviewCount} {reviewsWord(m.reviewCount)}</span>
                </div>
                <p>{m.district} район · {m.jobs} выполненных работ</p>
                <div className="rate">
                  <b>от {money(m.rate)}/час</b>
                  <Link className="btn btn-green btn-sm" href={`/masters/${m.id}`}>Профиль</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-cream">
        <div className="wrap">
          <div className="prose">
            <div className="block-head">
              <div className="eyebrow">Вопросы о мастерах</div>
              <h2>Как это работает</h2>
            </div>
            <FaqList
              items={[
                { q: 'Как вы проверяете мастеров?', a: 'Проверяем документы, опыт, портфолио и собираем отзывы реальных клиентов. Мастер с бейджем «Проверен» прошёл полную верификацию.' },
                { q: 'Что если мастер не подошёл?', a: 'Заменим специалиста бесплатно или вернём предоплату, если работы ещё не начались.' },
                { q: 'Кто отвечает за качество?', a: 'На работы, выполненные через RemontHub, действует гарантия 12 месяцев.' },
              ]}
            />
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
