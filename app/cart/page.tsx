'use client'
import Link from 'next/link'
import { PublicShell } from '@/components/public-shell'
import { useCart, cartSubtotal } from '@/lib/cart-store'
import { money } from '@/lib/remonthub-data'
import { img } from '@/lib/img'

export default function CartPage() {
  const { lines, setQuantity, remove, promo, setPromo } = useCart()
  const subtotal = cartSubtotal(lines)
  const discount = promo.trim().toUpperCase() === 'REMONT10' ? Math.round(subtotal * 0.1) : 0
  const total = subtotal - discount

  return (
    <PublicShell eyebrow="Покупки" title="Корзина" crumbs={[{ label: 'Главная', href: '/' }, { label: 'Корзина' }]}>
      <section className="wrap sec-sm">
        {lines.length ? (
          <div className="cart-layout">
            <div className="cart-lines">
              {lines.map((l) => (
                <article className="cart-line" key={l.product.id}>
                  <img src={img(l.product.image)} alt={l.product.name} />
                  <div>
                    <Link href={`/catalog/${l.product.slug}`}><h3>{l.product.name}</h3></Link>
                    <small>{l.product.brand} · {money(l.product.price)} за {l.product.unit}</small>
                  </div>
                  <div className="qty" style={{ height: 40 }}>
                    <button onClick={() => setQuantity(l.product.id, l.quantity - 1)}>−</button>
                    <input value={l.quantity} onChange={(e) => setQuantity(l.product.id, Math.max(1, Number(e.target.value) || 1))} />
                    <button onClick={() => setQuantity(l.product.id, l.quantity + 1)}>+</button>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ display: 'block' }}>{money(l.product.price * l.quantity)}</strong>
                    <button
                      style={{ border: 0, background: 'none', color: 'var(--terracotta)', fontSize: 12, cursor: 'pointer', padding: 0 }}
                      onClick={() => remove(l.product.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="summary">
              <h3>Ваш заказ</h3>
              <div className="summary-row"><span>Товары ({lines.length})</span><strong>{money(subtotal)}</strong></div>
              <div className="promo-row">
                <input className="input" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Промокод (REMONT10)" />
                <button onClick={() => setPromo(promo.trim())}>OK</button>
              </div>
              {discount > 0 && (
                <div className="summary-row"><span>Скидка</span><strong style={{ color: 'var(--green-dark)' }}>−{money(discount)}</strong></div>
              )}
              <div className="summary-total"><span>Итого</span><span>{money(total)}</span></div>
              <Link href="/checkout" className="btn btn-green btn-block" style={{ marginTop: 12 }}>Оформить заказ <span className="ico">→</span></Link>
              <Link href="/catalog" className="btn btn-light btn-block btn-sm" style={{ marginTop: 8 }}>Продолжить покупки</Link>
            </aside>
          </div>
        ) : (
          <div className="empty">
            <h2>Корзина пуста</h2>
            <p style={{ color: 'var(--muted)' }}>Добавьте материалы из каталога, чтобы оформить заказ.</p>
            <Link href="/catalog" className="btn btn-green" style={{ marginTop: 12 }}>Перейти в каталог <span className="ico">→</span></Link>
          </div>
        )}
      </section>
    </PublicShell>
  )
}
