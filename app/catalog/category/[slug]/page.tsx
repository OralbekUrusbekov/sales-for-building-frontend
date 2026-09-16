import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public-shell'
import { ProductCard } from '@/components/product-card'
import { getCategories, getProducts } from '@/lib/api/public'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = (await getCategories()).find((x) => x.slug === slug)
  return { title: c ? `${c.name} — RemontHub` : 'Категория — RemontHub' }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const list = (await getProducts({ category: slug, perPage: 200 })).items
  const catBrands = Array.from(new Set(list.map((p) => p.brand)))
  const priceMin = list.length ? Math.min(...list.map((p) => p.price)) : 0

  return (
    <PublicShell
      title={category.name}
      subtitle={`${list.length} товаров · от ${priceMin.toLocaleString('ru-RU')} ₸ · ${catBrands.length} брендов · доставка по Астане`}
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Каталог', href: '/catalog' }, { label: category.name }]}
    >
      <div className="wrap" style={{ paddingBottom: 22 }}>
        <div className="chip-row">
          <Link href="/catalog" className="chip-btn">
            Все категории
          </Link>
          {categories
            .filter((c) => c.slug !== slug)
            .map((c) => (
              <Link key={c.slug} href={`/catalog/category/${c.slug}`} className="chip-btn">
                {c.name}
              </Link>
            ))}
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 80 }}>
        <div className="pgrid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <Link className="btn btn-light" href="/catalog">
            ← Весь каталог с фильтрами
          </Link>
        </div>
      </div>
    </PublicShell>
  )
}
