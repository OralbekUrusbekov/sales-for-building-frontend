'use client'
import Link from 'next/link'
import { AccountShell } from '@/components/account-shell'
import { ProductCard } from '@/components/product-card'
import { useWishlist } from '@/lib/wishlist-store'
import { products } from '@/lib/data/products'

export default function AccountWishlistPage() {
  const ids = useWishlist((s) => s.ids)
  const list = products.filter((p) => ids.includes(p.id))
  return (
    <AccountShell title="Избранное">
      {list.length ? (
        <div className="grid g-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <p style={{ color: 'var(--muted)' }}>
          Пусто. <Link href="/catalog" style={{ color: 'var(--green-dark)' }}>Перейти в каталог</Link>
        </p>
      )}
    </AccountShell>
  )
}
