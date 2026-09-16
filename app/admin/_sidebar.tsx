'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Bell,
  BarChart3,
  Briefcase,
  ChevronLeft,
  FileText,
  Inbox,
  KanbanSquare,
  LayoutGrid,
  LifeBuoy,
  Menu,
  Package,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Tags,
  UserRound,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react'

export const ADMIN_MENU: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/admin', label: 'Обзор', icon: LayoutGrid },
  { href: '/admin/crm', label: 'CRM · Сделки', icon: KanbanSquare },
  { href: '/admin/requests', label: 'Заявки', icon: Inbox },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingBag },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/categories', label: 'Категории', icon: Tags },
  { href: '/admin/brands', label: 'Бренды', icon: Tag },
  { href: '/admin/masters', label: 'Мастера', icon: Users },
  { href: '/admin/services', label: 'Услуги', icon: Wrench },
  { href: '/admin/articles', label: 'Советы / блог', icon: FileText },
  { href: '/admin/vacancies', label: 'Вакансии', icon: Briefcase },
  { href: '/admin/faq', label: 'Вопросы (FAQ)', icon: LifeBuoy },
  { href: '/admin/reports', label: 'Отчёты', icon: BarChart3 },
  { href: '/admin/clients', label: 'Клиенты', icon: UserRound },
  { href: '/admin/users', label: 'Пользователи', icon: ShieldCheck },
  { href: '/admin/notifications', label: 'Уведомления', icon: Bell },
  { href: '/admin/telegram', label: 'Telegram-бот', icon: Send },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div className="admin-mobilebar">
        <button className="admin-burger" onClick={() => setOpen(true)} aria-label="Меню">
          <Menu size={20} />
        </button>
        <Link href="/admin" className="brand">
          <span className="brand-mark">R</span>
          <span>remont<span>hub</span></span>
        </Link>
      </div>

      {open && <div className="admin-sidebar-scrim" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar${open ? ' is-open' : ''}`}>
        <div className="admin-sidebar-head">
          <Link href="/" className="brand">
            <span className="brand-mark">R</span>
            <span>remont<span>hub</span></span>
          </Link>
          <button className="admin-sidebar-x" onClick={() => setOpen(false)} aria-label="Закрыть">
            <X size={20} />
          </button>
        </div>
        <small>РАБОЧЕЕ ПРОСТРАНСТВО</small>
        {ADMIN_MENU.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
          return (
            <Link className={active ? 'admin-active' : ''} href={href} key={href}>
              <b>
                <Icon size={18} strokeWidth={1.75} />
              </b>
              <span>{label}</span>
            </Link>
          )
        })}
        <div className="sidebar-bottom">
          <Link
            className={pathname.startsWith('/admin/settings') ? 'admin-active' : ''}
            href="/admin/settings"
          >
            <b>
              <Settings size={18} strokeWidth={1.75} />
            </b>
            <span>Настройки</span>
          </Link>
          <Link href="/">
            <b>
              <ChevronLeft size={18} strokeWidth={1.75} />
            </b>
            <span>Вернуться на сайт</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
