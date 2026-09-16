'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useUi } from '@/lib/ui-store'
import { useCart } from '@/lib/cart-store'
import { money } from '@/lib/remonthub-data'
import { img } from '@/lib/img'
import { Stars } from '@/components/stars'

export function Chrome() {
  const { quickView, closeQuickView, toast, showToast } = useUi()
  const add = useCart((s) => s.add)
  const [chat, setChat] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeQuickView()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeQuickView])

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      {quickView && (
        <div className="modal-back" onClick={closeQuickView}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={closeQuickView} aria-label="Закрыть">×</button>
            <div className="modal-grid">
              <img src={img(quickView.image)} alt={quickView.name} />
              <div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                  {quickView.category} · {quickView.brand}
                </div>
                <h2 style={{ margin: '10px 0', fontSize: 24 }}>{quickView.name}</h2>
                <div className="pcard-rating" style={{ marginBottom: 12 }}>
                  <Stars value={quickView.rating} size={14} />
                  <span>{quickView.rating.toFixed(1)} · {quickView.reviewCount}</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>{quickView.shortDescription}</p>
                <div className="pdp-price">
                  <b>{money(quickView.price)}</b>
                  {quickView.oldPrice && <del>{money(quickView.oldPrice)}</del>}
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>/ {quickView.unit}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-green"
                    onClick={() => {
                      add(quickView)
                      showToast('Добавлено в корзину')
                      closeQuickView()
                    }}
                  >
                    В корзину <span className="ico">→</span>
                  </button>
                  <Link className="btn btn-light" href={`/catalog/${quickView.slug}`} onClick={closeQuickView}>
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

      <button className="chat-btn" onClick={() => setChat((v) => !v)} aria-label="Чат">
        {chat ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
      {chat && (
        <div
          style={{
            position: 'fixed',
            right: 22,
            bottom: 90,
            zIndex: 30,
            width: 280,
            padding: 20,
            borderRadius: 18,
            background: '#fff',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <strong>Здравствуйте!</strong>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: '8px 0 14px' }}>
            Подскажем с материалами, расчётом или подбором мастера.
          </p>
          <Link className="btn btn-green btn-block btn-sm" href="/request">
            Оставить заявку
          </Link>
        </div>
      )}
    </>
  )
}
