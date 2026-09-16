import { notFound } from 'next/navigation'
import { money } from '@/lib/remonthub-data'
import { getVacancy } from '@/lib/api/public'
import { PublicShell } from '@/components/public-shell'
import { LeadForm } from '@/components/lead-form'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const v = await getVacancy(id)
  return { title: v ? `${v.title} — вакансия · RemontHub` : 'Вакансия не найдена' }
}

export default async function VacancyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const v = await getVacancy(id)
  if (!v) notFound()

  return (
    <PublicShell
      eyebrow="Вакансия"
      title={v.title}
      subtitle={`${v.city} · ${v.employment} · ${money(v.salaryFrom)} – ${money(v.salaryTo)}`}
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Вакансии', href: '/vacancies' }, { label: v.title }]}
    >
      <section className="wrap pdp" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        <div>
          <p style={{ color: 'var(--muted)' }}>{v.short}</p>
          <h3 style={{ fontSize: 16, marginTop: 24 }}>Обязанности</h3>
          <ul className="check-list">{v.responsibilities.map((x) => <li key={x}>{x}</li>)}</ul>
          <h3 style={{ fontSize: 16 }}>Требования</h3>
          <ul className="check-list">{v.requirements.map((x) => <li key={x}>{x}</li>)}</ul>
          <h3 style={{ fontSize: 16 }}>Условия</h3>
          <ul className="check-list">{v.conditions.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <LeadForm
          compact
          submitLabel="Отправить отклик"
          successText="Отклик отправлен. HR свяжется с вами в течение 1–2 дней."
          fields={[
            { name: 'name', label: 'Имя и фамилия', required: true },
            { name: 'phone', label: 'Телефон', type: 'tel', required: true },
            { name: 'exp', label: 'Опыт работы', placeholder: 'Например, 5 лет' },
            { name: 'msg', label: 'Сообщение', type: 'textarea', placeholder: 'Коротко о себе и портфолио' },
          ]}
        />
      </section>
    </PublicShell>
  )
}
