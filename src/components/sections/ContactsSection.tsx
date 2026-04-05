import { Footer } from '@/ui/shell/Footer'

export function ContactsSection() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white/35">
          04 — Контакт
        </p>
        <h2 className="font-display mb-8 max-w-[18ch] text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
          Начнём с письма
        </h2>
        <p className="mx-auto mb-10 max-w-md font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/50 md:text-base">
          Опишите задачу в двух предложениях — ответим со сроками и форматом, или предложим короткий
          созвон.
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
