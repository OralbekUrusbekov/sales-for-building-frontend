'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AccountShell } from '@/components/account-shell'
import { useAuth, authFetch } from '@/lib/auth'

type Order = {
  number: string
  status: string
  total: number
  items: { name: string; quantity: number }[]
  created_at: string
}

const STATUS_RU: Record<string, string> = {
  new: 'Новый',
  processing: 'В сборке',
  shipped: 'В доставке',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

function plural(n: number, [a, b, c]: [string, string, string]) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return a
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return b
  return c
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!user) return
    authFetch<Order[]>('/orders/mine')
      .then(setOrders)
      .catch((e) => setErr(e instanceof Error ? e.message : 'Не удалось загрузить заказы'))
  }, [user])

  return (
    <AccountShell title="Мои заказы">
      {err && <p className="auth-err">{err}</p>}
      {orders && orders.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>
          Заказов пока нет. <Link href="/catalog" style={{ color: 'var(--green-dark)' }}>Перейти в каталог →</Link>
        </p>
      )}
      {!orders && !err && <p style={{ color: 'var(--muted)' }}>Загрузка…</p>}
      <div className="grid" style={{ gap: 12 }}>
        {orders?.map((o) => {
          const count = o.items.reduce((n, i) => n + i.quantity, 0)
          return (
            <article
              className="card"
              style={{ padding: 22, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}
              key={o.number}
            >
              <div>
                <div className="tag" style={{ marginBottom: 8 }}>{STATUS_RU[o.status] ?? o.status}</div>
                <h3 style={{ margin: 0, fontSize: 17 }}>Заказ №{o.number}</h3>
                <small style={{ color: 'var(--muted)' }}>
                  {count} {plural(count, ['позиция', 'позиции', 'позиций'])} ·{' '}
                  {new Date(o.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                </small>
              </div>
              <strong style={{ fontSize: 18, alignSelf: 'center' }}>{o.total.toLocaleString('ru-RU')} ₸</strong>
            </article>
          )
        })}
      </div>
    </AccountShell>
  )
}
