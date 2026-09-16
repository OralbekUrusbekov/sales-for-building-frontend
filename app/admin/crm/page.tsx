'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, ApiError } from '@/lib/admin/client'
import { AdminShell, AdminError } from '@/components/admin/AdminShell'

const money = (v: number) => new Intl.NumberFormat('ru-RU').format(Math.round(v || 0)) + ' ₸'

function relTime(iso: string) {
  const min = Math.round((Date.now() - +new Date(iso)) / 60000)
  if (min < 60) return `${Math.max(min, 0)} мин`
  if (min < 1440) return `${Math.round(min / 60)} ч`
  return `${Math.round(min / 1440)} дн`
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
}

type Deal = {
  id: number
  code: string
  client: string
  phone: string
  type: string
  amount: number
  stage: string
  manager: string
  source: string
  created_at: string
}
type Stage = { key: string; label: string; tone: string }
type Board = {
  columns: { stage: Stage; count: number; total: number; deals: Deal[] }[]
  managers: string[]
  open_total: number
  won_total: number
}

const NEW_DEAL = { client: '', phone: '', type: '', amount: 0 as number | string, stage: 'new', manager: '', source: 'phone', note: '' }

export default function CrmPage() {
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [dragId, setDragId] = useState<number | null>(null)
  const [overStage, setOverStage] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(NEW_DEAL)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      setBoard(await api<Board>('/crm/board'))
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const move = async (stage: string) => {
    setOverStage(null)
    const id = dragId
    setDragId(null)
    if (id == null || !board) return
    setBoard((b) => {
      if (!b) return b
      const moving = b.columns.flatMap((c) => c.deals).find((d) => d.id === id)
      const columns = b.columns.map((c) => {
        const deals = c.deals.filter((d) => d.id !== id)
        if (c.stage.key === stage && moving) deals.unshift({ ...moving, stage })
        return { ...c, deals, count: deals.length, total: deals.reduce((s, d) => s + d.amount, 0) }
      })
      return { ...b, columns }
    })
    try {
      await api(`/crm/${id}`, { method: 'PATCH', body: { stage } })
    } catch {
      load()
    }
  }

  const createDeal = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api('/crm', { method: 'POST', body: { ...form, amount: Number(form.amount) || 0 } })
      setCreating(false)
      setForm(NEW_DEAL)
      await load()
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Не удалось создать сделку')
    } finally {
      setSaving(false)
    }
  }

  const sub = useMemo(
    () =>
      board
        ? `${board.columns.reduce((s, c) => s + c.count, 0)} сделок · открытых на ${money(board.open_total)} · выиграно ${money(board.won_total)}`
        : '',
    [board],
  )

  return (
    <AdminShell
      title="CRM · Сделки"
      subtitle={sub}
      wide
      actions={
        <button className="crm-tool crm-tool-primary" onClick={() => setCreating(true)}>
          + Сделка
        </button>
      }
    >
      {err ? (
        <AdminError message={err} />
      ) : loading || !board ? (
        <div className="admin-panel" style={{ padding: 28 }}>Загрузка доски…</div>
      ) : (
        <div className="crm-board">
          {board.columns.map(({ stage, count, total, deals }) => (
            <div
              key={stage.key}
              className={`crm-col crm-tone-${stage.tone}${overStage === stage.key ? ' crm-col-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setOverStage(stage.key)
              }}
              onDragLeave={() => setOverStage((c) => (c === stage.key ? null : c))}
              onDrop={() => move(stage.key)}
            >
              <div className="crm-col-strip" />
              <div className="crm-col-head">
                <span className="crm-col-name">{stage.label}</span>
                <span className="crm-col-count">{count}</span>
                <span className="crm-col-sum">{money(total)}</span>
              </div>
              <div className="crm-col-body">
                {deals.map((d) => (
                  <article
                    key={d.id}
                    className={`crm-deal${dragId === d.id ? ' crm-deal-drag' : ''}`}
                    draggable
                    onDragStart={() => setDragId(d.id)}
                    onDragEnd={() => {
                      setDragId(null)
                      setOverStage(null)
                    }}
                  >
                    <div className="crm-deal-top">
                      <span className="crm-deal-id">{d.code}</span>
                      <span className="crm-deal-amount">{money(d.amount)}</span>
                    </div>
                    <p className="crm-deal-type">{d.type}</p>
                    <div className="crm-deal-foot">
                      <span className="crm-avatar" title={d.manager}>
                        {initials(d.client)}
                      </span>
                      <span className="crm-deal-client">{d.client}</span>
                      <span className="crm-deal-date">{relTime(d.created_at)}</span>
                    </div>
                  </article>
                ))}
                {deals.length === 0 && <div className="crm-col-empty">Перетащите сделку сюда</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <div className="admin-drawer-back" onClick={() => !saving && setCreating(false)}>
          <form className="admin-drawer" onClick={(e) => e.stopPropagation()} onSubmit={createDeal}>
            <div className="admin-drawer-head">
              <h2>Новая сделка</h2>
              <button type="button" className="modal-x" onClick={() => setCreating(false)}>
                ×
              </button>
            </div>
            <div className="admin-drawer-body">
              <div className="admin-field admin-field-wide">
                <label>Клиент *</label>
                <input className="admin-input" required value={form.client} onChange={(e) => setForm((s) => ({ ...s, client: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Телефон</label>
                <input className="admin-input" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Сумма, ₸</label>
                <input className="admin-input" type="number" value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} />
              </div>
              <div className="admin-field admin-field-wide">
                <label>Тип работ</label>
                <input className="admin-input" value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Этап</label>
                <select className="admin-input" value={form.stage} onChange={(e) => setForm((s) => ({ ...s, stage: e.target.value }))}>
                  {board?.columns.map((c) => (
                    <option key={c.stage.key} value={c.stage.key}>
                      {c.stage.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label>Менеджер</label>
                <select className="admin-input" value={form.manager} onChange={(e) => setForm((s) => ({ ...s, manager: e.target.value }))}>
                  <option value="">—</option>
                  {board?.managers.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label>Источник</label>
                <select className="admin-input" value={form.source} onChange={(e) => setForm((s) => ({ ...s, source: e.target.value }))}>
                  <option value="site">Сайт</option>
                  <option value="telegram">Telegram</option>
                  <option value="phone">Телефон</option>
                </select>
              </div>
              <div className="admin-field admin-field-wide">
                <label>Заметка</label>
                <textarea className="admin-input" rows={3} value={form.note} onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))} />
              </div>
            </div>
            <div className="admin-drawer-foot">
              <button type="button" className="btn btn-light btn-sm" onClick={() => setCreating(false)} disabled={saving}>
                Отмена
              </button>
              <button type="submit" className="btn btn-green btn-sm" disabled={saving}>
                {saving ? 'Сохранение…' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  )
}
