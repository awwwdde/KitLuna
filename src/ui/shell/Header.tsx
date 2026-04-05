import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useCallback } from 'react'
import { useAudioStore } from '@/store/useAudioStore'
import { useScrollStore } from '@/store/useScrollStore'
import { NAV, panelClass, shellWidthClass } from '@/ui/shell/shared'

const HEADER_THRESHOLD = 0.065

export function Header() {
  const scrollProgress = useScrollStore(s => s.scrollProgress)
  const lenis = useLenis()
  const unlocked = useAudioStore(s => s.unlocked)
  const soundOn = useAudioStore(s => s.soundOn)
  const playing = useAudioStore(s => s.playing)
  const unlock = useAudioStore(s => s.unlock)
  const toggleSound = useAudioStore(s => s.toggleSound)

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

  return (
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
        <div
          className={`relative w-full px-[25px] ${isHeader ? 'py-3 sm:py-3.5' : 'py-6 sm:py-7'}`}
        >
          {isHeader ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <span className="font-display shrink-0 text-xl font-semibold tracking-tight text-white">
                  Kitluna
                </span>
                <nav className="flex flex-wrap gap-1.5 sm:gap-2" aria-label="Разделы сайта">
                  {NAV.map(link => (
                    <button
                      key={link.id}
                      type="button"
                      className="font-[family-name:var(--font-ui)] border-b border-transparent px-1 py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/55 transition hover:border-white/40 hover:text-white/90"
                      onClick={() => go(`#${link.id}`)}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>
              <SoundControls
                unlocked={unlocked}
                soundOn={soundOn}
                playing={playing}
                unlock={unlock}
                toggleSound={toggleSound}
                compact
              />
            </div>
          ) : (
            <>
              <div className="mb-6 flex w-full flex-col gap-6 sm:mb-0 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 text-left">
                  <p className="mb-3 font-[family-name:var(--font-ui)] text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/40">
                    Digital Design Studio
                  </p>
                  <h1 className="font-display mb-3 text-[clamp(1.85rem,4vw,2.85rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white">
                    Kitluna
                  </h1>
                  <p className="m-0 max-w-xl font-[family-name:var(--font-ui)] text-[0.95rem] font-normal leading-[1.55] text-white/[0.58]">
                    Создаём сайты, которые держат внимание: ясная структура, спокойный визуальный
                    ритм, продуманная типографика.
                  </p>
                </div>
                <SoundControls
                  unlocked={unlocked}
                  soundOn={soundOn}
                  playing={playing}
                  unlock={unlock}
                  toggleSound={toggleSound}
                />
              </div>
              <nav
                className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-white/[0.08] pt-6 sm:mt-8 sm:justify-start sm:gap-x-6 sm:pt-7"
                aria-label="Навигация по истории"
              >
                {NAV.map(link => (
                  <button
                    key={link.id}
                    type="button"
                    className="font-[family-name:var(--font-ui)] border-b border-white/20 pb-0.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-white/70 transition hover:border-white/50 hover:text-white"
                    onClick={() => go(`#${link.id}`)}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  )
}

function SoundControls({
  unlocked,
  soundOn,
  playing,
  unlock,
  toggleSound,
  compact,
}: {
  unlocked: boolean
  soundOn: boolean
  playing: boolean
  unlock: () => void
  toggleSound: () => void
  compact?: boolean
}) {
  const btn =
    'rounded-md border border-white/[0.18] bg-white/[0.04] px-[1rem] py-[0.55rem] font-[family-name:var(--font-ui)] text-[0.78rem] font-medium tracking-[0.04em] text-white/90 transition hover:border-white/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30'

  return (
    <div
      className={`flex shrink-0 flex-col gap-2 ${compact ? 'items-end sm:items-center' : 'items-end'}`}
    >
      {!unlocked && (
        <button type="button" className={`${btn} ${compact ? 'whitespace-nowrap' : ''}`} onClick={unlock}>
          Включить звук
        </button>
      )}
      {unlocked && (
        <>
          <button type="button" className={`${btn} whitespace-nowrap`} onClick={toggleSound} aria-pressed={soundOn}>
            {soundOn ? 'Выключить звук' : 'Включить звук'}
          </button>
          <p
            className={`m-0 font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.02em] text-white/40 ${compact ? 'max-w-[10rem] text-right' : 'max-w-[14rem] text-right'}`}
            role="status"
          >
            {soundOn ? (playing ? 'Амбиент' : 'Загрузка…') : 'Тишина'}
          </p>
        </>
      )}
    </div>
  )
}
