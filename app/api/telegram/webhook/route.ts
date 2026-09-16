import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const update = await request.json().catch(() => ({}))
  const text = update?.message?.text ?? ''
  return NextResponse.json({ ok: true, request: { number: `#RH-TG-${Date.now().toString().slice(-5)}`, source: 'telegram', type: text.includes('мастер') ? 'master' : 'other', status: 'new' }, notification: { type: 'new_request', title: 'Новая заявка из Telegram', isRead: false } })
}
