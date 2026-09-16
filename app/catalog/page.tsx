import { Suspense } from 'react'
import Link from 'next/link'
import { PublicShell } from '@/components/public-shell'
import { CatalogClient } from '@/components/catalog-client'
import { getAllProducts, getBrands, getCategories } from '@/lib/api/public'

export const metadata = { title: 'Каталог материалов — RemontHub' }

export default async function CatalogPage() {
  const [products, categories, brandRows] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getBrands(),
  ])
  const brands = brandRows.map((b) => b.name)
  const total = products.length

  return (
    <PublicShell
      title="Материалы для ремонта"
      subtitle={`${total}+ позиций с доставкой по Астане: сухие смеси, плитка, инструмент, сантехника, электрика, отделка.`}
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Каталог' }]}
    >
      <div className="wrap" style={{ paddingBottom: 22 }}>
        <div className="chip-row">
          {categories.map((c) => (
            <Link key={c.slug} href={`/catalog/category/${c.slug}`} className="chip-btn">
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="wrap" style={{ padding: 60, color: 'var(--muted)' }}>
            Загрузка каталога…
          </div>
        }
      >
        <CatalogClient products={products} categories={categories} brands={brands} />
      </Suspense>

      <div style={{ paddingBottom: 70 }} />
    </PublicShell>
  )
}
