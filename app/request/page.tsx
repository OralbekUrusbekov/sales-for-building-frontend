import { PublicShell } from '@/components/public-shell'
import { LeadForm } from '@/components/lead-form'

export const metadata = { title: 'Оставить заявку — RemontHub' }

export default function RequestPage() {
  return (
    <PublicShell
      eyebrow="Заявка под ключ"
      title="Расскажите о проекте"
      subtitle="Материалы, мастер или ремонт под ключ — подберём решение под вашу задачу и бюджет."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Заявка' }]}
    >
      <section className="wrap sec-sm">
        <div className="grid g-2" style={{ alignItems: 'start', gap: 50 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(22px,2.6vw,30px)' }}>Что дальше</h2>
            <ul className="check-list">
              <li>Менеджер перезвонит в течение рабочего дня</li>
              <li>Уточнит детали и предложит варианты</li>
              <li>Для работ — назначим бесплатный замер</li>
              <li>Вы получите смету: материалы и работы отдельно</li>
            </ul>
            <div className="card" style={{ padding: 20, marginTop: 16 }}>
              <b>Срочно?</b>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: '6px 0 0' }}>
                Звоните +7 700 123 45 67 или пишите в WhatsApp — ответим быстрее.
              </p>
            </div>
          </div>
          <LeadForm
            compact
            fields={[
              { name: 'name', label: 'Имя', placeholder: 'Как к вам обращаться?', required: true },
              { name: 'phone', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
              { name: 'type', label: 'Что нужно?', placeholder: 'Материалы / мастер / ремонт под ключ' },
              { name: 'msg', label: 'Опишите проект', type: 'textarea', placeholder: 'Тип помещения, площадь, сроки, бюджет' },
            ]}
          />
        </div>
      </section>
    </PublicShell>
  )
}
