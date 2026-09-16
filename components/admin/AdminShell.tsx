'use client'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { AdminSidebar } from '@/app/admin/_sidebar'
import { useAdminAuth } from '@/lib/admin/auth'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || 'RH'
}

export function AdminShell({
  title,
  subtitle,
  actions,
  wide,
  children,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  wide?: boolean
  children: React.ReactNode
}) {
  const { user, logout } = useAdminAuth()
  return (
    <div className="admin-page">
      <AdminSidebar />
      <section className={`admin-content${wide ? ' admin-wide' : ''}`}>
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            {subtitle && <span className="admin-sub">{subtitle}</span>}
            <h1>{title}</h1>
          </div>
          <div className="admin-topbar-right">
            {actions && <div className="admin-topbar-actions">{actions}</div>}
            <div className="admin-user">
              <div className="avatar">{user ? initials(user.name || user.email) : 'RH'}</div>
              <strong>
                <span className="admin-user-name">{user?.name || user?.email}</span>
                <small>{user?.role === 'admin' ? 'Администратор' : 'Менеджер'}</small>
              </strong>
              <button type="button" className="admin-logout" onClick={logout} title="Выйти">
                <LogOut size={16} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </header>
        {children}
      </section>
    </div>
  )
}

export function AdminError({ message }: { message: string }) {
  return (
    <div className="admin-panel" style={{ padding: 28 }}>
      <p style={{ color: 'var(--terracotta)', fontSize: 14 }}>{message}</p>
      <p style={{ marginTop: 10, fontSize: 13, color: '#9a948a' }}>
        Проверьте, что API RemontHub запущен и доступен по адресу{' '}
        <code>{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}</code>.
      </p>
      <Link className="btn btn-light btn-sm" href="/admin" style={{ marginTop: 14 }}>
        На главную панели
      </Link>
    </div>
  )
}
