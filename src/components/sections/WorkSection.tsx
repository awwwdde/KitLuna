const phases = [
  {
    n: 'I',
    title: 'Погружение',
    text: 'Интервью, аудитория, конкуренты и цели — фиксируем смысл, не только визуал.',
  },
  {
    n: 'II',
    title: 'Направление',
    text: 'Арт-дирекшн и тон коммуникации: одна линия, которая держит всю систему.',
  },
  {
    n: 'III',
    title: 'Дизайн-система',
    text: 'Ключевые экраны и компоненты — готово к передаче в разработку без потерь.',
  },
  {
    n: 'IV',
    title: 'Сборка',
    text: 'Сопровождаем внедрение, полируем детали, сдаём с документацией.',
  },
]

export function WorkSection() {
  return (
    <div>
      <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white/35">
        02 — Процесс
      </p>
      <h2 className="font-display mb-4 text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
        От смысла к пикселю
      </h2>
      <p className="mb-14 max-w-xl font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/45 md:text-base">
        Каждый этап — согласованный шаг. Без чёрного ящика: вы видите, где находится продукт и зачем
        каждое решение.
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
            <h3 className="font-display text-2xl font-medium text-white md:text-3xl">{phase.title}</h3>
            <p className="mt-3 max-w-lg font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/50 md:text-base">
              {phase.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
