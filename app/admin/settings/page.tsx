'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api, ApiError, uploadImage } from '@/lib/admin/client'
import { AdminShell, AdminError } from '@/components/admin/AdminShell'

type Settings = {
  contact: Record<string, string>
  hero: Record<string, string>
  trust: { icon: string; title: string; text: string }[]
  company: Record<string, string | number>
}

const CONTACT_FIELDS: [keyof Settings['contact'], string][] = [
  ['phone', 'Телефон'],
  ['phone_href', 'Ссылка телефона (tel:)'],
  ['email', 'Email'],
  ['address', 'Адрес'],
  ['hours', 'Часы работы'],
  ['whatsapp', 'WhatsApp (ссылка)'],
  ['map_link', 'Ссылка на карту'],
  ['delivery_note', 'Строка о доставке (в шапке)'],
]
const HERO_FIELDS: [string, string][] = [
  ['heading', 'Заголовок (тёмная часть)'],
  ['accent', 'Заголовок (зелёная часть)'],
  ['subtitle', 'Подзаголовок'],
  ['primary_label', 'Кнопка 1 — текст'],
  ['primary_href', 'Кнопка 1 — ссылка'],
  ['secondary_label', 'Кнопка 2 — текст'],
  ['secondary_href', 'Кнопка 2 — ссылка'],
  ['bg_image', 'Фоновое изображение (URL)'],
]
const TRUST_ICONS = ['truck', 'badge', 'clipboard', 'return', 'shield', 'wallet', 'wrench', 'star']

export default function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null)
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [bgBusy, setBgBusy] = useState(false)
  const [bgErr, setBgErr] = useState('')
  const bgInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setErr('')
    try {
      setS(await api<Settings>('/manage/settings'))
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Ошибка загрузки')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!s) return
    setSaving(true)
    setMsg('')
    try {
      await api('/manage/settings', { method: 'PUT', body: s })
      setMsg('✓ Сохранено. Сайт обновится в течение минуты.')
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : 'Не удалось сохранить')
    } finally {
      setSaving(false)
    }
  }

  const setContact = (k: string, v: string) => setS((p) => p && { ...p, contact: { ...p.contact, [k]: v } })
  const setHero = (k: string, v: string) => setS((p) => p && { ...p, hero: { ...p.hero, [k]: v } })

  const pickBgImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBgErr('')
    setBgBusy(true)
    try {
      setHero('bg_image', await uploadImage(file))
    } catch (er) {
      setBgErr(er instanceof ApiError ? er.message : 'Не удалось загрузить файл')
    } finally {
      setBgBusy(false)
    }
  }
  const setTrust = (i: number, k: string, v: string) =>
    setS((p) => p && { ...p, trust: p.trust.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)) })

  return (
    <AdminShell
      title="Настройки сайта"
      subtitle="Контакты, шапка главной, блок преимуществ"
      actions={
        <button className="crm-tool crm-tool-primary" onClick={save} disabled={saving || !s}>
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      }
    >
      {err ? (
        <AdminError message={err} />
      ) : !s ? (
        <div className="admin-panel" style={{ padding: 28 }}>Загрузка…</div>
      ) : (
        <form onSubmit={save} className="settings-form">
          <section className="admin-panel settings-block">
            <h2>Контакты</h2>
            <div className="settings-grid">
              {CONTACT_FIELDS.map(([k, label]) => (
                <div className="admin-field" key={k}>
                  <label>{label}</label>
                  <input
                    className="admin-input"
                    value={s.contact[k] ?? ''}
                    onChange={(e) => setContact(k, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel settings-block">
            <h2>Главная — первый экран</h2>
            <div className="settings-grid">
              {HERO_FIELDS.map(([k, label]) => (
                <div
                  className={`admin-field${k === 'subtitle' || k === 'bg_image' ? ' admin-field-wide' : ''}`}
                  key={k}
                >
                  <label>{label}</label>
                  {k === 'subtitle' ? (
                    <textarea
                      className="admin-input"
                      rows={2}
                      value={s.hero[k] ?? ''}
                      onChange={(e) => setHero(k, e.target.value)}
                    />
                  ) : k === 'bg_image' ? (
                    <>
                      <div className="admin-image-upload-row">
                        <input
                          className="admin-input"
                          value={s.hero[k] ?? ''}
                          onChange={(e) => setHero(k, e.target.value)}
                        />
                        <span className="admin-upload">
                          <button
                            type="button"
                            className="btn btn-light btn-sm"
                            disabled={bgBusy}
                            onClick={() => bgInputRef.current?.click()}
                          >
                            {bgBusy ? 'Загрузка…' : 'Загрузить файл'}
                          </button>
                          <input ref={bgInputRef} type="file" accept="image/*" hidden onChange={pickBgImage} />
                          {bgErr && <small className="admin-upload-err">{bgErr}</small>}
                        </span>
                      </div>
                      {s.hero.bg_image && <img className="settings-bg-preview" src={s.hero.bg_image} alt="" />}
                    </>
                  ) : (
                    <input
                      className="admin-input"
                      value={s.hero[k] ?? ''}
                      onChange={(e) => setHero(k, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel settings-block">
            <h2>Блок преимуществ (4 пункта)</h2>
            {s.trust.map((t, i) => (
              <div className="settings-trust-row" key={i}>
                <select
                  className="admin-input"
                  value={t.icon}
                  onChange={(e) => setTrust(i, 'icon', e.target.value)}
                >
                  {TRUST_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
                <input
                  className="admin-input"
                  placeholder="Заголовок"
                  value={t.title}
                  onChange={(e) => setTrust(i, 'title', e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Описание"
                  value={t.text}
                  onChange={(e) => setTrust(i, 'text', e.target.value)}
                />
              </div>
            ))}
          </section>

          <div className="settings-foot">
            <button className="btn btn-green" type="submit" disabled={saving}>
              {saving ? 'Сохранение…' : 'Сохранить изменения'}
            </button>
            {msg && <span className="settings-msg">{msg}</span>}
          </div>
        </form>
      )}
    </AdminShell>
  )
}
