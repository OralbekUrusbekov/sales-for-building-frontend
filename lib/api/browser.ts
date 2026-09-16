'use client'
import type { Master, Product, Review, Service, Vacancy } from '@/types'
import { API_BASE, mapMaster, mapProduct, mapReview, mapService, mapVacancy } from './map'

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function fetchProduct(key: string): Promise<Product | null> {
  const d = await get<any>(`/catalog/products/${encodeURIComponent(key)}`)
  return d ? mapProduct(d) : null
}

export async function fetchAllProducts(): Promise<Product[] | null> {
  const d = await get<{ items: any[] }>('/catalog/products?per_page=500')
  return d ? d.items.map(mapProduct) : null
}

export async function fetchMasters(): Promise<Master[] | null> {
  const d = await get<{ items: any[] }>('/masters?per_page=100')
  return d ? d.items.map(mapMaster) : null
}

export async function fetchServices(): Promise<Service[] | null> {
  const d = await get<any[]>('/services')
  return d ? d.map(mapService) : null
}

export async function fetchVacancies(): Promise<Vacancy[] | null> {
  const d = await get<any[]>('/vacancies')
  return d ? d.map(mapVacancy) : null
}

export async function fetchReviews(targetType: string, targetId: string): Promise<Review[] | null> {
  const d = await get<any[]>(
    `/reviews?target_type=${targetType}&target_id=${encodeURIComponent(targetId)}`,
  )
  return d ? d.map(mapReview) : null
}

/** Aggregate reviews for the public reviews page: pull per known target set. */
export async function fetchAllReviews(): Promise<Review[] | null> {
  const d = await get<any[]>('/reviews/latest?limit=50')
  return d ? d.map(mapReview) : null
}

export async function submitReview(body: {
  target_type: string
  target_id: string
  author_name: string
  rating: number
  text: string
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, photos: [] }),
    })
    return res.ok
  } catch {
    return false
  }
}
