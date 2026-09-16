'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import type { Product } from '@/types'
import { useCart } from '@/lib/cart-store'
import { useWishlist } from '@/lib/wishlist-store'
import { useUi } from '@/lib/ui-store'

export function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add)
  const fav = useWishlist((s) => s.ids.includes(product.id))
  const toggleFav = useWishlist((s) => s.toggle)
  const { showToast } = useUi()
  const router = useRouter()
  const [qty, setQty] = useState(1)

  const put = (n = qty) => {
    for (let i = 0; i < n; i++) add(product)
  }

  return (
    <div className="pdp-buy">
      <div className="qty">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
        <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
        <button onClick={() => setQty((q) => q + 1)}>+</button>
      </div>
      <button
        className="btn btn-green"
        onClick={() => {
          put()
          showToast(`${qty} шт добавлено в корзину`)
        }}
      >
        В корзину <span className="ico">→</span>
      </button>
      <button
        className="btn btn-dark"
        onClick={() => {
          put()
          router.push('/checkout')
        }}
      >
        Купить сейчас
      </button>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => {
          toggleFav(product.id)
          showToast(fav ? 'Убрано из избранного' : 'Добавлено в избранное')
        }}
      >
        <Heart size={15} strokeWidth={2} fill={fav ? 'currentColor' : 'none'} />
        {fav ? 'В избранном' : 'В избранное'}
      </button>
    </div>
  )
}
