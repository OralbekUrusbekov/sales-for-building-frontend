'use client'
import { useState } from 'react'
import { useUi } from '@/lib/ui-store'

type Field = { name: string; label: string; type?: 'text' | 'tel' | 'textarea' | 'email'; placeholder?: string; required?: boolean }

export function LeadForm({
  fields,
  submitLabel = 'Отправить заявку',
  successText = 'Заявка принята — менеджер свяжется с вами в ближайшее время.',
  compact = false,
}: {
  fields: Field[]
  submitLabel?: string
  successText?: string
  compact?: boolean
}) {
  const { showToast } = useUi()
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="form-card" style={compact ? { maxWidth: 'none' } : undefined}>
        <div className="tag">Готово</div>
        <h3 style={{ margin: 0 }}>Спасибо!</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>{successText}</p>
      </div>
    )
  }

  return (
    <form
      className="form-card"
      style={compact ? { maxWidth: 'none' } : undefined}
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
        showToast('Заявка отправлена')
      }}
    >
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          {f.type === 'textarea' ? (
            <textarea className="input" placeholder={f.placeholder} required={f.required} />
          ) : (
            <input className="input" type={f.type || 'text'} placeholder={f.placeholder} required={f.required} />
          )}
        </label>
      ))}
      <button className="btn btn-green" type="submit">
        {submitLabel} <span className="ico">→</span>
      </button>
      <small style={{ color: 'var(--muted)', fontSize: 11 }}>
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
      </small>
    </form>
  )
}
