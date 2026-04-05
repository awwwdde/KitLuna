import { motion } from 'framer-motion'
import { PhilosophySection } from '@/components/sections/PhilosophySection'
import { WorkSection } from '@/components/sections/WorkSection'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { ContactsSection } from '@/components/sections/ContactsSection'

const sectionClass =
  'pointer-events-auto flex min-h-[100dvh] w-full flex-col justify-center px-6 py-16 md:px-14 md:py-20'

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25, margin: '0px 0px -8% 0px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
}

export function StorySections() {
  return (
    <main className="pointer-events-none relative z-10">
      <section id="hero" className="pointer-events-none min-h-[100dvh] w-full shrink-0" aria-hidden />

      <motion.section id="philosophy" className={sectionClass} {...fade}>
        <div className="mx-auto w-full max-w-3xl">
          <PhilosophySection />
        </div>
      </motion.section>

      <motion.section id="work" className={sectionClass} {...fade}>
        <div className="mx-auto w-full max-w-4xl">
          <WorkSection />
        </div>
      </motion.section>

      <motion.section id="portfolio" className={sectionClass} {...fade}>
        <div className="mx-auto w-full max-w-5xl">
          <PortfolioSection />
        </div>
      </motion.section>

      <motion.section id="contacts" className={sectionClass} {...fade}>
        <div className="mx-auto flex w-full min-h-0 flex-1 flex-col">
          <ContactsSection />
        </div>
      </motion.section>
    </main>
  )
}
