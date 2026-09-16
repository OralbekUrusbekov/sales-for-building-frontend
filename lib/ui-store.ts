'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

type UiState = {
  quickView: Product | null
  openQuickView: (p: Product) => void
  closeQuickView: () => void
  toast: string | null
  showToast: (msg: string) => void
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
}

let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useUi = create<UiState>((set) => ({
  quickView: null,
  openQuickView: (p) => set({ quickView: p }),
  closeQuickView: () => set({ quickView: null }),
  toast: null,
  showToast: (msg) => {
    set({ toast: msg })
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => set({ toast: null }), 2400)
  },
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
}))

type RecentState = { ids: string[]; push: (id: string) => void }
export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 8) })),
    }),
    { name: 'remonthub-recent' },
  ),
)
