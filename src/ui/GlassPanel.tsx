import { useAudioStore } from '@/store/useAudioStore'

export function GlassPanel() {
  const unlocked = useAudioStore(s => s.unlocked)
  const soundOn = useAudioStore(s => s.soundOn)
  const playing = useAudioStore(s => s.playing)
  const unlock = useAudioStore(s => s.unlock)
  const toggleSound = useAudioStore(s => s.toggleSound)

  return (
    <aside
      className="pointer-events-none fixed bottom-[calc(35px+env(safe-area-inset-bottom,0px))] left-1/2 z-20 w-[90%] max-w-none -translate-x-1/2"
      aria-label="KitLuna"
    >
      <div className="pointer-events-auto w-full">
        <div className="glass-effect w-full">
          <div className="relative z-10 w-full px-[25px] py-6 sm:py-7">
            <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* LEFT SIDE */}
              <div className="min-w-0 flex-1 text-left">
                <p className="mb-3 font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.22em] text-white/45">
                  Digital Design Studio
                </p>
                <h1 className="mb-3 font-[family-name:var(--font-ui)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white/[0.96] [text-shadow:0_0_32px_rgba(255,255,255,0.06)]">
                  Kitluna
                </h1>
                <p className="m-0 max-w-xl font-[family-name:var(--font-ui)] text-[0.95rem] font-normal leading-[1.55] text-white/[0.62]">
                  Создаем продающиеся уникальные и красивые сайты для вашего бизнеса
                </p>
              </div>
              {/* RIGHT SIDE */}
              <div className="flex flex-col items-end justify-center gap-2 sm:items-end">
                {!unlocked && (
                  <button
                    type="button"
                    className="whitespace-nowrap rounded-full border border-white/[0.22] bg-white/10 px-[1.1rem] py-[0.65rem] font-[family-name:var(--font-ui)] text-[0.8rem] font-semibold tracking-[0.04em] text-white/[0.92] transition-[background,border-color,transform] duration-200 hover:-translate-y-px hover:border-white/35 hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(200,200,220,0.5)]"
                    onClick={unlock}
                  >
                    Включить звук
                  </button>
                )}
                {unlocked && (
                  <>
                    <button
                      type="button"
                      className="whitespace-nowrap rounded-full border border-white/[0.22] bg-white/10 px-[1.1rem] py-[0.65rem] font-[family-name:var(--font-ui)] text-[0.8rem] font-semibold tracking-[0.04em] text-white/[0.92] transition-[background,border-color,transform] duration-200 hover:-translate-y-px hover:border-white/35 hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(200,200,220,0.5)]"
                      onClick={toggleSound}
                      aria-pressed={soundOn}
                    >
                      {soundOn ? 'Выключить звук' : 'Включить звук'}
                    </button>
                    <p
                      className="m-0 max-w-[14rem] text-right font-[family-name:var(--font-ui)] text-[0.75rem] tracking-[0.02em] text-white/45"
                      role="status"
                    >
                      {soundOn ? (playing ? 'Космический амбиент' : 'Загрузка…') : 'Звук выключен'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}