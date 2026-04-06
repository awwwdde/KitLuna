import { useLanguageStore } from '@/store/useLanguageStore'

const phases = [
  {
    n: 'I',
    title: { ru: 'Погружение', en: 'Immersion' },
    text: {
      ru: 'Бриф, контекст, аудитория, конкуренты. Находим позицию и формулируем обещание — чтобы дизайн имел опору.',
      en: 'Brief, context, audience, competitors. We define the position and the promise—so design has an anchor.',
    },
  },
  {
    n: 'II',
    title: { ru: 'Направление', en: 'Direction' },
    text: {
      ru: 'Арт‑дирекшн, язык, типографика, сетка. Одна линия, которая держит всё: от заголовка до анимации.',
      en: 'Art direction, language, typography, grid. One line that holds it all—from headline to motion.',
    },
  },
  {
    n: 'III',
    title: { ru: 'Дизайн-система', en: 'Design system' },
    text: {
      ru: 'Компоненты, состояния, ключевые экраны. Система, которую можно развивать, а не поддерживать “вручную”.',
      en: 'Components, states, key screens. A system you can scale—not babysit manually.',
    },
  },
  {
    n: 'IV',
    title: { ru: 'Сборка', en: 'Assembly' },
    text: {
      ru: 'Сопровождаем внедрение, полируем ощущения, доводим перформанс. Сдаём как продукт — с документацией.',
      en: 'We support implementation, polish the feel, dial performance in. Delivered like a product—with documentation.',
    },
  },
]

export function WorkSection() {
  const lang = useLanguageStore(s => s.lang)
  const isRu = lang === 'ru'

  return (
    <div>
      <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white/35">
        02 — {isRu ? 'Процесс' : 'Process'}
      </p>
      <h2 className="font-display mb-4 text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
        {isRu ? 'Процесс без чёрного ящика' : 'No black box process'}
      </h2>
      <p className="mb-14 font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/45 md:text-base">
        {isRu
          ? 'Четыре этапа, один ритм. Вы всегда видите статус, артефакты и логику решений — без “сюрпризов” на финале.'
          : 'Four phases, one rhythm. You always see the status, artifacts, and the logic behind decisions—no end-stage surprises.'}
      </p>
      <ol className="relative border-l border-white/[0.12]">
        {phases.map(phase => (
          <li key={phase.n} className="relative pl-10 pb-14 last:pb-0 md:pl-14 md:pb-16">
            <span
              className="absolute left-0 top-0 flex h-7 w-7 -translate-x-[calc(50%-0px)] items-center justify-center border border-white/25 bg-black font-[family-name:var(--font-ui)] text-[0.65rem] font-semibold tracking-wide text-white/80"
              aria-hidden
            >
              {phase.n}
            </span>
            <h3 className="font-display text-2xl font-medium text-white md:text-3xl">{phase.title[lang]}</h3>
            <p className="mt-3 font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/50 md:text-base">
              {phase.text[lang]}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
