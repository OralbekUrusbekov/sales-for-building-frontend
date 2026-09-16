import Link from 'next/link'
import { money, faqServices } from '@/lib/remonthub-data'
import { getServices } from '@/lib/api/public'
import { PublicShell } from '@/components/public-shell'
import { FaqList } from '@/components/faq-list'
import { LeadForm } from '@/components/lead-form'

export const metadata = { title: 'Услуги под ключ — RemontHub' }

export default async function ServicesPage() {
  const services = await getServices()
  return (
    <PublicShell
      title="Ремонт и работы под ключ"
      subtitle="Один договор, дизайн-смета, материалы, бригада и прораб. Вы принимаете готовый результат."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Услуги' }]}
    >
      <section className="wrap sec-sm">
        <div className="grid g-3">
          {services.map((s) => (
            <Link className="scard" href={`/services/${s.slug}`} key={s.id}>
              <img src={s.image} alt={s.name} />
              <div className="scard-body">
                <span className="dur">{s.duration}</span>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <b>от {money(s.priceFrom)}</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="eyebrow">Как мы работаем</div>
          <h2 style={{ margin: '8px 0 28px', fontSize: 'clamp(22px,2.8vw,32px)' }}>5 этапов <em>без сюрпризов</em></h2>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            {['Заявка и замер', 'Смета и договор', 'Черновые работы', 'Чистовая отделка', 'Приёмка и гарантия'].map((s, i) => (
              <div key={s}><div className="n">0{i + 1}</div><h3>{s}</h3></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-cream">
        <div className="wrap grid g-2" style={{ alignItems: 'start', gap: 50 }}>
          <div>
            <div className="eyebrow">Частые вопросы</div>
            <h2 style={{ margin: '8px 0 24px', fontSize: 'clamp(24px,3vw,34px)' }}>Об услугах под ключ</h2>
            <FaqList items={faqServices} />
          </div>
          <div id="request">
            <div className="eyebrow">Заявка на расчёт</div>
            <h2 style={{ margin: '8px 0 18px', fontSize: 'clamp(24px,3vw,34px)' }}>Получить смету</h2>
            <LeadForm
              compact
              successText="Заявка принята. Согласуем время бесплатного замера."
              fields={[
                { name: 'name', label: 'Имя', required: true },
                { name: 'phone', label: 'Телефон', type: 'tel', required: true },
                { name: 'obj', label: 'Что нужно сделать', type: 'textarea', placeholder: 'Тип помещения, площадь, объём работ' },
              ]}
            />
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
