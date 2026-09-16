import { PublicShell } from '@/components/public-shell'
import { CheckoutForm } from '@/components/checkout-form'

export const metadata = { title: 'Оформление заказа — RemontHub' }

export default function CheckoutPage() {
  return (
    <PublicShell
      eyebrow="Доставка и оплата"
      title="Оформление заказа"
      subtitle="Заполните данные получателя и выберите способ доставки — менеджер подтвердит заказ."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Корзина', href: '/cart' }, { label: 'Оформление' }]}
    >
      <section className="wrap sec-sm">
        <CheckoutForm />
      </section>
    </PublicShell>
  )
}
