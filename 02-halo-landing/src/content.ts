// All page copy, taken verbatim from the Figma file.
// `short` fields are the condensed mobile/tablet copy from the 390/768 frames.

export type PlanId = 'essential' | 'pro'

export const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Technology', href: '#technology' },
  { label: 'Our Story', href: '#studio' },
]

export const specTicker = [
  '2700–6500K adaptive',
  '96 high-CRI LEDs',
  'Auto-Dim sensor',
  '45-min focus sessions',
  'USB-C power',
  'Anodised aluminium',
]

export type Temperature = 'cool' | 'neutral' | 'warm'

// One entry per third of the pinned product story.
export const storyStates: {
  temperature: Temperature
  kelvin: number
  number: string
  title: string
  body: string
  short: string
  brightness: number
}[] = [
  {
    temperature: 'cool',
    kelvin: 6500,
    number: '01',
    title: 'Focus Mode',
    body: 'Automatically adjusts lighting to support concentration. Cooler, brighter light keeps you alert through long sessions.',
    short: 'Automatically adjusts lighting to support concentration.',
    brightness: 90,
  },
  {
    temperature: 'neutral',
    kelvin: 4000,
    number: '02',
    title: 'Auto-Dim',
    body: 'Adapts brightness to the surrounding environment, so the desk never glares as daylight fades.',
    short: 'Adapts brightness to the surrounding environment.',
    brightness: 65,
  },
  {
    temperature: 'warm',
    kelvin: 2700,
    number: '03',
    title: 'Session Intelligence',
    body: 'Tracks focus sessions and provides productivity insights: when you focus best, and for how long.',
    short: 'Tracks focus sessions and provides productivity insights.',
    brightness: 40,
  },
]

export const dimensions = [
  { label: 'Height', value: '48 cm' },
  { label: 'Reach', value: '52 cm' },
  { label: 'Base', value: 'Ø 18 cm' },
  { label: 'Weight', value: '1.9 kg' },
]

export const specs = [
  {
    title: 'Adaptive LED lighting',
    body: '96 high-CRI (95+) LEDs blend from 2700K to 6500K with no visible steps.',
  },
  {
    title: 'Automatic brightness',
    body: 'An ambient sensor in the head adjusts output 30 times a second, from 50 to 1,000 lux.',
  },
  {
    title: 'Focus-session integration',
    body: 'Runs sessions on its own, or syncs with your calendar and focus apps on iOS and Android.',
  },
  {
    title: 'Touch-sensitive controls',
    body: 'A single strip along the arm: tap for on/off, slide for brightness, hold to start a session.',
  },
  {
    title: 'Aluminium construction',
    body: 'One continuous anodised aluminium arm, bent and finished by hand. No exposed screws.',
  },
  {
    title: 'USB-C connectivity',
    body: 'Powered over USB-C (30W). A second port in the base charges your phone.',
  },
]

export const testimonials = [
  {
    quote: '“I stopped fighting my desk lamp at 11pm. HALO just knows when I’m winding down.”',
    name: 'Amara Okafor',
    role: 'Architect, Lagos',
  },
  {
    quote:
      '“My focus sessions went from 25 minutes to almost an hour. The light change is a better cue than any timer.”',
    name: 'Daniel Mensah',
    role: 'PhD candidate, Accra',
  },
  {
    quote:
      '“It’s the first piece of tech on my desk that I don’t have to think about. It just looks right.”',
    name: 'Lena Hoffmann',
    role: 'Product designer, Berlin',
  },
]

const planFeatures = [
  'Adaptive colour temperature',
  'Auto-Dim ambient sensing',
  'Focus Mode with timer',
  'Session Intelligence insights',
  'Wireless phone charging base',
  '3-year warranty',
]

export const plans: {
  id: PlanId
  name: string
  price: string
  description: string
  cta: string
  badge?: string
  features: { label: string; included: boolean }[]
}[] = [
  {
    id: 'essential',
    name: 'HALO Essential',
    price: '$149',
    description:
      'The adaptive lamp, Focus Mode and Auto-Dim. Everything you need for better light.',
    cta: 'Pre-order Essential',
    features: planFeatures.map((label, i) => ({ label, included: i < 3 })),
  },
  {
    id: 'pro',
    name: 'HALO Pro',
    price: '$199',
    description:
      'Everything in Essential, plus Session Intelligence and the aluminium wireless base.',
    cta: 'Pre-order HALO Pro',
    badge: 'Most chosen',
    features: planFeatures.map((label) => ({ label, included: true })),
  },
]

export const trustPoints = ['Free shipping worldwide', '30-day returns', 'Charged only when it ships']

export const faqs = [
  {
    question: 'How does Focus Mode work?',
    answer:
      'Start a session from the touch strip or the app. HALO shifts to a cooler, brighter light for deep work, then warms gradually over the last five minutes so you notice the session ending without an alarm.',
  },
  {
    question: 'Does HALO require an app?',
    answer:
      'No. HALO works on its own with the touch strip. The free app adds scheduling, session insights and calendar sync.',
  },
  {
    question: 'Can I manually adjust brightness?',
    answer:
      'Yes. Slide along the touch strip at any time. HALO pauses automatic changes until your next session starts.',
  },
  {
    question: 'Does it work with USB-C?',
    answer:
      'Yes. HALO runs on a single USB-C cable with the 30W adapter included, and the base has a second port to charge your phone.',
  },
  {
    question: 'When will pre-orders ship?',
    answer:
      'Pre-orders ship from March 2027, in the order they were placed. You won’t be charged until your lamp leaves our warehouse.',
  },
]

export type FooterLink = {
  label: string
  href: string
  plan?: PlanId
  external?: boolean
  // Shown on desktop only (the 390/768 frames drop these rows)
  desktopOnly?: boolean
}

export const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'HALO Essential', href: '#pricing', plan: 'essential' },
      { label: 'HALO Pro', href: '#pricing', plan: 'pro' },
      { label: 'Technology', href: '#technology' },
      { label: 'Accessories', href: '#pricing', desktopOnly: true },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Setup guide', href: '#focus-mode' },
      { label: 'Shipping', href: '#faq' },
      { label: 'Returns', href: '#faq' },
      { label: 'Warranty', href: '#pricing', desktopOnly: true },
      { label: 'Contact', href: 'mailto:hello@halo.light' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '#studio' },
      { label: 'Journal', href: '#studio' },
      { label: 'Press', href: 'mailto:press@halo.light' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com', external: true },
      { label: 'X', href: 'https://x.com', external: true },
      { label: 'YouTube', href: 'https://www.youtube.com', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com', external: true },
    ],
  },
]
