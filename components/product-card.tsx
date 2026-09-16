'use client'
import Link from 'next/link'
import type { Product } from '@/types'
import { money } from '@/lib/remonthub-data'
import { Heart } from 'lucide-react'
import { useCart } from '@/lib/cart-store'
import { useWishlist } from '@/lib/wishlist-store'
import { useUi } from '@/lib/ui-store'
import { img } from '@/lib/img'
import { Stars } from '@/components/stars'

const badgeText: Record<string, string> = { sale: 'Скидка', new: 'Новинка', hit: 'Хит' }

function discountPct(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}

export function ProductCard({ product, list = false, big = false }: { product: Product; list?: boolean; big?: boolean }) {
  const add = useCart((s) => s.add)
  const fav = useWishlist((s) => s.ids.includes(product.id))
  const toggleFav = useWishlist((s) => s.toggle)
  const { showToast } = useUi()

  return (
    <article className={`pcard ${list ? 'pcard-list' : ''} ${big ? 'pcard-big' : ''}`}>
      <div className="pcard-media">
        {product.badge && (
          <span className={`badge badge-${product.badge}`}>
            {product.badge === 'sale' && discountPct(product.price, product.oldPrice)
              ? `−${discountPct(product.price, product.oldPrice)}%`
              : badgeText[product.badge]}
          </span>
        )}
        <button
          className={`pcard-fav ${fav ? 'on' : ''}`}
          onClick={() => {
            toggleFav(product.id)
            showToast(fav ? 'Убрано из избранного' : 'Добавлено в избранное')
          }}
          aria-label="В избранное"
        >
          <Heart size={16} strokeWidth={2} fill={fav ? 'currentColor' : 'none'} />
        </button>
        <Link href={`/catalog/${product.slug}`}>
          <img src={img(product.image)} alt={product.name} loading="lazy" />
        </Link>
      </div>
      <div className="pcard-body">
        <div className="meta">{product.category} · {product.brand}</div>
        <h3>
          <Link href={`/catalog/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="pcard-rating">
          <Stars value={product.rating} size={13} />
          <span>{product.rating.toFixed(1)} · {product.reviewCount}</span>
        </div>
        <div className="pcard-foot">
          <div className="pcard-price">
            <b>{money(product.price)}</b>
            {product.oldPrice && <del>{money(product.oldPrice)}</del>}
            <small>за {product.unit}</small>
          </div>
          <button
            className="pcard-add"
            onClick={() => {
              add(product)
              showToast('Добавлено в корзину')
            }}
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  )
}
