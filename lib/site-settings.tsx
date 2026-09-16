'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { API_BASE } from '@/lib/api/map'

export type Contact = {
  phone: string
  phone_href: string
  email: string
  address: string
  hours: string
  whatsapp: string
  map_link: string
  delivery_note: string
}

const FALLBACK: Contact = {
  phone: '+7 700 123 45 67',
  phone_href: 'tel:+77001234567',
  email: 'hello@remonthub.kz',
  address: 'Астана, ул. Кабанбай батыра, 15',
  hours: 'Ежедневно 09:00–20:00',
  whatsapp: 'https://wa.me/77001234567',
  map_link: 'https://www.openstreetmap.org/?mlat=51.1801&mlon=71.4460#map=16/51.1801/71.4460',
  delivery_note: 'Доставка по Астане 1–2 дня',
}

const Ctx = createContext<Contact>(FALLBACK)

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [contact, setContact] = useState<Contact>(FALLBACK)

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.contact && setContact({ ...FALLBACK, ...d.contact }))
      .catch(() => {})
  }, [])

  return <Ctx.Provider value={contact}>{children}</Ctx.Provider>
}

export const useSiteContact = () => useContext(Ctx)
