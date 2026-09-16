'use client'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { api, ApiError, uploadImage } from '@/lib/admin/client'
import { AdminShell, AdminError } from './AdminShell'

export type FieldType =
  | 'text'
  | 'slug'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'lines'
  | 'pairs'
  | 'image'
  | 'images'
  | 'date'

export type Field = {
  name: string
  label: string
  type?: FieldType
  required?: boolean
  nullable?: boolean
  default?: unknown
  help?: string
  wide?: boolean
  options?: { value: string | number; label: string }[]
  optionsFrom?: { endpoint: string; value: string; label: string }
  min?: number
  max?: number
}

export type Column = {
  key: string
  label: string
  render?: (row: any) => React.ReactNode
  width?: number
}

export type Filter = {
  name: string
  label: string
  options?: { value: string | number; label: string }[]
  optionsFrom?: { endpoint: string; value: string; label: string }
}

export type ResourceConfig = {
  title: string
  subtitle?: string
  singular: string
  endpoint: string
  paged?: boolean
  search?: boolean
  filters?: Filter[]
  groupBy?: (row: any) => string
  columns: Column[]
  fields: Field[]
  toForm?: (row: any) => Record<string, any>
}

const emptyFor = (f: Field) => {
  switch (f.type) {
    case 'checkbox':
      return false
    case 'number':
      return ''
    case 'lines':
    case 'images':
    case 'pairs':
      return []
    default:
      return ''
  }
}

function toPayload(fields: Field[], values: Record<string, any>) {
  const out: Record<string, any> = {}
  for (const f of fields) {
    let v = values[f.name]
    if (f.type === 'number') {
      if (v === '' || v === null || v === undefined) {
        if (f.nullable) v = null
        else continue // omit -> let the API apply its default / keep existing
      } else v = Number(v)
    }
    if (f.type === 'lines' || f.type === 'images') {
      v = Array.isArray(v) ? v : String(v || '').split('\n').map((s) => s.trim()).filter(Boolean)
    }
    if (f.type === 'pairs') {
      v = (Array.isArray(v) ? v : []).filter((p: any) => p.label || p.value)
    }
    if (f.type === 'select' && v !== '' && v !== null && v !== undefined && !Number.isNaN(Number(v))) {
      // keep numeric ids numeric
      v = /^\d+$/.test(String(v)) ? Number(v) : v
    }
    if (v === '' && (f.type === 'select' || f.type === 'date')) continue
    out[f.name] = v
  }
  return out
}

// ─── Field editors ────────────────────────────────────────
function UploadButton({
  multiple,
  onUploaded,
  children,
}: {
  multiple?: boolean
  onUploaded: (urls: string[]) => void
  children: React.ReactNode
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    setErr('')
    setBusy(true)
    try {
      const urls: string[] = []
      for (const f of files) urls.push(await uploadImage(f))
      onUploaded(urls)
    } catch (er) {
      setErr(er instanceof ApiError ? er.message : 'Не удалось загрузить файл')
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className="admin-upload">
      <button type="button" className="btn btn-light btn-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? 'Загрузка…' : children}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} hidden onChange={pick} />
      {err && <small className="admin-upload-err">{err}</small>}
    </span>
  )
}

function LinesEditor({ value, onChange, placeholder, allowUpload }: any) {
  const lines: string[] = Array.isArray(value) ? value : []
  const text = Array.isArray(value) ? value.join('\n') : value || ''
  return (
    <div className={allowUpload ? 'admin-images-field' : undefined}>
      <textarea
        className="admin-input"
        rows={4}
        value={text}
        placeholder={placeholder || 'По одному пункту в строке'}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        onBlur={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
      />
      {allowUpload && (
        <UploadButton multiple onUploaded={(urls) => onChange([...lines.filter(Boolean), ...urls])}>
          + Загрузить фото
        </UploadButton>
      )}
    </div>
  )
}

function PairsEditor({ value, onChange }: any) {
  const rows: { label: string; value: string }[] = Array.isArray(value) ? value : []
  const set = (i: number, key: 'label' | 'value', v: string) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [key]: v } : r))
    onChange(next)
  }
  return (
    <div className="admin-pairs">
      {rows.map((r, i) => (
        <div className="admin-pair-row" key={i}>
          <input className="admin-input" value={r.label} placeholder="Параметр" onChange={(e) => set(i, 'label', e.target.value)} />
          <input className="admin-input" value={r.value} placeholder="Значение" onChange={(e) => set(i, 'value', e.target.value)} />
          <button type="button" className="admin-linkbtn" onClick={() => onChange(rows.filter((_, idx) => idx !== i))}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-light btn-sm" onClick={() => onChange([...rows, { label: '', value: '' }])}>
        + строка
      </button>
    </div>
  )
}

function FieldInput({
  field,
  value,
  onChange,
  dynamicOptions,
}: {
  field: Field
  value: any
  onChange: (v: any) => void
  dynamicOptions: Record<string, { value: any; label: string }[]>
}) {
  const t = field.type || 'text'
  if (t === 'checkbox')
    return (
      <label className="admin-check">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span>{field.label}</span>
      </label>
    )
  if (t === 'textarea')
    return <textarea className="admin-input" rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} />
  if (t === 'lines') return <LinesEditor value={value} onChange={onChange} />
  if (t === 'images')
    return (
      <LinesEditor value={value} onChange={onChange} placeholder="По одной ссылке на изображение в строке" allowUpload />
    )
  if (t === 'pairs') return <PairsEditor value={value} onChange={onChange} />
  if (t === 'select') {
    const opts = field.options || dynamicOptions[field.name] || []
    return (
      <select className="admin-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">— выберите —</option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  }
  if (t === 'image')
    return (
      <div className="admin-image-field">
        <div className="admin-image-controls">
          <div className="admin-image-upload-row">
            <input className="admin-input" value={value || ''} placeholder="https://…" onChange={(e) => onChange(e.target.value)} />
            <UploadButton onUploaded={(urls) => urls[0] && onChange(urls[0])}>Загрузить файл</UploadButton>
          </div>
          <small style={{ color: '#9a948a' }}>Вставьте ссылку на изображение или загрузите файл со своего устройства</small>
        </div>
        {value ? <img src={value} alt="" onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.2')} /> : null}
      </div>
    )
  return (
    <input
      className="admin-input"
      type={t === 'number' ? 'number' : t === 'date' ? 'date' : 'text'}
      value={value ?? ''}
      min={field.min}
      max={field.max}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

const GroupFragment = Fragment

// ─── Main ─────────────────────────────────────────────────
export function ResourceManager({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadErr, setLoadErr] = useState('')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState<'new' | any | null>(null)
  const [form, setForm] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, { value: any; label: string }[]>>({})
  const [filterVals, setFilterVals] = useState<Record<string, string>>({})
  const [filterOpts, setFilterOpts] = useState<Record<string, { value: any; label: string }[]>>({})

  const blank = useMemo(() => {
    const o: Record<string, any> = {}
    config.fields.forEach((f) => (o[f.name] = f.default !== undefined ? f.default : emptyFor(f)))
    return o
  }, [config])

  const groupedRows = useMemo<[string, any[]][]>(() => {
    if (!config.groupBy) return [['', rows]]
    const map = new Map<string, any[]>()
    for (const r of rows) {
      const g = config.groupBy(r) || '—'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(r)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], 'ru'))
  }, [rows, config])

  const load = useCallback(async () => {
    setLoading(true)
    setLoadErr('')
    try {
      const sp = new URLSearchParams()
      if (config.search && q) sp.set('q', q)
      if (config.paged) sp.set('per_page', '200')
      for (const [k, v] of Object.entries(filterVals)) if (v) sp.set(k, v)
      const qs = sp.toString() ? `?${sp}` : ''
      const res = await api<any>(`${config.endpoint}${qs}`)
      setRows(config.paged ? res.items : res)
    } catch (e) {
      setLoadErr(e instanceof ApiError ? e.message : 'Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }, [config, q, filterVals])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const fs = (config.filters ?? []).filter((f) => f.optionsFrom)
    if (!fs.length) return
    Promise.all(
      fs.map(async (f) => {
        try {
          const res = await api<any>(f.optionsFrom!.endpoint)
          const list = Array.isArray(res) ? res : res.items
          return [
            f.name,
            list.map((r: any) => ({ value: r[f.optionsFrom!.value], label: r[f.optionsFrom!.label] })),
          ] as const
        } catch {
          return [f.name, []] as const
        }
      }),
    ).then((pairs) => setFilterOpts(Object.fromEntries(pairs)))
  }, [config])

  useEffect(() => {
    const withOpts = config.fields.filter((f) => f.optionsFrom)
    if (!withOpts.length) return
    Promise.all(
      withOpts.map(async (f) => {
        try {
          const res = await api<any>(f.optionsFrom!.endpoint)
          const list = Array.isArray(res) ? res : res.items
          return [
            f.name,
            list.map((r: any) => ({ value: r[f.optionsFrom!.value], label: r[f.optionsFrom!.label] })),
          ] as const
        } catch {
          return [f.name, []] as const
        }
      }),
    ).then((pairs) => setDynamicOptions(Object.fromEntries(pairs)))
  }, [config])

  const openNew = () => {
    setForm({ ...blank })
    setFormErr('')
    setEditing('new')
  }
  const openEdit = (row: any) => {
    const base = config.toForm ? config.toForm(row) : row
    const v: Record<string, any> = {}
    config.fields.forEach((f) => {
      const raw = base[f.name]
      v[f.name] = raw ?? emptyFor(f)
    })
    setForm(v)
    setFormErr('')
    setEditing(row)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormErr('')
    try {
      const payload = toPayload(config.fields, form)
      if (editing === 'new') {
        await api(`${config.endpoint}`, { method: 'POST', body: payload })
      } else {
        await api(`${config.endpoint}/${editing.id}`, { method: 'PATCH', body: payload })
      }
      setEditing(null)
      await load()
    } catch (e) {
      setFormErr(e instanceof ApiError ? e.message : 'Не удалось сохранить')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (row: any) => {
    if (!confirm(`Удалить «${row.name || row.title || row.question || row.id}»?`)) return
    try {
      await api(`${config.endpoint}/${row.id}`, { method: 'DELETE' })
      await load()
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Не удалось удалить')
    }
  }

  return (
    <AdminShell
      title={config.title}
      subtitle={config.subtitle}
      actions={
        <button className="crm-tool crm-tool-primary" onClick={openNew}>
          + {config.singular}
        </button>
      }
    >
      {(config.search || config.filters?.length) && (
        <div className="crm-toolbar">
          {config.search && (
            <input
              className="crm-search"
              placeholder="Поиск…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          )}
          {config.filters?.map((f) => {
            const opts = f.options || filterOpts[f.name] || []
            return (
              <select
                key={f.name}
                className="admin-input"
                style={{ width: 'auto', minWidth: 160 }}
                value={filterVals[f.name] ?? ''}
                onChange={(e) => setFilterVals((s) => ({ ...s, [f.name]: e.target.value }))}
              >
                <option value="">{f.label}: все</option>
                {opts.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )
          })}
        </div>
      )}

      {loadErr ? (
        <AdminError message={loadErr} />
      ) : (
        <div className="admin-panel req-panel">
          <table className="req-table">
            <thead>
              <tr>
                {config.columns.map((c) => (
                  <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                    {c.label}
                  </th>
                ))}
                <th style={{ width: 90 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="req-empty">
                    Загрузка…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="req-empty">
                    Пока нет записей
                  </td>
                </tr>
              ) : (
                groupedRows.map(([group, groupRows]) => (
                  <GroupFragment key={group || '_'}>
                    {group && (
                      <tr className="rm-group">
                        <td colSpan={config.columns.length + 1}>
                          {group} <span>· {groupRows.length}</span>
                        </td>
                      </tr>
                    )}
                    {groupRows.map((row) => (
                      <tr key={row.id} onClick={() => openEdit(row)} style={{ cursor: 'pointer' }}>
                        {config.columns.map((c) => (
                          <td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? '—')}</td>
                        ))}
                        <td className="row-actions" onClick={(e) => e.stopPropagation()}>
                          <button className="admin-icon-btn" title="Редактировать" onClick={() => openEdit(row)}>
                            <Pencil size={15} />
                          </button>
                          <button
                            className="admin-icon-btn admin-icon-btn-danger"
                            title="Удалить"
                            onClick={() => remove(row)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </GroupFragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing !== null && (
        <div className="admin-drawer-back" onClick={() => !saving && setEditing(null)}>
          <form className="admin-drawer" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className="admin-drawer-head">
              <h2>{editing === 'new' ? `Новая запись: ${config.singular}` : `Редактирование`}</h2>
              <button type="button" className="modal-x" onClick={() => setEditing(null)}>
                ×
              </button>
            </div>
            <div className="admin-drawer-body">
              {config.fields.map((f) =>
                f.type === 'checkbox' ? (
                  <div className="admin-field" key={f.name}>
                    <FieldInput
                      field={f}
                      value={form[f.name]}
                      dynamicOptions={dynamicOptions}
                      onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
                    />
                    {f.help && <small>{f.help}</small>}
                  </div>
                ) : (
                  <div className={`admin-field${f.wide ? ' admin-field-wide' : ''}`} key={f.name}>
                    <label>
                      {f.label}
                      {f.required && <span style={{ color: 'var(--terracotta)' }}> *</span>}
                    </label>
                    <FieldInput
                      field={f}
                      value={form[f.name]}
                      dynamicOptions={dynamicOptions}
                      onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
                    />
                    {f.help && <small>{f.help}</small>}
                  </div>
                ),
              )}
            </div>
            {formErr && <div className="admin-login-err">{formErr}</div>}
            <div className="admin-drawer-foot">
              <button type="button" className="btn btn-light btn-sm" onClick={() => setEditing(null)} disabled={saving}>
                Отмена
              </button>
              <button type="submit" className="btn btn-green btn-sm" disabled={saving}>
                {saving ? 'Сохранение…' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  )
}
