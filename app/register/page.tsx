'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PublicShell } from '@/components/public-shell'
import { useAuth } from '@/lib/auth'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (form.password.length < 6) {
      setErr('Пароль должен быть не короче 6 символов')
      return
    }
    setBusy(true)
    try {
      await register({ ...form, email: form.email.trim() })
      router.push('/account/orders')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Не удалось зарегистрироваться')
      setBusy(false)
    }
  }

  return (
    <PublicShell>
      <section className="auth-page">
        <div className="auth-box">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Личный кабинет</div>
          <h1>Создать аккаунт</h1>
          <form className="form-card auth-card" onSubmit={submit}>
            <label>
              Имя и фамилия
              <input className="input" required placeholder="Алия Ким" value={form.name} onChange={set('name')} />
            </label>
            <label>
              Email
              <input
                className="input"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
              />
            </label>
            <label>
              Телефон
              <input
                className="input"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={form.phone}
                onChange={set('phone')}
              />
            </label>
            <label>
              Пароль
              <input
                className="input"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Минимум 6 символов"
                value={form.password}
                onChange={set('password')}
              />
            </label>
            {err && <p className="auth-err">{err}</p>}
            <button className="btn btn-green btn-block" type="submit" disabled={busy}>
              {busy ? 'Создаём…' : 'Зарегистрироваться'} <span className="ico">→</span>
            </button>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, textAlign: 'center' }}>
              Уже есть аккаунт? <Link href="/login" style={{ color: 'var(--green-dark)' }}>Войти</Link>
            </p>
          </form>
        </div>
      </section>
    </PublicShell>
  )
}
