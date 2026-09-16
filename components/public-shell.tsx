import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export function PublicShell({
  children,
  title,
  eyebrow,
  subtitle,
  crumbs,
  heroMode = false,
}: {
  children: React.ReactNode
  title?: string
  eyebrow?: string
  subtitle?: string
  crumbs?: { label: string; href?: string }[]
  heroMode?: boolean
}) {
  return (
    <main className="site-shell">
      <SiteHeader heroMode={heroMode} />
      {(title || crumbs) && (
        <section className="wrap page-hero">
          {crumbs && (
            <nav className="crumbs">
              {crumbs.map((c, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  {c.href ? <a href={c.href}>{c.label}</a> : <b>{c.label}</b>}
                  {i < crumbs.length - 1 && <span>→</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </section>
      )}
      {children}
      <SiteFooter />
    </main>
  )
}

export function DataCard({ children }: { children: React.ReactNode }) {
  return <article className="data-card">{children}</article>
}
