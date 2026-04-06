import { Footer } from '@/ui/shell/Footer'
import { useLanguageStore } from '@/store/useLanguageStore'

export function ContactsSection() {
  const lang = useLanguageStore(s => s.lang)
  const isRu = lang === 'ru'

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white/35">
          04 — {isRu ? 'Контакт' : 'Contact'}
        </p>
        <h2 className="font-display mb-8 text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
          {isRu ? 'Давайте соберём это в реальность' : "Let's make it real"}
        </h2>
        <p className="mb-10 font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/50 md:text-base">
          {isRu
            ? 'Напишите в двух‑трёх предложениях: что вы делаете, для кого и что должно измениться после запуска. Ответим с направлением, сроками и форматом. Если нужно — предложим короткий созвон.'
            : "In 2–3 lines: what you’re building, for whom, and what should change after launch. We’ll reply with direction, timelines, and format. If needed—we’ll suggest a short call."}
        </p>
        <a
          href="mailto:hello@kitluna.studio"
          className="font-display inline-block text-3xl font-medium text-white underline decoration-white/[0.15] underline-offset-[8px] transition hover:decoration-white/40 md:text-4xl"
        >
          hello@kitluna.studio
        </a>
      </div>

      <Footer />
    </div>
  )
}
