'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { PublicShell } from '@/components/public-shell'
import { useAuth } from '@/lib/auth'

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/account/orders'
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
      router.push(next)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Не удалось войти')
      setBusy(false)
    }
  }

  return (
    <form className="form-card auth-card" onSubmit={submit}>
      <label>
        Email
        <input
          className="input"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Пароль
        <input
          className="input"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {err && <p className="auth-err">{err}</p>}
      <button className="btn btn-green btn-block" type="submit" disabled={busy}>
        {busy ? 'Входим…' : 'Войти'} <span className="ico">→</span>
      </button>
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, textAlign: 'center' }}>
        Нет аккаунта?{' '}
        <Link href="/register" style={{ color: 'var(--green-dark)' }}>Зарегистрироваться</Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <PublicShell>
      <section className="auth-page">
        <div className="auth-box">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Личный кабинет</div>
          <h1>Войти</h1>
          <Suspense fallback={<div className="form-card auth-card" style={{ minHeight: 220 }} />}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </PublicShell>
  )
}
