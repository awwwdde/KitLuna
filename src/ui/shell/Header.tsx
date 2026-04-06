import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useCallback } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useAudioStore } from '@/store/useAudioStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useScrollStore } from '@/store/useScrollStore'
import type { Lang } from '@/i18n/lang'
import { NAV, panelClass, shellNavBtnClass, shellWidthClass } from '@/ui/shell/shared'

const HEADER_THRESHOLD = 0.065

export function Header() {
  const scrollProgress = useScrollStore(s => s.scrollProgress)
  const lenis = useLenis()
  const unlocked = useAudioStore(s => s.unlocked)
  const soundOn = useAudioStore(s => s.soundOn)
  const unlock = useAudioStore(s => s.unlock)
  const toggleSound = useAudioStore(s => s.toggleSound)
  const lang = useLanguageStore(s => s.lang)
  const setLang = useLanguageStore(s => s.setLang)

  const isHeader = scrollProgress > HEADER_THRESHOLD

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

  const sectionsAriaLabel = lang === 'ru' ? 'Разделы сайта' : 'Site sections'

  return (
    <>
      <div
        className="pointer-events-none fixed right-4 top-[calc(14px+env(safe-area-inset-top,0px))] z-40"
        aria-label={lang === 'ru' ? 'Настройки' : 'Controls'}
      >
        <div className="pointer-events-auto">
          <TopRightControls
            unlocked={unlocked}
            soundOn={soundOn}
            unlock={unlock}
            toggleSound={toggleSound}
            lang={lang}
            setLang={setLang}
          />
        </div>
      </div>

      <motion.aside
        className={`pointer-events-none fixed left-1/2 z-30 -translate-x-1/2 ${shellWidthClass}`}
        initial={false}
        animate={
          isHeader
            ? { top: 14, bottom: 'auto' }
            : { top: 'auto', bottom: 'calc(35px + env(safe-area-inset-bottom, 0px))' }
        }
        transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.7 }}
        aria-label="KitLuna"
      >
        <div className={`pointer-events-auto w-full ${panelClass}`}>
          <div className={`relative w-full px-4 py-3 sm:px-5 ${isHeader ? 'sm:py-3.5' : 'sm:py-4'}`}>
            <div className="flex items-center justify-between gap-4">
              <span className="font-display shrink-0 text-base font-semibold tracking-tight text-white sm:text-lg">
                Kitluna
              </span>

              <nav
                className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-end"
                aria-label={sectionsAriaLabel}
              >
                {NAV.map(link => (
                  <button
                    key={link.id}
                    type="button"
                    className={shellNavBtnClass}
                    onClick={() => go(`#${link.id}`)}
                  >
                    {link.label[lang]}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

function TopRightControls({
  unlocked,
  soundOn,
  unlock,
  toggleSound,
  lang,
  setLang,
}: {
  unlocked: boolean
  soundOn: boolean
  unlock: () => void
  toggleSound: () => void
  lang: Lang
  setLang: (lang: Lang) => void
}) {
  const textBtn =
    'font-[family-name:var(--font-ui)] cursor-pointer text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/65 transition hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

  const iconBtn =
    'inline-flex h-8 w-8 items-center justify-center cursor-pointer text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

  const enableSoundLabel = lang === 'ru' ? 'Включить звук' : 'Enable sound'
  const muteSoundLabel = lang === 'ru' ? 'Выключить звук' : 'Mute sound'
  const unmuteSoundLabel = lang === 'ru' ? 'Включить звук' : 'Unmute sound'

  const ToggleIcon = soundOn ? VolumeX : Volume2

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`${textBtn} ${lang === 'ru' ? 'text-white/90' : ''}`}
          onClick={() => setLang('ru')}
          aria-pressed={lang === 'ru'}
        >
          RU
        </button>
        <button
          type="button"
          className={`${textBtn} ${lang === 'en' ? 'text-white/90' : ''}`}
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
      </div>

      <div className="flex items-center">
        {!unlocked && (
          <button type="button" className={iconBtn} onClick={unlock} aria-label={enableSoundLabel}>
            <Volume2 className="h-4 w-4" aria-hidden />
            <span className="sr-only">{enableSoundLabel}</span>
          </button>
        )}
        {unlocked && (
          <button
            type="button"
            className={iconBtn}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? muteSoundLabel : unmuteSoundLabel}
          >
            <ToggleIcon className="h-4 w-4" aria-hidden />
            <span className="sr-only">{soundOn ? muteSoundLabel : unmuteSoundLabel}</span>
          </button>
        )}
      </div>
    </div>
  )
}
