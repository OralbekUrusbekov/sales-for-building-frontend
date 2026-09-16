import { AccountShell } from '@/components/account-shell'

const items = [
  ['RH-Z-204', 'Ремонт ванной под ключ', 'Замер назначен', 'Завтра, 14:00'],
  ['RH-Z-198', 'Вызов электрика', 'Мастер назначен', 'Данияр Н.'],
  ['RH-Z-181', 'Смета из калькулятора', 'Обработана', 'Отправлена на почту'],
]

export default function AccountRequestsPage() {
  return (
    <AccountShell title="Мои заявки">
      <div className="grid" style={{ gap: 12 }}>
        {items.map(([n, title, status, extra]) => (
          <article className="card" style={{ padding: 22 }} key={n}>
            <div className="tag" style={{ marginBottom: 8 }}>{status}</div>
            <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>{title}</h3>
            <small style={{ color: 'var(--muted)' }}>№{n} · {extra}</small>
          </article>
        ))}
      </div>
    </AccountShell>
  )
}
