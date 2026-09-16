'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, login as apiLogin, tokenStore } from './client'

type AdminUser = { id: number; email: string; name: string; role: string }
type AuthState = {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthState | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMe = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await api<AdminUser>('/auth/me')
      if (me.role === 'admin' || me.role === 'manager') setUser(me)
      else {
        tokenStore.clear()
        setUser(null)
      }
    } catch {
      tokenStore.clear()
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
      await apiLogin(email, password)
      setLoading(true)
      await loadMe()
    },
    [loadMe],
  )

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
