'use client'
import { useState } from 'react'
import './admin.css'
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin/auth'
import { ApiError } from '@/lib/admin/client'

function LoginScreen() {
  const { login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await login(email.trim(), password)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Не удалось войти')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="brand" style={{ marginBottom: 6 }}>
          <span className="brand-mark">R</span>
          <span>remont<span>hub</span></span>
        </div>
        <h1>Панель управления</h1>
        <p>Войдите под аккаунтом администратора или менеджера.</p>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@remonthub.kz"
            autoComplete="username"
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {err && <div className="admin-login-err">{err}</div>}
        <button className="btn btn-green btn-block" disabled={busy} type="submit">
          {busy ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth()
  if (loading) return <div className="admin-boot">Загрузка панели…</div>
  if (!user) return <LoginScreen />
  return <>{children}</>
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <Gate>{children}</Gate>
    </AdminAuthProvider>
  )
}
