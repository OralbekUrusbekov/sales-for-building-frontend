'use client'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product-card'

const PER_PAGE = 12

type Cat = { slug: string; name: string; count: number }

export function CatalogClient({
  products,
  categories,
  brands,
}: {
  products: Product[]
  categories: Cat[]
  brands: string[]
}) {
  const brandOpts = ['Все бренды', ...brands]
  const params = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || '')
  const [brand, setBrand] = useState('Все бренды')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStock, setInStock] = useState(false)
  const [minRating, setMinRating] = useState('0')
  const [onSale, setOnSale] = useState(false)
  const [sort, setSort] = useState('popular')
  const [mode, setMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const min = Number(minPrice) || 0
    const max = Number(maxPrice) || Infinity
    const result = products.filter(
      (p) =>
        (!category || p.categorySlug === category) &&
        (brand === 'Все бренды' || p.brand === brand) &&
        p.price >= min &&
        p.price <= max &&
        (!inStock || p.stock > 0) &&
        (!onSale || !!p.oldPrice || p.badge === 'sale') &&
        p.rating >= Number(minRating) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())),
    )
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [category, brand, minPrice, maxPrice, inStock, onSale, minRating, search, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const sync = (next: Record<string, string>) => {
    const query = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => v && query.set(k, v))
    router.replace(`/catalog${query.toString() ? `?${query}` : ''}`, { scroll: false })
  }

  const reset = () => {
    setCategory('')
    setBrand('Все бренды')
    setMinPrice('')
    setMaxPrice('')
    setInStock(false)
    setOnSale(false)
    setMinRating('0')
    setSearch('')
    setPage(1)
    sync({})
  }

  return (
    <section className="catalog-layout wrap">
      <aside className="filters">
        <strong>Фильтры</strong>

        <label>Категория</label>
        <button className={!category ? 'on' : ''} onClick={() => { setCategory(''); setPage(1); sync({ q: search, sort }) }}>
          Все категории
        </button>
        {categories.map((c) => (
          <button
            className={category === c.slug ? 'on' : ''}
            onClick={() => { setCategory(c.slug); setPage(1); sync({ q: search, category: c.slug, sort }) }}
            key={c.slug}
          >
            {c.name} <span style={{ color: 'var(--muted)', fontSize: 11 }}>· {c.count}</span>
          </button>
        ))}

        <label>Бренд</label>
        <select className="select" value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1) }}>
          {brandOpts.map((b) => <option key={b}>{b}</option>)}
        </select>

        <label>Цена, ₸</label>
        <div className="row2">
          <input className="input" type="number" placeholder="от" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1) }} />
          <input className="input" type="number" placeholder="до" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }} />
        </div>

        <label>Рейтинг</label>
        <select className="select" value={minRating} onChange={(e) => { setMinRating(e.target.value); setPage(1) }}>
          <option value="0">Любой</option>
          <option value="4">От 4.0 ★</option>
          <option value="4.5">От 4.5 ★</option>
          <option value="4.8">От 4.8 ★</option>
        </select>

        <label className="check">
          <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); setPage(1) }} /> Только в наличии
        </label>
        <label className="check">
          <input type="checkbox" checked={onSale} onChange={(e) => { setOnSale(e.target.checked); setPage(1) }} /> Со скидкой
        </label>

        <button className="reset" onClick={reset}>Сбросить фильтры</button>
      </aside>

      <div className="catalog-main">
        <div className="toolbar">
          <input
            className="input"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            onKeyDown={(e) => { if (e.key === 'Enter') sync({ q: search, category, sort }) }}
            placeholder="Поиск по товарам и брендам…"
          />
          <div className="tb-right">
            <span className="count">Найдено: <b>{filtered.length}</b></span>
            <select className="select" value={sort} onChange={(e) => { setSort(e.target.value); sync({ q: search, category, sort: e.target.value }) }}>
              <option value="popular">Популярные</option>
              <option value="rating">По рейтингу</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
            <button className="btn btn-light btn-sm" onClick={() => setMode(mode === 'grid' ? 'list' : 'grid')}>
              {mode === 'grid' ? 'Списком' : 'Плиткой'}
            </button>
          </div>
        </div>

        {shown.length ? (
          <div className={mode === 'grid' ? 'pgrid' : 'grid'} style={mode === 'list' ? { gap: 14 } : undefined}>
            {shown.map((p) => <ProductCard key={p.id} product={p} list={mode === 'list'} />)}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', padding: '40px 0' }}>
            Ничего не найдено. Попробуйте изменить фильтры.
          </p>
        )}

        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button className={n === current ? 'on' : ''} onClick={() => setPage(n)} key={n}>{n}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
