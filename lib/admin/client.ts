'use client'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000/api'

const TOKEN_KEY = 'rh-admin-token'
const REFRESH_KEY = 'rh-admin-refresh'

export const tokenStore = {
  get: () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)),
  getRefresh: () => (typeof window === 'undefined' ? null : localStorage.getItem(REFRESH_KEY)),
  set: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type Opts = Omit<RequestInit, 'body'> & { body?: unknown; auth?: boolean }

export async function api<T = unknown>(path: string, opts: Opts = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = opts
  const h = new Headers(headers)
  if (body !== undefined && !(body instanceof FormData)) h.set('Content-Type', 'application/json')
  if (auth) {
    const t = tokenStore.get()
    if (t) h.set('Authorization', `Bearer ${t}`)
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: h,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  })

  if (res.status === 204) return undefined as T
  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    let detail: string
    if (data && Array.isArray(data.detail)) {
      // pydantic validation error — show the field, keep it short
      const first = data.detail[0]
      const field = Array.isArray(first?.loc) ? first.loc[first.loc.length - 1] : ''
      detail = field ? `Проверьте поле «${field}»` : 'Проверьте введённые данные'
    } else if (data && typeof data.detail === 'string') {
      detail = data.detail
    } else if (res.status === 401) {
      detail = 'Сессия истекла — войдите заново'
    } else if (res.status >= 500) {
      detail = 'Сервер недоступен. Попробуйте позже.'
    } else {
      detail = `Ошибка ${res.status}`
    }
    throw new ApiError(res.status, detail)
  }
  return data as T
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const data = await api<{ url: string }>('/manage/uploads', { method: 'POST', body: form })
  return data.url
}

export async function login(email: string, password: string) {
  const form = new URLSearchParams({ username: email, password })
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data?.detail || 'Не удалось войти')
  tokenStore.set(data.access_token, data.refresh_token)
  return data
}
