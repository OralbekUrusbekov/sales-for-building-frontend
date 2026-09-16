'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PublicShell } from '@/components/public-shell'
import { useAuth } from '@/lib/auth'

const items = [
  { href: '/account/orders', label: 'Мои заказы' },
  { href: '/account/requests', label: 'Мои заявки' },
  { href: '/account/wishlist', label: 'Избранное' },
  { href: '/account/profile', label: 'Профиль' },
]

export function AccountShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [loading, user, router, pathname])

  return (
    <PublicShell eyebrow="Личный кабинет" title={title} crumbs={[{ label: 'Главная', href: '/' }, { label: 'Кабинет' }]}>
      <section className="wrap sec-sm acct">
        <nav className="acct-nav">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className={pathname === it.href ? 'on' : ''}>
              {it.label}
            </Link>
          ))}
          <button type="button" className="acct-logout" onClick={() => { logout(); router.push('/') }}>
            Выйти
          </button>
        </nav>
        <div>{user ? children : <p style={{ color: 'var(--muted)' }}>Загрузка…</p>}</div>
      </section>
    </PublicShell>
  )
}
