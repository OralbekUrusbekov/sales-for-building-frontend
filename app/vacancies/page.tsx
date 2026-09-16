'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Repeat, TrendingUp, Wallet, Wrench } from 'lucide-react'
import type { Vacancy } from '@/types'
import { vacancies as mockVacancies } from '@/lib/data/vacancies'
import { fetchVacancies } from '@/lib/api/browser'
import { money } from '@/lib/remonthub-data'
import { PublicShell } from '@/components/public-shell'

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>(mockVacancies as Vacancy[])
  const [emp, setEmp] = useState('Все')

  useEffect(() => {
    fetchVacancies().then((v) => v && setVacancies(v))
  }, [])

  const emps = useMemo(
    () => ['Все', ...Array.from(new Set(vacancies.map((v) => v.employment)))],
    [vacancies],
  )
  const list = useMemo(
    () => vacancies.filter((v) => emp === 'Все' || v.employment === emp),
    [vacancies, emp],
  )

  return (
    <PublicShell
      eyebrow="Вакансии"
      title="Работа в RemontHub"
      subtitle="Ищем мастеров и специалистов в команду. Стабильный поток объектов и честная оплата."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Вакансии' }]}
    >
      <section className="sec-sm">
        <div className="wrap">
          <div className="trust">
            <div><Repeat size={22} strokeWidth={1.5} /><div><b>Постоянные объекты</b><span>без простоев</span></div></div>
            <div><Wallet size={22} strokeWidth={1.5} /><div><b>Оплата 2 раза в месяц</b><span>по актам, без задержек</span></div></div>
            <div><Wrench size={22} strokeWidth={1.5} /><div><b>Инструмент и логистика</b><span>частично за счёт компании</span></div></div>
            <div><TrendingUp size={22} strokeWidth={1.5} /><div><b>Рост до бригадира</b><span>и руководителя участка</span></div></div>
          </div>
        </div>
      </section>

      <section className="wrap sec-sm" style={{ paddingTop: 0 }}>
        <div className="rev-filter">
          {emps.map((e) => (
            <button className={`chip chip-btn ${emp === e ? 'on' : ''}`} onClick={() => setEmp(e)} key={e}>{e}</button>
          ))}
        </div>
        <div className="grid" style={{ gap: 14 }}>
          {list.map((v) => (
            <article className="vacancy-row card" key={v.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'center', padding: 26 }}>
              <div>
                <small style={{ color: 'var(--green-dark)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  {v.city} · {v.employment}
                </small>
                <h3 style={{ margin: '6px 0', fontSize: 18 }}>{v.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 8px' }}>{v.short}</p>
                <b>{money(v.salaryFrom)} – {money(v.salaryTo)}</b>
              </div>
              <Link className="btn btn-green btn-sm" href={`/vacancies/${v.id}`}>Подробнее <span className="ico">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="sec sec-cream">
        <div className="wrap">
          <div className="eyebrow">Как проходит найм</div>
          <h2 style={{ margin: '8px 0 40px' }}>4 шага до <em>первого объекта</em></h2>
          <div className="steps-grid">
            <div><div className="n">01</div><h3>Отклик</h3><p>Заполните форму — займёт 2 минуты.</p></div>
            <div><div className="n">02</div><h3>Звонок HR</h3><p>Обсудим опыт, график и ожидания по оплате.</p></div>
            <div><div className="n">03</div><h3>Тестовый объект</h3><p>Небольшая работа, чтобы оценить качество.</p></div>
            <div><div className="n">04</div><h3>Договор</h3><p>Стабильный поток заявок и оплата по актам.</p></div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap grid g-2" style={{ alignItems: 'center', gap: 50 }}>
          <div>
            <div className="eyebrow">Почему у нас</div>
            <h2 style={{ margin: '8px 0 16px' }}>Работа без хаоса</h2>
            <ul className="check-list">
              <li>Заявки распределяет менеджер — не нужно искать клиентов</li>
              <li>Материалы и логистика организованы, вы занимаетесь работой</li>
              <li>Прозрачные акты и оплата два раза в месяц</li>
              <li>Поддержка прораба и помощь на сложных объектах</li>
            </ul>
          </div>
          <img
            src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=75"
            alt="Команда RemontHub"
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
          />
        </div>
      </section>
    </PublicShell>
  )
}
