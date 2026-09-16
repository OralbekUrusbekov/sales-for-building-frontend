import Link from 'next/link'
import { notFound } from 'next/navigation'
import { money } from '@/lib/remonthub-data'
import { getReviews, getService, getServices } from '@/lib/api/public'
import { PublicShell } from '@/components/public-shell'
import { ReviewsBlock } from '@/components/reviews-block'
import { LeadForm } from '@/components/lead-form'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await getService(slug)
  return { title: s ? `${s.name} — RemontHub` : 'Услуга не найдена' }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()
  const [reviews, allServices] = await Promise.all([getReviews('service', slug), getServices()])
  const others = allServices.filter((s) => s.slug !== slug).slice(0, 3)

  return (
    <PublicShell
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Услуги', href: '/services' }, { label: service.name }]}
    >
      <section className="wrap pdp">
        <img className="gallery-main" src={service.image} alt={service.name} />
        <div className="pdp-info">
          <div className="tag" style={{ marginBottom: 10 }}>{service.duration}</div>
          <h1>{service.name}</h1>
          <p style={{ color: 'var(--muted)' }}>{service.description}</p>
          <div className="pdp-price">
            <b>от {money(service.priceFrom)}</b>
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>за м² / объект</span>
          </div>
          <h3 style={{ fontSize: 16 }}>Что входит</h3>
          <ul className="check-list">
            {service.includes.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <Link className="btn btn-green" href="#request">Заказать под ключ <span className="ico">→</span></Link>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(22px,2.8vw,32px)' }}>Как проходит проект</h2>
          <div className="steps-grid" style={{ gridTemplateColumns: `repeat(${service.steps.length},1fr)` }}>
            {service.steps.map((x, i) => (
              <div key={x}><div className="n">0{i + 1}</div><h3>{x}</h3><p>Согласуем детали и держим вас в курсе.</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Наши <em>работы</em></h2>
            <Link className="sec-link" href="/reviews">Отзывы клиентов →</Link>
          </div>
          <div className="works-grid">
            {service.gallery.map((src, i) => (
              <img key={i} src={src} alt={`${service.name} — работа ${i + 1}`} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="sec sec-cream">
          <div className="wrap">
            <div className="sec-head"><h2>Отзывы <em>об услуге</em></h2></div>
            <ReviewsBlock reviews={reviews} showForm={false} />
          </div>
        </section>
      )}

      <section className="sec" id="request">
        <div className="wrap grid g-2" style={{ alignItems: 'start', gap: 50 }}>
          <div>
            <div className="eyebrow">Заявка</div>
            <h2 style={{ margin: '8px 0 14px', fontSize: 'clamp(24px,3vw,34px)' }}>Заказать «{service.name}»</h2>
            <p style={{ color: 'var(--muted)' }}>Оставьте контакты — приедем на бесплатный замер и подготовим детальную смету.</p>
            <div style={{ marginTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Другие услуги</div>
              {others.map((o) => (
                <div key={o.id} style={{ marginBottom: 6 }}>
                  <Link href={`/services/${o.slug}`} style={{ color: 'var(--green-dark)', fontSize: 14 }}>{o.name} — от {money(o.priceFrom)}</Link>
                </div>
              ))}
            </div>
          </div>
          <LeadForm
            compact
            successText="Заявка принята. Согласуем время бесплатного замера."
            fields={[
              { name: 'name', label: 'Имя', required: true },
              { name: 'phone', label: 'Телефон', type: 'tel', required: true },
              { name: 'obj', label: 'Комментарий', type: 'textarea', placeholder: 'Площадь, адрес, пожелания' },
            ]}
          />
        </div>
      </section>
    </PublicShell>
  )
}
