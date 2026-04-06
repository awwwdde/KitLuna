import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import type { PortfolioProject } from '@/components/sections/portfolioData'
import { PORTFOLIO_PROJECTS } from '@/components/sections/portfolioData'
import { useLanguageStore } from '@/store/useLanguageStore'

function useFinePointer() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => setOk(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return ok
}

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

const row = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function PortfolioSection() {
  const lang = useLanguageStore(s => s.lang)
  const isRu = lang === 'ru'
  const reduceMotion = useReducedMotion()
  const finePointer = useFinePointer()
  const showPreview = finePointer && !reduceMotion

  const [active, setActive] = useState<PortfolioProject | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.35 })

  const onContainerMove = useCallback(
    (e: React.MouseEvent) => {
      if (!showPreview) return
      x.set(e.clientX + 18)
      y.set(e.clientY - 110)
    },
    [showPreview, x, y]
  )

  const onLeave = useCallback(() => {
    setActive(null)
  }, [])

  return (
    <div className="relative" onMouseMove={onContainerMove} onMouseLeave={onLeave}>
      {showPreview && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[25] w-[min(42vw,280px)] overflow-hidden rounded-lg border border-white/[0.12] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
          style={{ x: sx, y: sy, translateZ: 0 }}
          initial={false}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.94 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="aspect-[4/3] w-full">
            <AnimatePresence mode="wait">
              {active && (
                <motion.img
                  key={active.id}
                  src={active.image}
                  alt=""
                  width={560}
                  height={420}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white/35">
        03 — {isRu ? 'Избранное' : 'Selected'}
      </p>
      <h2 className="font-display mb-4 text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
        {isRu ? 'Кейсы, которые держат кадр' : 'Cases that hold the frame'}
      </h2>
      <p className="mb-14 font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/45 md:mb-16 md:text-base">
        {isRu
          ? 'Наводите — превью следует за курсором. Открывайте кейс в новой вкладке и смотрите, как мы собираем ритм, свет и структуру.'
          : 'Hover—preview follows your pointer. Open a case in a new tab and see how we build rhythm, light, and structure.'}
      </p>

      <motion.ul
        className="divide-y divide-white/[0.09]"
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {PORTFOLIO_PROJECTS.map(p => (
          <motion.li key={p.id} variants={row} className="group">
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-8 outline-none transition-[padding] duration-300 first:pt-0 focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:py-10 md:group-hover:pl-3"
              onMouseEnter={() => setActive(p)}
              onFocus={() => setActive(p)}
              onBlur={() => setActive(null)}
            >
              <span className="block font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.2em] text-white/35">
                {p.tag[lang]}
              </span>
              <span className="font-display mt-2 block text-[clamp(1.65rem,3.8vw,2.65rem)] font-medium text-white transition-colors group-hover:text-white">
                {p.title}
              </span>
              <span className="mt-3 flex items-center gap-2 font-[family-name:var(--font-ui)] text-[0.7rem] uppercase tracking-[0.18em] text-white/30 transition group-hover:text-white/50">
                <span className="block h-px w-0 bg-white/50 transition-all duration-500 group-hover:w-10" />
                {isRu ? 'Открыть кейс' : 'Open case'}
              </span>
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
