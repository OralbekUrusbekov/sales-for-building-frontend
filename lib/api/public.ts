/**
 * Server-side data access for public pages.
 *
 * Every function fetches from the RemontHub API and, if the API is unreachable
 * or returns an error, falls back to the bundled mock data (`lib/data/*`) so the
 * site keeps rendering. Field names are mapped to the camelCase shapes the
 * existing components expect.
 */
import type { Article, Master, Product, Review, Service, Vacancy } from '@/types'
import { img } from '@/lib/img'
import { products as mockProducts, categories as mockCategories, brands as mockBrands } from '@/lib/data/products'
import { masters as mockMasters } from '@/lib/data/masters'
import { services as mockServices } from '@/lib/data/services'
import { articles as mockArticles } from '@/lib/data/articles'
import { vacancies as mockVacancies } from '@/lib/data/vacancies'
import { reviews as mockReviews } from '@/lib/data/reviews'
import { faqGeneral as mockFaqGeneral, faqServices as mockFaqServices } from '@/lib/data/faq'

const BASE =
  process.env.API_INTERNAL_URL?.replace(/\/$/, '') ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8000/api'

const REVALIDATE = 20

async function get<T>(path: string, opts?: { fresh?: boolean }): Promise<T | null> {
  try {
    const res = await fetch(
      `${BASE}${path}`,
      opts?.fresh ? { cache: 'no-store' } : { next: { revalidate: REVALIDATE } },
    )
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

// ─── mappers ───────────────────────────────────────────────
type ApiCategory = { id: number; slug: string; name: string; description: string; image: string; product_count?: number }
type ApiBrand = { id: number; slug: string; name: string }
type ApiProduct = {
  id: number
  slug: string
  name: string
  unit: string
  price: number
  old_price: number | null
  stock: number
  rating: number
  review_count: number
  image: string
  images?: string[]
  badge: string
  short_description: string
  description?: string
  specs?: { label: string; value: string }[]
  category: ApiCategory
  brand: ApiBrand
}

const mapProduct = (p: ApiProduct): Product => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  category: p.category?.name ?? '',
  categorySlug: p.category?.slug ?? '',
  brand: p.brand?.name ?? '',
  price: p.price,
  oldPrice: p.old_price ?? undefined,
  unit: p.unit as Product['unit'],
  stock: p.stock,
  rating: p.rating,
  reviewCount: p.review_count,
  image: img(p.image),
  images: (p.images?.length ? p.images : [p.image]).map((s) => img(s)),
  badge: (p.badge || '') as Product['badge'],
  shortDescription: p.short_description,
  description: p.description ?? p.short_description,
  specs: p.specs ?? [],
})

const mapMaster = (m: any): Master => ({
  id: String(m.id),
  name: m.name,
  specialty: m.specialty ?? [],
  city: m.city,
  district: m.district,
  rating: m.rating,
  reviewCount: m.review_count,
  jobs: m.jobs,
  rate: m.rate,
  verified: m.verified,
  available: m.available,
  image: img(m.image),
  bio: m.bio,
  portfolio: m.portfolio ?? [],
  location: m.location ?? {
    address: `${m.district} район`,
    city: m.city ?? 'Астана',
    lat: 51.169392,
    lng: 71.449074,
    workHours: 'Пн–Сб, 09:00–20:00',
  },
})

const mapService = (s: any): Service => ({
  id: s.slug,
  slug: s.slug,
  name: s.name,
  priceFrom: s.price_from,
  duration: s.duration,
  image: img(s.image),
  description: s.description,
  includes: s.includes ?? [],
  steps: s.steps ?? [],
  gallery: s.gallery ?? [],
})

const mapArticle = (a: any): Article => ({
  id: a.slug,
  slug: a.slug,
  title: a.title,
  category: a.category,
  excerpt: a.excerpt,
  image: img(a.image),
  date: a.published_on,
  readMin: a.read_min,
  body: a.body ?? [],
})

const mapVacancy = (v: any): Vacancy => ({
  id: String(v.id),
  slug: v.slug,
  title: v.title,
  city: v.city,
  employment: v.employment,
  salaryFrom: v.salary_from,
  salaryTo: v.salary_to,
  short: v.short,
  responsibilities: v.responsibilities ?? [],
  requirements: v.requirements ?? [],
  conditions: v.conditions ?? [],
})

const mapReview = (r: any): Review => ({
  id: String(r.id),
  targetType: r.target_type,
  targetId: r.target_id,
  authorName: r.author_name,
  avatar: r.avatar || undefined,
  rating: r.rating,
  text: r.text,
  photos: r.photos ?? [],
  createdAt: r.created_at,
})

export type Category = { name: string; slug: string; count: number; image: string; description?: string; num: string }
const mapCategory = (c: ApiCategory, i: number): Category => ({
  name: c.name,
  slug: c.slug,
  count: c.product_count ?? 0,
  image: img(c.image),
  description: c.description,
  num: `0${i + 1}`,
})

// ─── public API ────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const data = await get<ApiCategory[]>('/catalog/categories')
  if (!data) return mockCategories as Category[]
  return data.map(mapCategory)
}

export async function getBrands(): Promise<{ name: string; slug: string }[]> {
  const data = await get<ApiBrand[]>('/catalog/brands')
  if (!data) return mockBrands.map((b) => ({ name: b, slug: b }))
  return data
}

type ProductQuery = {
  q?: string
  category?: string
  brand?: string[]
  badge?: 'hit' | 'sale' | 'new'
  sort?: string
  page?: number
  perPage?: number
}

export async function getProducts(query: ProductQuery = {}): Promise<{ items: Product[]; total: number; pages: number }> {
  const sp = new URLSearchParams()
  if (query.q) sp.set('q', query.q)
  if (query.category) sp.set('category', query.category)
  if (query.badge) sp.set('badge', query.badge)
  query.brand?.forEach((b) => sp.append('brand', b))
  sp.set('sort', query.sort ?? 'popular')
  sp.set('page', String(query.page ?? 1))
  sp.set('per_page', String(query.perPage ?? 100))
  const data = await get<{ items: ApiProduct[]; total: number; pages: number }>(
    `/catalog/products?${sp}`,
    { fresh: true },
  )
  if (!data) {
    let items = mockProducts as Product[]
    if (query.category) items = items.filter((p) => p.categorySlug === query.category)
    if (query.badge) items = items.filter((p) => p.badge === query.badge)
    return { items, total: items.length, pages: 1 }
  }
  return { items: data.items.map(mapProduct), total: data.total, pages: data.pages }
}

export async function getAllProducts(): Promise<Product[]> {
  return (await getProducts({ perPage: 500 })).items
}

export async function getProduct(key: string): Promise<Product | null> {
  const data = await get<ApiProduct>(`/catalog/products/${encodeURIComponent(key)}`, { fresh: true })
  if (data) return mapProduct(data)
  return (mockProducts as Product[]).find((p) => p.id === key || p.slug === key) ?? null
}

export async function getMasters(): Promise<Master[]> {
  const data = await get<{ items: any[] }>('/masters?per_page=100')
  if (!data) return mockMasters as Master[]
  return data.items.map(mapMaster)
}

export async function getMaster(key: string): Promise<Master | null> {
  const data = await get<any>(`/masters/${encodeURIComponent(key)}`, { fresh: true })
  if (data) return mapMaster(data)
  return (mockMasters as Master[]).find((m) => m.id === key) ?? null
}

export async function getServices(): Promise<Service[]> {
  const data = await get<any[]>('/services')
  if (!data) return mockServices as Service[]
  return data.map(mapService)
}

export async function getService(key: string): Promise<Service | null> {
  const data = await get<any>(`/services/${encodeURIComponent(key)}`, { fresh: true })
  if (data) return mapService(data)
  return (mockServices as Service[]).find((s) => s.slug === key) ?? null
}

export async function getArticles(): Promise<Article[]> {
  const data = await get<{ items: any[] }>('/blog?per_page=100')
  if (!data) return mockArticles as Article[]
  return data.items.map(mapArticle)
}

export async function getArticle(slug: string): Promise<Article | null> {
  const data = await get<any>(`/blog/${encodeURIComponent(slug)}`, { fresh: true })
  if (data) return mapArticle(data)
  return (mockArticles as Article[]).find((a) => a.slug === slug) ?? null
}

export async function getVacancies(): Promise<Vacancy[]> {
  const data = await get<any[]>('/vacancies')
  if (!data) return mockVacancies as Vacancy[]
  return data.map(mapVacancy)
}

export async function getVacancy(key: string): Promise<Vacancy | null> {
  const data = await get<any>(`/vacancies/${encodeURIComponent(key)}`, { fresh: true })
  if (data) return mapVacancy(data)
  return (mockVacancies as Vacancy[]).find((v) => v.id === key || v.slug === key) ?? null
}

export async function getReviews(targetType: string, targetId: string): Promise<Review[]> {
  const data = await get<any[]>(`/reviews?target_type=${targetType}&target_id=${encodeURIComponent(targetId)}`)
  if (!data) return (mockReviews as Review[]).filter((r) => r.targetType === targetType && r.targetId === targetId)
  return data.map(mapReview)
}

export async function getLatestReviews(limit = 8): Promise<Review[]> {
  const data = await get<any[]>(`/reviews/latest?limit=${limit}`)
  if (!data) return (mockReviews as Review[]).slice(0, limit)
  return data.map(mapReview)
}

export async function getFaq(section: 'general' | 'services'): Promise<{ q: string; a: string }[]> {
  return section === 'services' ? mockFaqServices : mockFaqGeneral
}

export type SiteSettings = {
  contact: Record<string, string>
  hero: Record<string, string>
  trust: { icon: string; title: string; text: string }[]
  company: Record<string, string | number>
}

const DEFAULT_SETTINGS: SiteSettings = {
  contact: {
    phone: '+7 700 123 45 67',
    phone_href: 'tel:+77001234567',
    email: 'hello@remonthub.kz',
    address: 'Астана, ул. Кабанбай батыра, 15',
    hours: 'Ежедневно 09:00–20:00',
    whatsapp: 'https://wa.me/77001234567',
    map_link: 'https://www.openstreetmap.org/?mlat=51.1801&mlon=71.4460#map=16/51.1801/71.4460',
    delivery_note: 'Доставка по Астане 1–2 дня',
  },
  hero: {
    heading: 'Ремонт начинается с',
    accent: 'правильного решения',
    subtitle:
      'Материалы с доставкой, проверенные мастера и понятная смета — без лишних звонков и переплат.',
    primary_label: 'Рассчитать ремонт',
    primary_href: '/calculator',
    secondary_label: 'Открыть каталог',
    secondary_href: '/catalog',
    bg_image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80',
  },
  trust: [
    { icon: 'truck', title: 'Доставка 1–2 дня', text: 'по Астане, подъём на этаж' },
    { icon: 'badge', title: 'Проверенные мастера', text: 'документы, портфолио, отзывы' },
    { icon: 'clipboard', title: 'Прозрачная смета', text: 'материалы и работы отдельно' },
    { icon: 'return', title: 'Возврат 14 дней', text: 'для неиспользованных товаров' },
  ],
  company: { name: 'RemontHub', about_short: '', founded_year: 2012 },
}

export async function getSettings(): Promise<SiteSettings> {
  const data = await get<SiteSettings>('/settings')
  return data ?? DEFAULT_SETTINGS
}

