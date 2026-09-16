import { PublicShell } from '@/components/public-shell'
import { FaqList } from '@/components/faq-list'
import { LeadForm } from '@/components/lead-form'
import { faqGeneral } from '@/lib/remonthub-data'
import { getSettings } from '@/lib/api/public'

export const metadata = { title: 'Служба поддержки — RemontHub' }

export default async function SupportPage() {
  const { contact } = await getSettings()
  return (
    <PublicShell
      eyebrow="Мы на связи"
      title="Служба поддержки"
      subtitle="Отвечаем в течение рабочего дня. Срочные вопросы — по телефону или в WhatsApp."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Поддержка' }]}
    >
      <section className="wrap sec-sm">
        <div className="grid g-3" style={{ marginBottom: 40 }}>
          <a className="card" href={contact.phone_href} style={{ padding: 24 }}>
            <b>Позвонить</b>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '6px 0 0' }}>{contact.phone} · {contact.hours}</p>
          </a>
          <a className="card" href={contact.whatsapp} target="_blank" rel="noreferrer" style={{ padding: 24 }}>
            <b>WhatsApp</b>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '6px 0 0' }}>Быстрые ответы по заказу и доставке</p>
          </a>
          <a className="card" href={`mailto:${contact.email}`} style={{ padding: 24 }}>
            <b>Написать на почту</b>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '6px 0 0' }}>{contact.email}</p>
          </a>
        </div>

        <div className="grid g-2" style={{ alignItems: 'start', gap: 50 }}>
          <div>
            <div className="eyebrow">Частые вопросы</div>
            <h2 style={{ margin: '8px 0 24px', fontSize: 'clamp(24px,3vw,34px)' }}>Ответы за минуту</h2>
            <FaqList items={faqGeneral} />
          </div>
          <div>
            <div className="eyebrow">Не нашли ответ?</div>
            <h2 style={{ margin: '8px 0 18px', fontSize: 'clamp(24px,3vw,34px)' }}>Создать обращение</h2>
            <LeadForm
              compact
              submitLabel="Создать обращение"
              successText="Обращение №RH-8842 создано. Ответим на указанный контакт."
              fields={[
                { name: 'name', label: 'Ваше имя', required: true },
                { name: 'contact', label: 'Телефон или email', required: true },
                { name: 'order', label: 'Номер заказа (если есть)' },
                { name: 'msg', label: 'Опишите вопрос', type: 'textarea', required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
