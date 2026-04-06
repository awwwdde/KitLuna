import { motion } from 'framer-motion'
import { HeroSection } from '@/components/sections/HeroSection'
import { PhilosophySection } from '@/components/sections/PhilosophySection'
import { WorkSection } from '@/components/sections/WorkSection'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { ContactsSection } from '@/components/sections/ContactsSection'

const sectionClass =
  'pointer-events-auto flex min-h-[100dvh] w-full flex-col justify-center px-6 py-16 md:px-14 md:py-20'

const containerClass = 'mx-auto w-full max-w-[64rem]'

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25, margin: '0px 0px -8% 0px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
}

export function StorySections() {
  return (
    <main className="pointer-events-none relative z-10">
      <section id="hero" className="w-full shrink-0">
        <div className={containerClass}>
          <HeroSection />
        </div>
      </section>

      <motion.section id="philosophy" className={sectionClass} {...fade}>
        <div className={containerClass}>
          <PhilosophySection />
        </div>
      </motion.section>

      <motion.section id="work" className={sectionClass} {...fade}>
        <div className={containerClass}>
          <WorkSection />
        </div>
      </motion.section>

      <motion.section id="portfolio" className={sectionClass} {...fade}>
        <div className={containerClass}>
          <PortfolioSection />
        </div>
      </motion.section>

      <motion.section id="contacts" className={sectionClass} {...fade}>
        <div className={`flex min-h-0 flex-1 flex-col ${containerClass}`}>
          <ContactsSection />
        </div>
      </motion.section>
    </main>
  )
}
