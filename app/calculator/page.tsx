'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PublicShell } from '@/components/public-shell'
import { money } from '@/lib/remonthub-data'
import { useCart } from '@/lib/cart-store'
import { products } from '@/lib/data/products'
import { useUi } from '@/lib/ui-store'

const rooms = [
  { key: 'Ванная', factor: 1.35 },
  { key: 'Кухня', factor: 1.2 },
  { key: 'Комната', factor: 1 },
  { key: 'Коридор', factor: 0.9 },
  { key: 'Квартира целиком', factor: 1.1 },
]
const works = [
  { key: 'Демонтаж', perM2: 2200 },
  { key: 'Штукатурка и шпаклёвка', perM2: 3800 },
  { key: 'Электрика', perM2: 3200 },
  { key: 'Плитка', perM2: 6500 },
  { key: 'Сантехника', perM2: 2800 },
  { key: 'Покраска и обои', perM2: 2600 },
  { key: 'Напольное покрытие', perM2: 3400 },
  { key: 'Потолок', perM2: 2400 },
]

export default function CalculatorPage() {
  const router = useRouter()
  const add = useCart((s) => s.add)
  const { showToast } = useUi()
  const [step, setStep] = useState(1)
  const [room, setRoom] = useState(rooms[0])
  const [area, setArea] = useState(12)
  const [selected, setSelected] = useState<string[]>(['Демонтаж', 'Штукатурка и шпаклёвка', 'Плитка'])

  const r = useMemo(() => {
    const chosen = works.filter((w) => selected.includes(w.key))
    const labor = chosen.map((w) => ({ label: w.key, sum: Math.round(w.perM2 * area * room.factor) }))
    const laborTotal = labor.reduce((s, x) => s + x.sum, 0)
    const materials = Math.round(laborTotal * 0.7)
    const equipment = Math.round(laborTotal * 0.12)
    return { labor, laborTotal, materials, equipment, total: laborTotal + materials + equipment }
  }, [area, room, selected])

  const addMaterials = () => {
    products.filter((p) => ['suhie-smesi', 'plitka-i-keramogranit', 'kraski-i-otdelka'].includes(p.categorySlug))
      .slice(0, 4)
      .forEach((p) => add(p))
    showToast('Базовые материалы добавлены в корзину')
  }

  return (
    <PublicShell
      eyebrow="Онлайн-калькулятор"
      title="Калькулятор ремонта"
      subtitle="Ответьте на 3 вопроса — получите предварительную смету по материалам, работам и оборудованию."
      crumbs={[{ label: 'Главная', href: '/' }, { label: 'Калькулятор' }]}
    >
      <section className="wrap sec-sm calc">
        <div className="stepper">
          {[1, 2, 3, 4].map((x) => <span className={step >= x ? 'step-active' : ''} key={x}>{x}</span>)}
        </div>

        {step === 1 && (
          <div className="form-card">
            <h2>Что будем ремонтировать?</h2>
            <div className="choice-grid">
              {rooms.map((x) => (
                <button type="button" className={room.key === x.key ? 'choice-active' : ''} onClick={() => setRoom(x)} key={x.key}>{x.key}</button>
              ))}
            </div>
            <button className="btn btn-green" onClick={() => setStep(2)}>Далее <span className="ico">→</span></button>
          </div>
        )}

        {step === 2 && (
          <div className="form-card">
            <h2>Площадь помещения</h2>
            <label>
              Площадь: <b>{area} м²</b>
              <input className="calc-slider" type="range" min={4} max={120} value={area} onChange={(e) => setArea(Number(e.target.value))} />
            </label>
            <input className="input" type="number" min={1} value={area} onChange={(e) => setArea(Math.max(1, Number(e.target.value) || 1))} />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-light" onClick={() => setStep(1)}>← Назад</button>
              <button className="btn btn-green" onClick={() => setStep(3)}>Далее <span className="ico">→</span></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-card">
            <h2>Какие работы нужны?</h2>
            <div className="choice-grid">
              {works.map((x) => (
                <button
                  type="button"
                  key={x.key}
                  className={selected.includes(x.key) ? 'choice-active' : ''}
                  onClick={() => setSelected(selected.includes(x.key) ? selected.filter((y) => y !== x.key) : [...selected, x.key])}
                >
                  {x.key}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-light" onClick={() => setStep(2)}>← Назад</button>
              <button className="btn btn-green" onClick={() => setStep(4)}>Смета <span className="ico">→</span></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="summary" style={{ position: 'static' }}>
            <h2>{room.key}, {area} м²</h2>
            {r.labor.map((x) => (
              <div className="summary-row" key={x.label}><span>{x.label}</span><strong>{money(x.sum)}</strong></div>
            ))}
            <div className="summary-row"><span>Материалы</span><strong>{money(r.materials)}</strong></div>
            <div className="summary-row"><span>Оборудование и расходники</span><strong>{money(r.equipment)}</strong></div>
            <div className="summary-total"><span>Итого</span><span>{money(r.total)}</span></div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
              <button className="btn btn-light" onClick={() => setStep(3)}>← Изменить</button>
              <button className="btn btn-ghost" onClick={addMaterials}>Добавить материалы в корзину</button>
              <button className="btn btn-green" onClick={() => router.push('/request')}>Отправить смету <span className="ico">→</span></button>
            </div>
          </div>
        )}
      </section>

      <section className="sec sec-cream">
        <div className="wrap">
          <div className="prose">
            <div className="block-head"><h2>Как считается смета</h2></div>
            <p>
              Калькулятор даёт ориентир: стоимость работ рассчитывается по средним расценкам за м² с
              коэффициентом на тип помещения, материалы — как доля от работ, плюс аренда и расходники.
              Точную смету составляет прораб после бесплатного замера.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
