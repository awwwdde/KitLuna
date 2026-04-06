import { useCallback } from 'react'
import { useLenis } from 'lenis/react'
import { useLanguageStore } from '@/store/useLanguageStore'

export function HeroSection() {
  const lenis = useLenis()
  const lang = useLanguageStore(s => s.lang)
  const isRu = lang === 'ru'

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
    <div className="pointer-events-auto flex min-h-[100dvh] w-full flex-col justify-center px-6 py-16 md:px-14 md:py-20">
      <div className="mx-auto w-full max-w-[64rem]">
        <p className="mb-5 font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.32em] text-white/45">
          {isRu ? 'Цифровая дизайн‑студия' : 'Digital design studio'}
        </p>
        <h1 className="font-display max-w-[22ch] text-[clamp(2.9rem,7vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
          {isRu ? 'Сайты с ритмом, светом и смыслом' : 'Websites with rhythm, light, and meaning'}
        </h1>
        <p className="mt-7 max-w-[60ch] font-[family-name:var(--font-ui)] text-base leading-relaxed text-white/60 md:text-lg">
          {isRu
            ? 'Мы проектируем и собираем интерфейсы, которые читаются с первого кадра: ясная структура, сильная типографика и аккуратная анимация — без шума и шаблонов.'
            : 'We design and build interfaces that read from the first frame: clear structure, strong typography, and tasteful motion—no noise, no templates.'}
        </p>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => go('#portfolio')}
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] px-5 py-3 font-[family-name:var(--font-ui)] text-sm font-medium tracking-[0.08em] text-white transition hover:border-white/35 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {isRu ? 'Смотреть кейсы' : 'View work'}
          </button>
          <button
            type="button"
            onClick={() => go('#contacts')}
            className="inline-flex items-center justify-center rounded-xl border border-white/[0.14] bg-black/20 px-5 py-3 font-[family-name:var(--font-ui)] text-sm font-medium tracking-[0.08em] text-white/85 transition hover:border-white/28 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {isRu ? 'Обсудить проект' : 'Talk about a project'}
          </button>
        </div>
      </div>
    </div>
  )
}

