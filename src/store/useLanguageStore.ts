import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '@/i18n/lang'

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'ru'
  const l = window.navigator.language?.toLowerCase() ?? ''
  return l.startsWith('ru') ? 'ru' : 'en'
}

type LanguageState = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: detectInitialLang(),
      setLang: lang => set({ lang }),
      toggleLang: () => set({ lang: get().lang === 'ru' ? 'en' : 'ru' }),
    }),
    {
      name: 'kitluna:lang',
      version: 1,
      partialize: state => ({ lang: state.lang }),
    }
  )
)

