import type { Article, Master, Product, Review, Service, Vacancy } from '@/types'
import { img } from '@/lib/img'

export type ApiCategory = {
  id: number
  slug: string
  name: string
  description: string
  image: string
  product_count?: number
}
export type Category = {
  name: string
  slug: string
  count: number
  image: string
  description?: string
  num: string
}

export const mapCategory = (c: ApiCategory, i: number): Category => ({
  name: c.name,
  slug: c.slug,
  count: c.product_count ?? 0,
  image: img(c.image),
  description: c.description,
  num: `0${i + 1}`,
})

export const mapProduct = (p: any): Product => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  category: p.category?.name ?? '',
  categorySlug: p.category?.slug ?? '',
  brand: p.brand?.name ?? '',
  price: p.price,
  oldPrice: p.old_price ?? undefined,
  unit: p.unit,
  stock: p.stock,
  rating: p.rating,
  reviewCount: p.review_count,
  image: img(p.image),
  images: (p.images?.length ? p.images : [p.image]).map((s: string) => img(s)),
  badge: p.badge || '',
  shortDescription: p.short_description,
  description: p.description ?? p.short_description,
  specs: p.specs ?? [],
})

export const mapMaster = (m: any): Master => ({
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

export const mapService = (s: any): Service => ({
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

export const mapArticle = (a: any): Article => ({
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

export const mapVacancy = (v: any): Vacancy => ({
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

export const mapReview = (r: any): Review => ({
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

export const API_BASE =
  (typeof process !== 'undefined' &&
    (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/, '')) ||
  'http://localhost:8000/api'
