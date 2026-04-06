import { useCallback } from 'react'
import { useLenis } from 'lenis/react'
import { NAV, panelClass, shellLinkClass, shellNavBtnClass, shellWidthClass } from '@/ui/shell/shared'
import { useLanguageStore } from '@/store/useLanguageStore'

export function Footer() {
  const lenis = useLenis()
  const lang = useLanguageStore(s => s.lang)

  const go = useCallback(
    (hash: string) => {
      lenis?.scrollTo(hash, {
        offset: 0,
        duration: 1.15,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    },
    [lenis]
  )

  const footerAriaLabel = lang === 'ru' ? 'Подвал сайта' : 'Footer'
  const footerNavAriaLabel = lang === 'ru' ? 'Навигация в подвале' : 'Footer navigation'
  const copyrightStudio = lang === 'ru' ? 'Цифровая дизайн-студия' : 'Digital design studio'
  const emailLabel = lang === 'ru' ? 'Почта' : 'Email'
  const privacyLabel = lang === 'ru' ? 'Политика конфиденциальности' : 'Privacy policy'
  const madeBy = lang === 'ru' ? 'сделано @awwwdde' : 'made by @awwwdde'

  return (
    <div className={`mx-auto mt-10 md:mt-12 ${shellWidthClass}`}>
      <footer className={panelClass} aria-label={footerAriaLabel}>
        <div className="px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="font-display text-center text-base font-semibold tracking-tight text-white sm:text-left sm:text-lg">
              Kitluna
            </span>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-end"
              aria-label={footerNavAriaLabel}
            >
              {NAV.map(link => (
                <button key={link.id} type="button" className={shellNavBtnClass} onClick={() => go(`#${link.id}`)}>
                  {link.label[lang]}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-3 flex flex-col items-center gap-2.5 border-t border-white/[0.08] pt-3 sm:flex-row sm:justify-between">
            <p className="font-[family-name:var(--font-ui)] text-center text-[0.68rem] text-white/35 sm:text-left">
              © {new Date().getFullYear()} Kitluna · {copyrightStudio}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
              <a href="mailto:hello@kitluna.studio" className={shellLinkClass}>
                {emailLabel}
              </a>
              <a href="https://t.me/BITLUNA_IT" target="_blank" rel="noopener noreferrer" className={shellLinkClass}>
                Telegram
              </a>
              <a href="https://www.behance.net/" target="_blank" rel="noopener noreferrer" className={shellLinkClass}>
                Behance
              </a>
              <a href="#" className={shellLinkClass}>
                {privacyLabel}
              </a>
            </div>
          </div>

          <p className="mt-2.5 text-center font-[family-name:var(--font-ui)] text-[0.62rem] tracking-wide text-white/22 sm:text-right">
            {madeBy}
          </p>
        </div>
      </footer>
    </div>
  )
}
