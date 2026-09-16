'use client'
import Link from 'next/link'
import { categories } from '@/lib/remonthub-data'
import { useSiteContact } from '@/lib/site-settings'

export function SiteFooter() {
  const contact = useSiteContact()
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-cols">
          <div>
            <Link href="/" className="brand">
              <span className="brand-mark">R</span>
              <span>remont<span>hub</span></span>
            </Link>
            <p>Материалы, проверенные мастера и понятная смета для ремонта в Астане — в одном месте.</p>
            <p style={{ marginTop: 12 }}>
              <a href={contact.phone_href}>{contact.phone}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={contact.map_link} target="_blank" rel="noreferrer">{contact.address}</a>
              <span>{contact.hours}</span>
            </p>
          </div>
          <div>
            <h4>Каталог</h4>
            {categories.map((c) => (
              <Link href={`/catalog/category/${c.slug}`} key={c.slug}>
                {c.name}
              </Link>
            ))}
          </div>
          <div>
            <h4>Компания</h4>
            <Link href="/services">Услуги под ключ</Link>
            <Link href="/masters">Мастера</Link>
            <Link href="/calculator">Калькулятор</Link>
            <Link href="/blog">Советы по ремонту</Link>
            <Link href="/reviews">Отзывы</Link>
            <Link href="/vacancies">Вакансии</Link>
            <Link href="/about">О нас</Link>
          </div>
          <div>
            <h4>Покупателю</h4>
            <Link href="/support">Служба поддержки</Link>
            <Link href="/contacts">Контакты и доставка</Link>
            <Link href="/account/orders">Мои заказы</Link>
            <Link href="/request">Оставить заявку</Link>
            <a href={contact.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RemontHub</span>
          <span>Сделано с вниманием к деталям</span>
        </div>
      </div>
    </footer>
  )
}
