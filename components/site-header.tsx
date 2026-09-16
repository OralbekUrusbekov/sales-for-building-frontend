'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Calculator, Heart, LayoutGrid, Menu, Package, ShoppingCart, Users, Wrench, X } from 'lucide-react'
import { nav, categories } from '@/lib/remonthub-data'
import { useSiteContact } from '@/lib/site-settings'
import { useCart } from '@/lib/cart-store'
import { useWishlist } from '@/lib/wishlist-store'
import { useUi } from '@/lib/ui-store'
import { useAuth } from '@/lib/auth'

export function SiteHeader({ heroMode = false }: { heroMode?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const contact = useSiteContact()
  const [q, setQ] = useState('')
  const [mega, setMega] = useState(false)
  const [stuck, setStuck] = useState(false)
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0))
  const wishCount = useWishlist((s) => s.ids.length)
  const { menuOpen, setMenuOpen } = useUi()
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!heroMode) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setStuck(window.scrollY > 120))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [heroMode])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/catalog?q=${encodeURIComponent(q)}`)
    setMega(false)
  }

  return (
    <div className={`site-chrome ${heroMode ? 'hero-mode' : ''} ${stuck ? 'stuck' : ''}`} onMouseLeave={() => setMega(false)}>
      <div className="site-top">
        <div className="wrap">
          <span>{contact.delivery_note}</span>
          <a href={contact.phone_href}>{contact.phone}</a>
          <span className="spacer" />
          {mounted && user ? (
            <>
              <Link href="/account/orders">Мои заказы</Link>
              <Link href="/account/profile">{user.name?.split(' ')[0] || 'Кабинет'}</Link>
              <button type="button" className="site-top-btn" onClick={() => { logout(); router.push('/') }}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/account/orders">Мои заказы</Link>
              <Link href="/login">Войти</Link>
            </>
          )}
        </div>
      </div>

      <header className="site-header">
        <div className="wrap">
          <Link href="/" className="brand">
            <span className="brand-mark">R</span>
            <span>remont<span>hub</span></span>
          </Link>

          <button className="hdr-cat" onClick={() => setMega((v) => !v)}>
            <LayoutGrid size={17} strokeWidth={2} /> Каталог
          </button>

          <form className="hdr-search" onSubmit={submit}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск материалов, брендов, услуг…" />
            <button type="submit">Найти</button>
          </form>

          <div className="hdr-icons">
            <Link href="/wishlist" className="hdr-ico" aria-label="Избранное">
              <Heart size={20} strokeWidth={1.8} />
              {mounted && wishCount > 0 && <b>{wishCount}</b>}
            </Link>
            <Link href="/cart" className="hdr-ico" aria-label="Корзина">
              <ShoppingCart size={20} strokeWidth={1.8} />
              {mounted && cartCount > 0 && <b>{cartCount}</b>}
            </Link>
            <button className="hdr-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {mega && (
            <div className="mega">
              <div className="wrap">
                {categories.map((c) => (
                  <Link href={`/catalog/category/${c.slug}`} key={c.slug} onClick={() => setMega(false)}>
                    <Package size={16} strokeWidth={1.7} />
                    <span>
                      {c.name} <em style={{ color: 'var(--muted)', fontStyle: 'normal' }}>· {c.count}</em>
                    </span>
                  </Link>
                ))}
                <Link href="/services" onClick={() => setMega(false)}><Wrench size={16} strokeWidth={1.7} /> Услуги под ключ</Link>
                <Link href="/masters" onClick={() => setMega(false)}><Users size={16} strokeWidth={1.7} /> Мастера</Link>
                <Link href="/calculator" onClick={() => setMega(false)}><Calculator size={16} strokeWidth={1.7} /> Калькулятор ремонта</Link>
              </div>
            </div>
          )}
        </div>

        <nav className="site-nav">
          <div className="wrap">
            {nav.map((item) => (
              <Link href={item.href} key={item.href} className={pathname === item.href ? 'on' : ''}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {menuOpen && (
          <div className="mega">
            <div className="wrap" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {nav.map((item) => (
                <Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
