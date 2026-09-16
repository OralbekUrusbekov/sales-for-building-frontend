'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000/api'

const TOKEN_KEY = 'rh-token'
const REFRESH_KEY = 'rh-refresh'

export const authStore = {
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

export type User = {
  id: number
  email: string
  name: string
  phone: string
  role: string
  is_active: boolean
  created_at: string
}

class AuthError extends Error {}

function friendly(status: number, detail: unknown): string {
  if (typeof detail === 'string') {
    if (/incorrect email or password/i.test(detail)) return 'Неверный email или пароль'
    if (/already registered/i.test(detail)) return 'Этот email уже зарегистрирован'
    if (/account disabled/i.test(detail)) return 'Аккаунт отключён'
    return detail
  }
  if (Array.isArray(detail)) return 'Проверьте введённые данные'
  if (status >= 500) return 'Сервер недоступен. Попробуйте позже.'
  return `Ошибка ${status}`
}

export async function authFetch<T = unknown>(
  path: string,
  opts: Omit<RequestInit, 'body'> & { body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { body, auth = true, headers, ...rest } = opts
  const h = new Headers(headers)
  if (body !== undefined) h.set('Content-Type', 'application/json')
  if (auth) {
    const t = authStore.get()
    if (t) h.set('Authorization', `Bearer ${t}`)
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: h,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (res.status === 204) return undefined as T
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) throw new AuthError(friendly(res.status, data?.detail))
  return data as T
}

async function tokenLogin(email: string, password: string) {
  const form = new URLSearchParams({ username: email, password })
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new AuthError(friendly(res.status, data?.detail))
  authStore.set(data.access_token, data.refresh_token)
}

type AuthState = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>
  refresh: () => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMe = useCallback(async () => {
    if (!authStore.get()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      setUser(await authFetch<User>('/auth/me'))
    } catch {
      authStore.clear()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  const login = useCallback(
    async (email: string, password: string) => {
      await tokenLogin(email, password)
      setLoading(true)
      await loadMe()
    },
    [loadMe],
  )

  const register = useCallback(
    async (d: { name: string; email: string; phone: string; password: string }) => {
      const data = await authFetch<{ access_token: string; refresh_token: string }>('/auth/register', {
        method: 'POST',
        auth: false,
        body: d,
      })
      authStore.set(data.access_token, data.refresh_token)
      setLoading(true)
      await loadMe()
    },
    [loadMe],
  )

  const logout = useCallback(() => {
    authStore.clear()
    setUser(null)
  }, [])

  return (
    <Ctx.Provider value={{ user, loading, login, register, refresh: loadMe, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
