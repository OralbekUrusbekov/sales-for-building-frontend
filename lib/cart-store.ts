'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

type CartLine = { product: Product; quantity: number }
type CartState = { lines: CartLine[]; promo: string; add: (product: Product) => void; setQuantity: (id: string, quantity: number) => void; remove: (id: string) => void; setPromo: (promo: string) => void; clear: () => void }
export const useCart = create<CartState>()(persist((set) => ({ lines: [], promo: '', add: (product) => set((state) => { const found = state.lines.find((line) => line.product.id === product.id); return { lines: found ? state.lines.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...state.lines, { product, quantity: 1 }] } }), setQuantity: (id, quantity) => set((state) => ({ lines: quantity > 0 ? state.lines.map((line) => line.product.id === id ? { ...line, quantity } : line) : state.lines.filter((line) => line.product.id !== id) })), remove: (id) => set((state) => ({ lines: state.lines.filter((line) => line.product.id !== id) })), setPromo: (promo) => set({ promo }), clear: () => set({ lines: [], promo: '' }) }), { name: 'remonthub-cart' }))
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
export type { CartLine }
