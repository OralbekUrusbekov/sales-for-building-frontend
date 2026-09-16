import Link from 'next/link'
import { getArticles } from '@/lib/api/public'
import { PublicShell } from '@/components/public-shell'

export const metadata = { title: 'Советы по ремонту — RemontHub' }

export default async function BlogPage() {
  const articles = await getArticles()
  const cats = Array.from(new Set(articles.map((a) => a.category)))
  const [featured, ...rest] = articles
  if (!featured) return null

  return (
    <PublicShell
      eyebrow="Советы по ремонту"
      title="Разбираемся вместе"
      subtitle="Короткие гайды о расчётах, технологиях и выборе мастеров — без воды."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Советы' }]}
    >
      <section className="wrap sec-sm">
        <div className="rev-filter" style={{ marginBottom: 26 }}>
          <span className="chip chip-btn on">Все</span>
          {cats.map((c) => <span className="chip chip-btn" key={c}>{c}</span>)}
        </div>

        <Link className="card" href={`/blog/${featured.slug}`} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', overflow: 'hidden', marginBottom: 30 }}>
          <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', minHeight: 300, objectFit: 'cover' }} />
          <div style={{ padding: 34 }}>
            <span className="acard-body" style={{ padding: 0 }}>
              <span className="cat" style={{ color: 'var(--green-dark)', fontSize: 11, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                {featured.category}
              </span>
            </span>
            <h2 style={{ margin: '10px 0 12px' }}>{featured.title}</h2>
            <p style={{ color: 'var(--muted)' }}>{featured.excerpt}</p>
            <span className="btn btn-green btn-sm" style={{ marginTop: 8 }}>Читать · {featured.readMin} мин</span>
          </div>
        </Link>

        <div className="grid g-3">
          {rest.map((a) => (
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
      </section>
    </PublicShell>
  )
}
