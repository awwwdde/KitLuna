import type { Lang } from '@/i18n/lang'

/** Одна ширина для плавающего header и футера в контактах */
export const shellWidthClass =
  'w-[calc(100%-2rem)] max-w-[56rem] md:w-[calc(100%-3.5rem)] md:max-w-[64rem]'

export const panelClass =
  'rounded-2xl border border-white/[0.14] bg-black/25 text-white shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150'

export const shellNavBtnClass =
  'font-[family-name:var(--font-ui)] border-b border-transparent px-1 py-1 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/70 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

export const shellLinkClass =
  'font-[family-name:var(--font-ui)] text-[0.75rem] text-white/60 transition hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

export const NAV: readonly { id: string; label: Record<Lang, string> }[] = [
  { id: 'philosophy', label: { ru: 'Философия', en: 'Philosophy' } },
  { id: 'work', label: { ru: 'Работа', en: 'Process' } },
  { id: 'portfolio', label: { ru: 'Портфолио', en: 'Portfolio' } },
  { id: 'contacts', label: { ru: 'Контакты', en: 'Contacts' } },
]
