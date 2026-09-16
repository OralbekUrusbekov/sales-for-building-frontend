'use client'
import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from '@/lib/admin/client'
import { AdminShell, AdminError } from '@/components/admin/AdminShell'

const money = (v: number) => new Intl.NumberFormat('ru-RU').format(Math.round(v || 0)) + ' ₸'

const STATUSES = [
  ['new', 'Новый'],
  ['confirmed', 'Подтверждён'],
  ['assembling', 'В сборке'],
  ['delivering', 'Доставка'],
  ['done', 'Выполнен'],
  ['cancelled', 'Отменён'],
] as const

export default function OrdersPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      const res = await api<any>('/orders?per_page=100')
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

  const setStatus = async (number: string, status: string) => {
    setRows((rs) => rs.map((r) => (r.number === number ? { ...r, status } : r)))
    try {
      await api(`/orders/${number}/status`, { method: 'PATCH', body: { status } })
    } catch {
      load()
    }
  }

  return (
    <AdminShell title="Заказы" subtitle="Заказы материалов с сайта">
      {err ? (
        <AdminError message={err} />
      ) : (
        <div className="admin-panel req-panel">
          <table className="req-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Позиции</th>
                <th>Сумма</th>
                <th>Доставка</th>
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
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="req-empty">
                    Заказов пока нет
                  </td>
                </tr>
              ) : (
                rows.map((o) => (
                  <tr key={o.number}>
                    <td className="req-id">{o.number}</td>
                    <td>
                      <strong>{o.customer_name}</strong>
                    </td>
                    <td className="req-phone">{o.phone}</td>
                    <td>{o.items?.length ?? 0} поз.</td>
                    <td className="req-amount">{money(o.total)}</td>
                    <td>{o.delivery === 'pickup' ? 'Самовывоз' : 'Доставка'}</td>
                    <td>
                      <select
                        className="ord-status-select"
                        value={o.status}
                        onChange={(e) => setStatus(o.number, e.target.value)}
                      >
                        {STATUSES.map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="req-date">{new Date(o.created_at).toLocaleDateString('ru-RU')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  )
}
