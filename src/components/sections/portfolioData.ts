export type PortfolioProject = {
  id: string
  title: string
  tag: {
    ru: string
    en: string
  }
  href: string
  image: string
}

/** Замените href и image на реальные кейсы. */
export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'pickupservice',
    title: 'Pickupservice',
    tag: { ru: 'Автотех · 2024', en: 'Autotech · 2024' },
    href: 'pickupservice.moscow',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=85&auto=format&fit=crop',
  },
  {
    id: 'north',
    title: 'North Clinic',
    tag: { ru: 'Медицина · 2023', en: 'Healthcare · 2023' },
    href: 'https://www.behance.net/search/projects?search=medical%20website',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=85&auto=format&fit=crop',
  },
  {
    id: 'lumen',
    title: 'Studio Lumen',
    tag: { ru: 'Креатив · 2024', en: 'Creative · 2024' },
    href: 'https://www.awwwards.com/websites/portfolio/',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop',
  },
  {
    id: 'vector',
    title: 'Vector Labs',
    tag: { ru: 'B2B SaaS · 2023', en: 'B2B SaaS · 2023' },
    href: 'https://www.behance.net/search/projects?search=saas%20landing',
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=85&auto=format&fit=crop',
  },
]
