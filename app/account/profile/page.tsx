'use client'
import { useEffect, useState } from 'react'
import { AccountShell } from '@/components/account-shell'
import { useAuth, authFetch, type User } from '@/lib/auth'

export default function ProfilePage() {
  const { user, refresh } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setPhone(user.phone)
    }
  }, [user])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    setBusy(true)
    try {
      await authFetch<User>('/auth/me', { method: 'PATCH', body: { name, phone } })
      await refresh()
      setMsg('✓ Сохранено')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Не удалось сохранить')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AccountShell title="Профиль">
      <form className="form-card" style={{ maxWidth: 'none' }} onSubmit={save}>
        <label>Имя и фамилия<input className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>Телефон<input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        <label>Email<input className="input" type="email" value={user?.email ?? ''} disabled /></label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="btn btn-green" type="submit" disabled={busy}>
            {busy ? 'Сохраняем…' : 'Сохранить'} <span className="ico">→</span>
          </button>
          {msg && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{msg}</span>}
        </div>
      </form>
    </AccountShell>
  )
}
