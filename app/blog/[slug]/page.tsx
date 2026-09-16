import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticle, getArticles } from '@/lib/api/public'
import { PublicShell } from '@/components/public-shell'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = await getArticle(slug)
  return { title: a ? `${a.title} — RemontHub` : 'Статья не найдена' }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = await getArticle(slug)
  if (!a) notFound()
  const more = (await getArticles()).filter((x) => x.slug !== a.slug).slice(0, 3)

  return (
    <PublicShell
      title={a.title}
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Советы', href: '/blog' }, { label: a.title }]}
    >
      <section className="sec-sm">
        <div className="wrap">
          <div className="article-split">
            <div className="art-media">
              <img src={a.image} alt={a.title} />
              <div className="meta">
                {new Date(a.date).toLocaleDateString('ru-RU')} · {a.readMin} мин чтения
              </div>
            </div>
            <div className="article-body">
              {a.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="card" style={{ padding: 22, marginTop: 20 }}>
                <b>Нужна помощь с расчётом?</b>
                <p style={{ color: 'var(--muted)', fontSize: 14, margin: '6px 0 12px' }}>
                  Посчитаем количество материалов по вашим замерам или в калькуляторе.
                </p>
                <Link className="btn btn-green btn-sm" href="/calculator">Открыть калькулятор</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-cream">
        <div className="wrap">
          <div className="sec-head">
            <h2>Ещё <em>по теме</em></h2>
            <Link className="sec-link" href="/blog">Все статьи →</Link>
          </div>
          <div className="grid g-3">
            {more.map((x) => (
              <Link className="acard" href={`/blog/${x.slug}`} key={x.id}>
                <img src={x.image} alt={x.title} />
                <div className="acard-body">
                  <span className="cat">{x.category}</span>
                  <h3>{x.title}</h3>
                  <span className="more">Читать →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
