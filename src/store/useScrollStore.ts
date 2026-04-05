import { create } from 'zustand'

type ScrollState = {
  /** 0…1 — прогресс страницы (Lenis). */
  scrollProgress: number
  setScrollProgress: (v: number) => void
}

export const useScrollStore = create<ScrollState>(set => ({
  scrollProgress: 0,
  setScrollProgress: scrollProgress => set({ scrollProgress }),
}))
