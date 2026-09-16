'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, ApiError } from '@/lib/admin/client'
import { AdminShell, AdminError } from '@/components/admin/AdminShell'

type Lead = {
  id: number
  number: string
  kind: string
  source: string
  name: string
  phone: string
  message: string
  status: string
  created_at: string
}

const KIND_LABEL: Record<string, string> = {
  materials: 'Материалы',
  master: 'Мастер',
  service: 'Услуга',
  turnkey: 'Под ключ',
  calculator: 'Калькулятор',
  support: 'Поддержка',
  other: 'Другое',
}
const SOURCE_LABEL: Record<string, string> = { site: 'Сайт', telegram: 'Telegram', phone: 'Телефон' }
const STATUS = [
  ['new', 'Новая'],
  ['in_progress', 'В работе'],
  ['done', 'Обработана'],
  ['spam', 'Спам'],
] as const
const STATUS_LABEL = Object.fromEntries(STATUS)

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'site', label: 'Сайт' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'phone', label: 'Телефон' },
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function RequestsPage() {
  const [rows, setRows] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [source, setSource] = useState('all')
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      const res = await api<{ items: Lead[] }>('/leads?per_page=200')
      setRows(res.items)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setStatus = async (id: number, status: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)))
    try {
      await api(`/leads/${id}/status`, { method: 'PATCH', body: { status } })
    } catch {
      load()
    }
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return rows
      .filter((r) => source === 'all' || r.source === source)
      .filter(
        (r) =>
          !needle ||
          r.name.toLowerCase().includes(needle) ||
          r.phone.toLowerCase().includes(needle) ||
          r.number.toLowerCase().includes(needle) ||
          r.message.toLowerCase().includes(needle),
      )
  }, [rows, source, q])

  return (
    <AdminShell title="Заявки" subtitle={`${filtered.length} из ${rows.length} заявок`}>
      {err ? (
        <AdminError message={err} />
      ) : (
        <>
          <div className="req-bar">
            <div className="req-chips">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`req-chip${source === f.key ? ' req-chip-on' : ''}`}
                  onClick={() => setSource(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <input
              className="crm-search"
              placeholder="Поиск по имени, телефону, тексту…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="admin-panel req-panel">
            <table className="req-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Клиент</th>
                  <th>Телефон</th>
                  <th>Тип</th>
                  <th>Источник</th>
                  <th>Комментарий</th>
                  <th>Статус</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="req-empty">
                      Загрузка…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="req-empty">
                      Ничего не найдено
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d.id}>
                      <td className="req-id">{d.number}</td>
                      <td>
                        <strong>{d.name || '—'}</strong>
                      </td>
                      <td className="req-phone">{d.phone || '—'}</td>
                      <td>{KIND_LABEL[d.kind] ?? d.kind}</td>
                      <td>
                        <span className={`req-src req-src-${d.source}`}>{SOURCE_LABEL[d.source]}</span>
                      </td>
                      <td style={{ maxWidth: 280, whiteSpace: 'normal', color: '#6b6b6b' }}>
                        {d.message ? (d.message.length > 90 ? d.message.slice(0, 90) + '…' : d.message) : '—'}
                      </td>
                      <td>
                        <select
                          className={`ord-status-select req-status-${d.status === 'new' ? 'new' : d.status === 'done' ? 'done' : d.status === 'spam' ? 'lost' : 'inwork'}`}
                          value={d.status}
                          onChange={(e) => setStatus(d.id, e.target.value)}
                        >
                          {STATUS.map(([v]) => (
                            <option key={v} value={v}>
                              {STATUS_LABEL[v]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="req-date">{fmtDate(d.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  )
}
