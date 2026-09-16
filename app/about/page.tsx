import Link from 'next/link'
import { PublicShell } from '@/components/public-shell'

const IMG = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`

export const metadata = { title: 'О компании — RemontHub' }

const principles: [string, string, string][] = [
  ['Прозрачная смета', 'Материалы и работы всегда разделены. Цена в договоре не меняется без вашего согласия.', '1503387762-592deb58ef4e'],
  ['Только проверенные', 'Каждый мастер проходит проверку документов, опыта и отзывов реальных клиентов.', '1581858726788-75bc0f6a952d'],
  ['Гарантия на результат', '12 месяцев на все работы. Возврат неиспользованных материалов в течение 14 дней.', '1600607687939-ce8a6c25118c'],
]

export default function AboutPage() {
  return (
    <PublicShell
      title="Помогаем ремонтировать с уверенностью"
      subtitle="RemontHub — это склад материалов, база проверенных мастеров и услуги под ключ в одном месте."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'О нас' }]}
    >
      <section className="wrap sec-sm">
        <div className="split">
          <div className="copy">
            <h2>От небольшого склада <em>до полного цикла</em></h2>
            <p>
              Мы начинали в 2012 году как склад стройматериалов в Астане. Клиенты постоянно спрашивали
              «а есть мастер?», и мы начали собирать базу проверенных специалистов. Сегодня RemontHub
              закрывает весь путь ремонта: от расчёта и покупки материалов до сдачи объекта под ключ.
            </p>
            <Link className="btn btn-dark" href="/services">Услуги под ключ <span className="ico">→</span></Link>
          </div>
          <img src={IMG('1600585154340-be6161a56a0c')} alt="Склад RemontHub" />
        </div>
      </section>

      {/* full-width photo band */}
      <section className="fullbleed">
        <img src={IMG('1503387762-592deb58ef4e', 2000)} alt="Объект RemontHub" />
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Наши <em>принципы</em></h2>
          </div>
          <div className="grid g-3">
            {principles.map(([t, d, img]) => (
              <article className="card" key={t} style={{ overflow: 'hidden' }}>
                <img src={IMG(img, 800)} alt="" style={{ width: '100%', height: 250, objectFit: 'cover' }} />
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 19 }}>{t}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>{d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-cream">
        <div className="wrap">
          <div className="sec-head">
            <h2>Склад и <em>шоурум</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gridAutoRows: 230, gap: 16 }}>
            <img src={IMG('1600585154340-be6161a56a0c')} alt="" style={{ gridRow: 'span 2', width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
            <img src={IMG('1595515106969-1ce29566ff1c', 800)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
            <img src={IMG('1584622650111-993a426fbf0a', 800)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
            <img src={IMG('1530124566582-a618bc2615dc', 1400)} alt="" style={{ gridColumn: '1 / -1', width: '100%', height: 260, objectFit: 'cover', borderRadius: 'var(--radius)' }} />
          </div>
        </div>
      </section>

      <section className="fullbleed callout-band">
        <div className="wrap">
          <h2>Готовы начать ремонт?</h2>
          <p>Материалы, мастера и смета — в одном месте. Оставьте заявку или откройте каталог.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-green" href="/request">Оставить заявку <span className="ico">→</span></Link>
            <Link className="btn btn-light" href="/catalog">Открыть каталог</Link>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
