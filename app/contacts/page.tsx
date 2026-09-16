import { PublicShell } from '@/components/public-shell'
import { LeadForm } from '@/components/lead-form'
import { getSettings } from '@/lib/api/public'

export const metadata = { title: 'Контакты и доставка — RemontHub' }

function embedUrl(mapLink: string) {
  const m = mapLink.match(/mlat=([\d.]+).*?mlon=([\d.]+)/)
  const lat = m ? Number(m[1]) : 51.1801
  const lon = m ? Number(m[2]) : 71.446
  const bbox = `${lon - 0.012}%2C${lat - 0.008}%2C${lon + 0.012}%2C${lat + 0.008}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
}

export default async function ContactsPage() {
  const { contact } = await getSettings()
  const mapLink = contact.map_link

  return (
    <PublicShell
      eyebrow="Будем на связи"
      title="Контакты"
      subtitle="Приезжайте на склад, звоните или оставьте сообщение — ответим в течение рабочего дня."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]}
    >
      <section className="wrap contacts-layout">
        <div className="contacts-info">
          <h2>{contact.address}</h2>
          <p>
            {contact.hours}
            <br />
            <a href={contact.phone_href}>{contact.phone}</a>
            <br />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <LeadForm
            compact
            submitLabel="Написать нам"
            successText="Сообщение отправлено. Ответим на указанный контакт."
            fields={[
              { name: 'name', label: 'Ваше имя', required: true },
              { name: 'contact', label: 'Телефон или email', required: true },
              { name: 'msg', label: 'Сообщение', type: 'textarea' },
            ]}
          />
        </div>

        <div className="map-embed">
          <iframe
            src={embedUrl(mapLink)}
            title="Карта — RemontHub"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className="map-cap" href={mapLink} target="_blank" rel="noreferrer">
            <b>Склад и офис RemontHub</b>
            <span>{contact.address} · открыть в OpenStreetMap →</span>
          </a>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 70 }}>
        <div className="grid g-4">
          <div className="card" style={{ padding: 18 }}>
            <b>Доставка</b>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>
              По Астане 1–2 дня, от 2 500 ₸. Подъём на этаж.
            </p>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <b>Самовывоз</b>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>
              Со склада — в день заказа.
            </p>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <b>Оплата</b>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>
              Kaspi, карта, наличные, безнал для юрлиц.
            </p>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <b>Возврат</b>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>
              14 дней для неиспользованных товаров.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
