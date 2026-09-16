'use client'
import { useState } from 'react'
import { useUi } from '@/lib/ui-store'

export function Newsletter() {
  const { showToast } = useUi()
  const [email, setEmail] = useState('')
  return (
    <div className="wrap">
      <div className="newsletter">
        <div>
          <h2>Скидки и советы по ремонту</h2>
          <p>Раз в неделю — акции на материалы и короткие гайды. Без спама.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setEmail('')
            showToast('Вы подписаны')
          }}
        >
          <input type="email" placeholder="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn btn-green" type="submit">Подписаться</button>
        </form>
      </div>
    </div>
  )
}
