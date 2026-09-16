import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public-shell'
import { ProductDetail } from '@/components/product-detail'
import { getProduct, getProducts, getReviews } from '@/lib/api/public'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProduct(slug)
  return { title: p ? `${p.name} — RemontHub` : 'Товар не найден' }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const [catProducts, reviews] = await Promise.all([
    getProducts({ category: product.categorySlug, perPage: 12 }).then((r) => r.items),
    getReviews('product', product.id),
  ])
  const related = catProducts.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <PublicShell
      crumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Каталог', href: '/catalog' },
        { label: product.category, href: `/catalog/category/${product.categorySlug}` },
        { label: product.name },
      ]}
    >
      <ProductDetail product={product} related={related} reviews={reviews} />
    </PublicShell>
  )
}
