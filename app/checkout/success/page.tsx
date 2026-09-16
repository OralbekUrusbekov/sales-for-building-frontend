import Link from 'next/link'
import { PublicShell } from '@/components/public-shell'

export const metadata = { title: 'Заказ оформлен — RemontHub' }

export default function SuccessPage() {
  return (
    <PublicShell eyebrow="Готово" title="Заказ оформлен">
      <section className="wrap sec-sm">
        <div className="empty">
          <div className="tag" style={{ marginBottom: 14 }}>Заказ принят</div>
          <h2>Спасибо! Заказ №RH-1051 в работе</h2>
          <p style={{ color: 'var(--muted)' }}>
            Менеджер свяжется с вами для подтверждения доставки. Статус можно отслеживать в личном кабинете.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
            <Link href="/account/orders" className="btn btn-green">Мои заказы <span className="ico">→</span></Link>
            <Link href="/catalog" className="btn btn-light">В каталог</Link>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
