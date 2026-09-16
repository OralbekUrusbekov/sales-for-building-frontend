'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart, cartSubtotal } from '@/lib/cart-store'
import { money } from '@/lib/remonthub-data'

const schema = z.object({
  name: z.string().min(2, 'Введите имя'),
  phone: z.string().min(10, 'Введите телефон'),
  address: z.string().min(5, 'Введите адрес'),
  delivery: z.enum(['delivery', 'pickup']),
  payment: z.enum(['card', 'cash', 'kaspi']),
  comment: z.string().optional(),
})
type Values = z.infer<typeof schema>

export function CheckoutForm() {
  const router = useRouter()
  const lines = useCart((s) => s.lines)
  const clear = useCart((s) => s.clear)
  const subtotal = cartSubtotal(lines)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { delivery: 'delivery', payment: 'kaspi' },
  })
  const delivery = watch('delivery')
  const shipping = delivery === 'pickup' ? 0 : 2500
  const total = subtotal + (lines.length ? shipping : 0)

  const submit = () => {
    clear()
    router.push('/checkout/success')
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="checkout-grid">
      <div className="form-card" style={{ maxWidth: 'none' }}>
        <h2>Контактные данные</h2>
        <label>Имя получателя<input className="input" {...register('name')} placeholder="Например, Алия" />{errors.name && <small className="field-error">{errors.name.message}</small>}</label>
        <label>Телефон<input className="input" {...register('phone')} placeholder="+7 (___) ___-__-__" />{errors.phone && <small className="field-error">{errors.phone.message}</small>}</label>
        <label>Адрес доставки<input className="input" {...register('address')} placeholder="Город, улица, дом, квартира" />{errors.address && <small className="field-error">{errors.address.message}</small>}</label>

        <div style={{ fontWeight: 700, marginTop: 8 }}>Способ получения</div>
        <label className="radio-card"><input type="radio" value="delivery" {...register('delivery')} /> Доставка на завтра <small>2 500 ₸</small></label>
        <label className="radio-card"><input type="radio" value="pickup" {...register('delivery')} /> Самовывоз со склада <small>Бесплатно</small></label>

        <div style={{ fontWeight: 700, marginTop: 8 }}>Способ оплаты</div>
        <label className="radio-card"><input type="radio" value="kaspi" {...register('payment')} /> Kaspi QR / рассрочка <small /></label>
        <label className="radio-card"><input type="radio" value="card" {...register('payment')} /> Банковская карта <small /></label>
        <label className="radio-card"><input type="radio" value="cash" {...register('payment')} /> Наличными при получении <small /></label>

        <label>Комментарий<textarea className="input" {...register('comment')} placeholder="Код домофона, этаж, пожелания" /></label>

        <button className="btn btn-green" type="submit">Подтвердить заказ <span className="ico">→</span></button>
      </div>

      <aside className="summary">
        <h3>Ваш заказ</h3>
        {lines.length ? (
          lines.map((l) => (
            <div className="summary-row" key={l.product.id}>
              <span>{l.product.name} × {l.quantity}</span>
              <strong>{money(l.product.price * l.quantity)}</strong>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--muted)' }}>
            Корзина пуста. <Link href="/catalog" style={{ color: 'var(--green-dark)' }}>В каталог</Link>
          </p>
        )}
        {lines.length > 0 && (
          <div className="summary-row">
            <span>Доставка</span>
            <strong>{shipping ? money(shipping) : 'Бесплатно'}</strong>
          </div>
        )}
        <div className="summary-total"><span>Итого</span><span>{money(total)}</span></div>
      </aside>
    </form>
  )
}
