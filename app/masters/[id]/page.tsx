import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CreditCard, FileText, ShieldCheck } from 'lucide-react'
import { money } from '@/lib/remonthub-data'
import { getMaster, getReviews } from '@/lib/api/public'
import { PublicShell } from '@/components/public-shell'
import { ReviewsBlock } from '@/components/reviews-block'
import { LeadForm } from '@/components/lead-form'
import { Stars, reviewsWord } from '@/components/stars'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const m = await getMaster(id)
  return { title: m ? `${m.name} — мастер · RemontHub` : 'Мастер не найден' }
}

export default async function MasterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const master = await getMaster(id)
  if (!master) notFound()
  const reviews = await getReviews('master', master.id)
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : master.rating

  return (
    <PublicShell
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Мастера', href: '/masters' }, { label: master.name }]}
    >
      <section className="wrap pdp">
        <div>
          <div className="portfolio-grid portfolio-grid-lead">
            {master.portfolio.map((src, i) => <img key={i} src={src} alt={`Работа ${i + 1}`} />)}
          </div>
        </div>

        <div className="pdp-info">
          {master.verified && <div className="tag" style={{ marginBottom: 10 }}>✓ Проверенный мастер</div>}
          <h1>{master.name}</h1>
          <div className="pdp-rating">
            <Stars value={avg} size={16} />
            <a>{avg.toFixed(1)} · {reviews.length || master.reviewCount} {reviewsWord(reviews.length || master.reviewCount)}</a>
          </div>
          <div className="chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' }}>
            {master.specialty.map((s) => <span className="chip" key={s}>{s}</span>)}
          </div>
          <p style={{ color: 'var(--muted)' }}>{master.bio}</p>

          <div className="master-stats">
            <div><strong>{master.jobs}</strong><span>выполнено работ</span></div>
            <div><strong>{avg.toFixed(1)}</strong><span>средняя оценка</span></div>
            <div><strong>{money(master.rate)}</strong><span>ставка / час</span></div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            {master.city}, {master.district} район · {master.available ? 'Свободен для заказов' : 'Занят до конца месяца'}
          </p>

          <div className="pdp-usp">
            <div><FileText size={17} strokeWidth={1.6} /> Работаем по договору с фиксированной сметой</div>
            <div><ShieldCheck size={17} strokeWidth={1.6} /> Гарантия на работы — 12 месяцев</div>
            <div><CreditCard size={17} strokeWidth={1.6} /> Оплата по этапам после приёмки</div>
          </div>
          <Link className="btn btn-green" href="#request">Запросить мастера <span className="ico">→</span></Link>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><h2>Отзывы <em>клиентов</em></h2></div>
          <ReviewsBlock reviews={reviews} showForm={false} />
        </div>
      </section>

      <section className="sec sec-cream" id="request">
        <div className="wrap grid g-2" style={{ alignItems: 'start', gap: 50 }}>
          <div>
            <div className="eyebrow">Заявка</div>
            <h2 style={{ margin: '8px 0 14px', fontSize: 'clamp(24px,3vw,34px)' }}>Запросить {master.name.split(' ')[0]}</h2>
            <p style={{ color: 'var(--muted)' }}>
              Оставьте контакты и опишите задачу — согласуем время выезда на замер. Замер и смета бесплатны.
            </p>
          </div>
          <LeadForm
            compact
            successText={`Заявка на мастера принята. ${master.name.split(' ')[0]} или менеджер свяжется с вами.`}
            fields={[
              { name: 'name', label: 'Ваше имя', required: true },
              { name: 'phone', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
              { name: 'task', label: 'Задача', type: 'textarea', placeholder: 'Что нужно сделать, адрес, сроки' },
            ]}
          />
        </div>
      </section>
    </PublicShell>
  )
}
