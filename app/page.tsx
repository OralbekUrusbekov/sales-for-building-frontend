import Link from 'next/link'
import { ArrowUpRight, BadgeCheck, ClipboardList, RotateCcw, Truck } from 'lucide-react'
import { PublicShell } from '@/components/public-shell'
import { Stars } from '@/components/stars'
import { ProductRail, Rail } from '@/components/product-rail'
import { Newsletter } from '@/components/newsletter'
import { FaqList } from '@/components/faq-list'
import { LeadForm } from '@/components/lead-form'
import { money, faqGeneral } from '@/lib/remonthub-data'
import {
  getArticles,
  getBrands,
  getCategories,
  getLatestReviews,
  getMasters,
  getProducts,
  getServices,
  getSettings,
} from '@/lib/api/public'

const mastersImg = 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80'

const TRUST_ICON: Record<string, React.ReactNode> = {
  truck: <Truck size={22} strokeWidth={1.5} />,
  badge: <BadgeCheck size={22} strokeWidth={1.5} />,
  clipboard: <ClipboardList size={22} strokeWidth={1.5} />,
  return: <RotateCcw size={22} strokeWidth={1.5} />,
}

export default async function HomePage() {
  const [categories, hits, sales, services, masters, articles, reviews, brands, settings] =
    await Promise.all([
      getCategories(),
      getProducts({ badge: 'hit', perPage: 12 }).then((r) => r.items),
      getProducts({ badge: 'sale', perPage: 12 }).then((r) => r.items),
      getServices(),
      getMasters(),
      getArticles(),
      getLatestReviews(8),
      getBrands(),
      getSettings(),
    ])
  const { hero, trust } = settings

  return (
    <PublicShell heroMode>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${hero.bg_image})` }} />
        <div className="wrap hero-inner">
          <h1>
            {hero.heading} <em>{hero.accent}</em>
          </h1>
          <p className="hero-lead">{hero.subtitle}</p>
          <div className="hero-actions">
            <Link className="btn btn-green" href={hero.primary_href}>
              {hero.primary_label} <span className="ico">→</span>
            </Link>
            <Link className="btn btn-light" href={hero.secondary_href}>
              {hero.secondary_label} <span className="ico">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="sec-sm">
        <div className="wrap">
          <div className="trust">
            {trust.map((t, i) => (
              <div key={i}>
                {TRUST_ICON[t.icon] ?? <BadgeCheck size={22} strokeWidth={1.5} />}
                <div>
                  <b>{t.title}</b>
                  <span>{t.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="sec sec-cream">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Категории</div>
              <h2>Соберите ремонт <em>без суеты</em></h2>
            </div>
            <Link className="sec-link" href="/catalog">Весь каталог →</Link>
          </div>
          <div className="cat-tiles">
            {categories.map((c) => (
              <Link className="cat-tile" href={`/catalog/category/${c.slug}`} key={c.slug}>
                <img src={c.image} alt="" />
                <span className="num">{c.num}</span>
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.count} товаров</p>
                </div>
                <span className="arr"><ArrowUpRight size={18} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HITS */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Хиты продаж</div>
              <h2>Что чаще всего <em>берут на ремонт</em></h2>
            </div>
            <Link className="sec-link" href="/catalog?sort=rating">Смотреть все →</Link>
          </div>
          <ProductRail items={hits} />
        </div>
      </section>

      {/* MASTERS SPLIT */}
      <section className="sec sec-cream">
        <div className="wrap split">
          <div className="copy">
            <div className="eyebrow">Мастера рядом</div>
            <h2>Нужен человек, <em>а не обещание</em></h2>
            <p>
              В базе — {masters.length * 12}+ специалистов с портфолио, отзывами и понятной ставкой.
              Подберём мастера под вашу задачу и район за один день.
            </p>
            <Link className="btn btn-dark" href="/masters">Найти мастера <span className="ico">→</span></Link>
          </div>
          <img src={mastersImg} alt="Мастер за работой" />
        </div>
      </section>

      {/* SERVICES */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Услуги под ключ</div>
              <h2>От идеи до <em>чистого пола</em></h2>
            </div>
            <Link className="sec-link" href="/services">Все услуги →</Link>
          </div>
          <div className="grid g-3">
            {services.slice(0, 3).map((s) => (
              <Link className="scard" href={`/services/${s.slug}`} key={s.id}>
                <img src={s.image} alt={s.name} />
                <div className="scard-body">
                  <span className="dur">{s.duration}</span>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <b>от {money(s.priceFrom)}</b>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR CALLOUT */}
      <section className="sec-sm">
        <div className="wrap">
          <div className="callout">
            <div>
              <div className="eyebrow light">Онлайн-калькулятор</div>
              <h2>Сколько будет стоить <em>ваш ремонт?</em></h2>
              <p>Ответьте на 3 вопроса — получите смету по материалам, работам и оборудованию.</p>
            </div>
            <Link className="btn btn-light" href="/calculator">Рассчитать за 5 минут <span className="ico">→</span></Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sec">
        <div className="wrap">
          <div className="eyebrow">Как это работает</div>
          <h2 style={{ margin: '8px 0 28px', fontSize: 'clamp(22px,2.8vw,32px)' }}>Просто начать. <em>Легко закончить</em></h2>
          <div className="steps-grid">
            <div><div className="n">01</div><h3>Расскажите о задаче</h3><p>Оставьте заявку или начните с расчёта в калькуляторе.</p></div>
            <div><div className="n">02</div><h3>Получите смету</h3><p>Подберём материалы и мастера под бюджет и сроки.</p></div>
            <div><div className="n">03</div><h3>Работаем</h3><p>Прораб контролирует каждый этап, вы видите фото-отчёты.</p></div>
            <div><div className="n">04</div><h3>Принимаете результат</h3><p>Гарантия 12 месяцев на все работы.</p></div>
          </div>
        </div>
      </section>

      {/* SALES */}
      <section className="sec sec-cream">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Выгодно</div>
              <h2>Скидки <em>этой недели</em></h2>
            </div>
            <Link className="sec-link" href="/catalog?sale=1">Все акции →</Link>
          </div>
          <ProductRail items={sales.slice(0, 10)} />
        </div>
      </section>

      {/* REVIEWS */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Нам доверяют</div>
              <h2>Отзывы <em>клиентов</em></h2>
            </div>
            <Link className="sec-link" href="/reviews">Все отзывы →</Link>
          </div>
          <Rail>
            {reviews.slice(0, 8).map((r) => (
              <article className="rcard" key={r.id}>
                <div className="who">
                  {r.avatar && <img src={r.avatar} alt="" />}
                  <div><b>{r.authorName}</b><span> · {new Date(r.createdAt).toLocaleDateString('ru-RU')}</span></div>
                </div>
                <Stars value={r.rating} size={13} />
                <p>{r.text}</p>
              </article>
            ))}
          </Rail>
        </div>
      </section>

      {/* BRANDS */}
      <section className="sec-sm sec-cream">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 20 }}>Работаем с брендами</div>
          <div className="brands">
            {brands.slice(0, 12).map((b) => (
              <div key={b.slug}>{b.name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Советы по ремонту</div>
              <h2>Разбираемся <em>вместе</em></h2>
            </div>
            <Link className="sec-link" href="/blog">Все статьи →</Link>
          </div>
          <div className="grid g-3">
            {articles.slice(0, 3).map((a) => (
              <Link className="acard" href={`/blog/${a.slug}`} key={a.id}>
                <img src={a.image} alt={a.title} />
                <div className="acard-body">
                  <span className="cat">{a.category}</span>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <span className="more">Читать · {a.readMin} мин →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="sec-sm">
        <Newsletter />
      </section>

      {/* FAQ + LEAD */}
      <section className="sec sec-cream">
        <div className="wrap grid g-2" style={{ alignItems: 'start', gap: 50 }}>
          <div>
            <div className="eyebrow">Частые вопросы</div>
            <h2 style={{ margin: '8px 0 26px', fontSize: 'clamp(24px,3vw,34px)' }}>Коротко о главном</h2>
            <FaqList items={faqGeneral} />
          </div>
          <div>
            <div className="eyebrow">Есть вопрос?</div>
            <h2 style={{ margin: '8px 0 20px', fontSize: 'clamp(24px,3vw,34px)' }}>Давайте обсудим <em>ваш проект</em></h2>
            <LeadForm
              compact
              fields={[
                { name: 'name', label: 'Ваше имя', placeholder: 'Как к вам обращаться?', required: true },
                { name: 'phone', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
                { name: 'msg', label: 'Что нужно сделать?', type: 'textarea', placeholder: 'Коротко о задаче' },
              ]}
            />
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
