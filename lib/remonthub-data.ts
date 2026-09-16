export { products, categories, brands, findProduct, hits, sales, fresh } from '@/lib/data/products'
export { masters, findMaster } from '@/lib/data/masters'
export { services, findService } from '@/lib/data/services'
export { reviews, reviewsFor, reviewStats } from '@/lib/data/reviews'
export { articles, findArticle } from '@/lib/data/articles'
export { vacancies, findVacancy } from '@/lib/data/vacancies'
export { faqGeneral, faqServices } from '@/lib/data/faq'

export const nav = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/services', label: 'Услуги' },
  { href: '/masters', label: 'Мастера' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/blog', label: 'Советы' },
  { href: '/reviews', label: 'Отзывы' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
]

export const contact = {
  phone: '+7 700 123 45 67',
  phoneHref: 'tel:+77001234567',
  email: 'hello@remonthub.kz',
  address: 'Астана, ул. Кабанбай батыра, 15',
  hours: 'Ежедневно 09:00–20:00',
  whatsapp: 'https://wa.me/77001234567',
  mapLink: 'https://www.openstreetmap.org/?mlat=51.1801&mlon=71.4460#map=15/51.1801/71.4460',
}

export const money = (v: number) => new Intl.NumberFormat('ru-RU').format(Math.round(v)) + ' ₸'
export const slugify = (v: string) => v.toLowerCase().replaceAll(' ', '-').replaceAll('×', 'x').replaceAll('ё', 'е')
