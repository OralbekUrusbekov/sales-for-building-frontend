'use client'
import Link from 'next/link'
import { PublicShell } from '@/components/public-shell'
import { ProductCard } from '@/components/product-card'
import { useWishlist } from '@/lib/wishlist-store'
import { products, hits } from '@/lib/data/products'

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids)
  const list = products.filter((p) => ids.includes(p.id))

  return (
    <PublicShell
      eyebrow="Избранное"
      title="Отложенные товары"
      subtitle="Сохраняйте материалы, чтобы вернуться к ним позже или сравнить перед покупкой."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Избранное' }]}
    >
      <section className="wrap sec-sm">
        {list.length ? (
          <div className="pgrid">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty">
            <h2>Пока пусто</h2>
            <p style={{ color: 'var(--muted)' }}>Нажимайте ♡ на карточках товаров, чтобы сохранить их здесь.</p>
            <Link href="/catalog" className="btn btn-green" style={{ marginTop: 12 }}>В каталог <span className="ico">→</span></Link>
          </div>
        )}
      </section>

      <section className="sec sec-cream">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Может пригодиться</div>
              <h2>Популярное <em>на ремонт</em></h2>
            </div>
            <Link className="sec-link" href="/catalog">Весь каталог →</Link>
          </div>
          <div className="pgrid">
            {hits.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
