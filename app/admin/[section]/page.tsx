'use client'
import { use } from 'react'
import { notFound } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'

const labels: Record<string, string> = {
  equipment: 'Оборудование',
  reports: 'Отчёты',
  support: 'Поддержка',
  clients: 'Клиенты',
  users: 'Пользователи',
  notifications: 'Уведомления',
  telegram: 'Telegram-бот',
}

const hint: Record<string, string> = {
  equipment: 'Учёт инструмента и техники на объектах — выдача, возврат, ТО.',
  reports: 'Выручка, воронка продаж, конверсия заявок и загрузка мастеров.',
  support: 'Тикеты клиентов из чата, почты и Telegram в одной очереди.',
  clients: 'База клиентов: история заказов, заявок и обращений.',
  users: 'Сотрудники и роли: администраторы, менеджеры, прорабы.',
  notifications: 'Лента событий: новые заявки, заказы и отзывы на модерации.',
  telegram: 'Настройки бота: токен, приветствие, маршрутизация заявок.',
}

export default function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params)
  if (!labels[section]) notFound()

  return (
    <AdminShell title={labels[section]} subtitle="Раздел в разработке">
      <section className="admin-panel" style={{ padding: 30, minHeight: 200 }}>
        <p style={{ maxWidth: 460, color: '#6b6b6b', fontSize: 14, lineHeight: 1.7 }}>{hint[section]}</p>
        <p style={{ marginTop: 14, color: '#9a948a', fontSize: 13 }}>
          Управление каталогом, услугами, мастерами, вакансиями и статьями уже доступно в
          соответствующих разделах меню.
        </p>
      </section>
    </AdminShell>
  )
}
