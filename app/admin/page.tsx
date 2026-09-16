'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/admin/client'
import { AdminShell, AdminError } from '@/components/admin/AdminShell'

const money = (v: number) => new Intl.NumberFormat('ru-RU').format(Math.round(v || 0)) + ' ₸'

type Dash = {
  leads_new: number
  leads_total: number
  orders_new: number
  orders_total: number
  revenue_done: number
  deals_open: number
  deals_pipeline: number
  reviews_pending: number
  products: number
  masters: number
}
type Lead = { id: number; number: string; name: string; kind: string; source: string; created_at: string; status: string }

const KIND_LABEL: Record<string, string> = {
  materials: 'Материалы', master: 'Мастер', service: 'Услуга', turnkey: 'Под ключ',
  calculator: 'Калькулятор', support: 'Поддержка', other: 'Заявка',
}

export default function AdminHome() {
  const [dash, setDash] = useState<Dash | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [err, setErr] = useState('')

  useEffect(() => {
    Promise.all([api<Dash>('/admin/dashboard'), api<{ items: Lead[] }>('/leads?per_page=6')])
      .then(([d, l]) => {
        setDash(d)
        setLeads(l.items)
      })
      .catch((e) => setErr(e.message || 'Ошибка загрузки'))
  }, [])

  const kpis = dash
    ? [
        ['Новые заявки', String(dash.leads_new), `${dash.leads_total} всего`],
        ['Новые заказы', String(dash.orders_new), `${dash.orders_total} всего`],
        ['Выручка (выполнено)', money(dash.revenue_done), `${dash.orders_total} заказов`],
        ['Открытые сделки', String(dash.deals_open), `на ${money(dash.deals_pipeline)}`],
        ['Отзывы на модерации', String(dash.reviews_pending), 'ожидают проверки'],
        ['Товаров в каталоге', String(dash.products), `${dash.masters} мастеров`],
      ]
    : []

  return (
    <AdminShell title="Обзор" subtitle="Панель управления RemontHub">
      {err ? (
        <AdminError message={err} />
      ) : !dash ? (
        <div className="admin-panel" style={{ padding: 28 }}>Загрузка…</div>
      ) : (
        <>
          <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {kpis.map(([label, value, sub]) => (
              <div className="kpi" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small style={{ color: '#8a857c' }}>{sub}</small>
              </div>
            ))}
          </div>

          <div className="admin-panels" style={{ gridTemplateColumns: '1fr' }}>
            <section className="admin-panel">
              <div className="panel-heading">
                <div>
                  <small>ПОСЛЕДНЕЕ</small>
                  <h2>Свежие заявки</h2>
                </div>
                <Link href="/admin/requests">Все заявки →</Link>
              </div>
              <div className="request-list">
                {leads.length === 0 && <p style={{ color: '#9a948a', fontSize: 13 }}>Заявок пока нет</p>}
                {leads.map((l) => (
                  <div className="request-row" key={l.id}>
                    <span className="request-id">{l.number}</span>
                    <div>
                      <strong>{l.name || '—'}</strong>
                      <small>
                        {KIND_LABEL[l.kind] ?? l.kind} · {l.source}
                      </small>
                    </div>
                    <span className={`status status-${l.status === 'new' ? 'Новая' : ''}`}>
                      {l.status === 'new' ? 'Новая' : l.status}
                    </span>
                    <small>{new Date(l.created_at).toLocaleDateString('ru-RU')}</small>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </AdminShell>
  )
}
