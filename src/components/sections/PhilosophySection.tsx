import { useLanguageStore } from '@/store/useLanguageStore'

export function PhilosophySection() {
  const lang = useLanguageStore(s => s.lang)
  const isRu = lang === 'ru'

  return (
    <div>
      <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white/35">
        01 — {isRu ? 'Философия' : 'Philosophy'}
      </p>
      <h2 className="font-display mb-8 text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
        {isRu ? 'Смысл до пикселя' : 'Meaning before pixel'}
      </h2>
      <p className="font-display text-2xl font-normal italic leading-snug text-white/75 md:text-3xl">
        {isRu
          ? '«Эстетика — это не “красиво”. Это когда форма неизбежна, потому что смысл уже выстроен».'
          : '"Aesthetic isn’t “pretty”. It’s when the form feels inevitable—because the meaning is already clear."'}
      </p>
      <div className="mt-10 space-y-6 border-l border-white/[0.12] pl-8 font-[family-name:var(--font-ui)] text-base leading-[1.75] text-white/55 md:text-lg">
        <p>
          {isRu
            ? 'Kitluna — цифровая дизайн‑студия. Мы создаём сайты и системы, которые ощущаются как цельный объект: точный ритм, чистая типографика, кинематографичный свет.'
            : 'Kitluna is a digital design studio. We craft websites and systems that feel like a single object: precise rhythm, honest typography, cinematic light.'}
        </p>
        <p>
          {isRu
            ? 'Никаких шаблонных “блоков ради блоков”. Мы начинаем с позиции, превращаем её в структуру, а затем собираем интерфейс так, чтобы он держал внимание — спокойно, долго, уверенно.'
            : 'No template blocks for the sake of blocks. We start with a position, turn it into structure, then assemble an interface that holds attention—calmly, longer, with confidence.'}
        </p>
        <p>
          {isRu
            ? 'Если вам нужен не просто сайт, а ощущение уровня — давайте сделаем это неизбежным.'
            : "If you need more than a website—an unmistakable level—let’s make it inevitable."}
        </p>
      </div>
    </div>
  )
}
