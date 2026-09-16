export type ReviewTargetType = 'product' | 'master' | 'service'

export type Review = {
  id: string
  targetType: ReviewTargetType
  targetId: string
  authorName: string
  avatar?: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  photos: string[]
  createdAt: string
}

export type Location = { address: string; city: string; lat: number; lng: number; workHours: string }

export type Product = {
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  brand: string
  price: number
  oldPrice?: number
  unit: 'шт' | 'м²' | 'м³' | 'меш'
  stock: number
  rating: number
  reviewCount: number
  image: string
  images: string[]
  badge: '' | 'sale' | 'new' | 'hit'
  shortDescription: string
  description: string
  specs: { label: string; value: string }[]
}

export type Master = {
  id: string
  name: string
  specialty: string[]
  city: string
  district: string
  rating: number
  reviewCount: number
  jobs: number
  rate: number
  verified: boolean
  available: boolean
  image: string
  bio: string
  portfolio: string[]
  location: Location
}

export type Service = {
  id: string
  slug: string
  name: string
  priceFrom: number
  duration: string
  image: string
  description: string
  includes: string[]
  steps: string[]
  gallery: string[]
}

export type Vacancy = {
  id: string
  slug: string
  title: string
  city: string
  employment: string
  salaryFrom: number
  salaryTo: number
  short: string
  responsibilities: string[]
  requirements: string[]
  conditions: string[]
}

export type Article = {
  id: string
  slug: string
  title: string
  category: string
  excerpt: string
  image: string
  date: string
  readMin: number
  body: string[]
}

export type FaqItem = { q: string; a: string }
