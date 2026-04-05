import { useCallback } from 'react'
import { useLenis } from 'lenis/react'
import { NAV, panelClass, shellWidthClass } from '@/ui/shell/shared'

const navBtn =
  'font-[family-name:var(--font-ui)] border-b border-transparent px-1 py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/55 transition hover:border-white/40 hover:text-white/90'

const footerLink =
  'font-[family-name:var(--font-ui)] text-[0.72rem] text-white/45 transition hover:text-white/75'

export function Footer() {
  const lenis = useLenis()

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

  return (
    <div className={`mx-auto mt-16 md:mt-20 ${shellWidthClass}`}>
      <footer className={panelClass} aria-label="Подвал сайта">
        <div className="px-5 py-3.5 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <span className="font-display text-center text-lg font-semibold tracking-tight text-white sm:text-left sm:text-xl">
              Kitluna
            </span>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-end"
              aria-label="Навигация в подвале"
            >
              {NAV.map(link => (
                <button key={link.id} type="button" className={navBtn} onClick={() => go(`#${link.id}`)}>
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4 flex flex-col items-center gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:justify-between">
            <p className="font-[family-name:var(--font-ui)] text-center text-[0.7rem] text-white/35 sm:text-left">
              © {new Date().getFullYear()} Kitluna · Digital design studio
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
              <a href="mailto:hello@kitluna.studio" className={footerLink}>
                Почта
              </a>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className={footerLink}>
                Telegram
              </a>
              <a href="https://www.behance.net/" target="_blank" rel="noopener noreferrer" className={footerLink}>
                Behance
              </a>
              <a href="#" className={footerLink}>
                Политика конфиденциальности
              </a>
            </div>
          </div>

          <p className="mt-3 text-center font-[family-name:var(--font-ui)] text-[0.65rem] tracking-wide text-white/22 sm:text-right">
            made by @awwwdde
          </p>
        </div>
      </footer>
    </div>
  )
}
