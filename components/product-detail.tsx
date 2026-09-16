'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Product, Review } from '@/types'
import { money } from '@/lib/remonthub-data'
import { AddToCart } from '@/components/add-to-cart'
import { ProductCard } from '@/components/product-card'
import { ReviewsBlock } from '@/components/reviews-block'
import { ChevronRight, PackageCheck, RotateCcw, Truck } from 'lucide-react'
import { useRecent } from '@/lib/ui-store'
import { fetchProduct } from '@/lib/api/browser'
import { PLACEHOLDER } from '@/lib/img'
import { Stars, reviewsWord } from '@/components/stars'

export function ProductDetail({
  product,
  related,
  reviews,
}: {
  product: Product
  related: Product[]
  reviews: Review[]
}) {
  const [img, setImg] = useState(0)
  const [tab, setTab] = useState<'desc' | 'specs' | 'reviews' | 'delivery'>('desc')
  const push = useRecent((s) => s.push)
  const recentIds = useRecent((s) => s.ids)
  const [recent, setRecent] = useState<Product[]>([])

  useEffect(() => {
    push(product.id)
  }, [product.id, push])

  useEffect(() => {
    let cancelled = false
    const ids = recentIds.filter((id) => id !== product.id).slice(0, 4)
    Promise.all(ids.map((id) => fetchProduct(id)))
      .then((list) => {
        if (!cancelled) setRecent(list.filter(Boolean) as Product[])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [recentIds, product.id])

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : product.rating
  const save = product.oldPrice ? product.oldPrice - product.price : 0
  const savePct = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <>
      <section className="wrap pdp">
        <div>
          <img className="gallery-main" src={product.images[img] || product.image || PLACEHOLDER} alt={product.name} />
          <div className="gallery-thumbs">
            {product.images.map((src, i) => (
              <img key={i} src={src} alt="" className={i === img ? 'on' : ''} onClick={() => setImg(i)} />
            ))}
          </div>
        </div>

        <div className="pdp-info">
          {product.badge && <div className="tag" style={{ marginBottom: 10 }}>{product.badge === 'sale' && savePct ? `Скидка −${savePct}%` : { hit: 'Хит продаж', sale: 'Скидка', new: 'Новинка' }[product.badge]}</div>}
          <h1>{product.name}</h1>
          <div className="meta">{product.category} · {product.brand} · арт. {product.id.toUpperCase()}</div>
          <div className="pdp-rating">
            <Stars value={avg} size={16} />
            <a href="#reviews" onClick={() => setTab('reviews')}>
              {avg.toFixed(1)} · {reviews.length || product.reviewCount} {reviewsWord(reviews.length || product.reviewCount)}
            </a>
          </div>
          <p style={{ color: 'var(--muted)' }}>{product.shortDescription}</p>

          <div className="pdp-price">
            <b>{money(product.price)}</b>
            {product.oldPrice && <del>{money(product.oldPrice)}</del>}
            {save > 0 && <span className="save">−{money(save)}</span>}
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>/ {product.unit}</span>
          </div>

          <AddToCart product={product} />

          <div className="pdp-usp">
            <div><Truck size={17} strokeWidth={1.6} /> Доставка по Астане 1–2 дня, самовывоз со склада — сегодня</div>
            <div>
              <PackageCheck size={17} strokeWidth={1.6} />
              {product.stock > 0 ? `В наличии: ${product.stock} ${product.unit}` : 'Под заказ, 3–5 дней'}
            </div>
            <div><RotateCcw size={17} strokeWidth={1.6} /> Возврат в течение 14 дней</div>
          </div>

          {product.specs.length > 0 && (
            <div className="pdp-spec-preview">
              {product.specs.slice(0, 4).map((s) => (
                <div key={s.label}>
                  <span>{s.label}</span>
                  <b>{s.value}</b>
                </div>
              ))}
              <button type="button" onClick={() => setTab('specs')}>
                Все характеристики <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="wrap" id="reviews">
        <div className="tabs">
          <button className={tab === 'desc' ? 'on' : ''} onClick={() => setTab('desc')}>Описание</button>
          <button className={tab === 'specs' ? 'on' : ''} onClick={() => setTab('specs')}>Характеристики</button>
          <button className={tab === 'reviews' ? 'on' : ''} onClick={() => setTab('reviews')}>Отзывы ({reviews.length})</button>
          <button className={tab === 'delivery' ? 'on' : ''} onClick={() => setTab('delivery')}>Доставка и оплата</button>
        </div>

        {tab === 'desc' && <p style={{ maxWidth: 720, color: 'var(--muted)' }}>{product.description}</p>}

        {tab === 'specs' && (
          <div className="spec-table">
            {product.specs.map((s) => (
              <div key={s.label}><span>{s.label}</span><b>{s.value}</b></div>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <ReviewsBlock reviews={reviews} targetType="product" targetId={product.id} />
        )}

        {tab === 'delivery' && (
          <div style={{ maxWidth: 720, color: 'var(--muted)' }}>
            <p><b style={{ color: 'var(--ink)' }}>Доставка.</b> По Астане — 1–2 рабочих дня, стоимость от 2 500 ₸, крупные партии — по договорённости. Самовывоз со склада (ул. Кабанбай батыра, 15) — в день заказа.</p>
            <p><b style={{ color: 'var(--ink)' }}>Оплата.</b> Kaspi QR и рассрочка, банковская карта, наличными при получении. Для юрлиц — счёт и безнал.</p>
            <p><b style={{ color: 'var(--ink)' }}>Возврат.</b> Неиспользованный товар в оригинальной упаковке принимаем в течение 14 дней.</p>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>С этим товаром <em>покупают</em></h2>
              <Link className="sec-link" href={`/catalog/category/${product.categorySlug}`}>Вся категория →</Link>
            </div>
            <div className="pgrid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="sec sec-cream">
          <div className="wrap">
            <div className="sec-head">
              <h2>Вы недавно <em>смотрели</em></h2>
              <Link className="sec-link" href="/catalog">Весь каталог →</Link>
            </div>
            <div className="pgrid">
              {recent.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
