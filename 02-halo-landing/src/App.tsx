import { useState } from 'react'
import type { PlanId } from './content'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ProductStory } from './components/story/ProductStory'
import { FocusMode } from './components/FocusMode'
import { Specs } from './components/Specs'
import { Testimonials } from './components/Testimonials'
import { Pricing } from './components/Pricing'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'

export default function App() {
  // Shared so the footer's "HALO Essential" / "HALO Pro" links can preselect a plan
  const [plan, setPlan] = useState<PlanId>('pro')

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-pill bg-ink px-4 py-3 type-label-m text-on-dark focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <ProductStory />
        <FocusMode />
        <Specs />
        <Testimonials />
        <Pricing selected={plan} onSelect={setPlan} />
        <Faq />
      </main>
      <Footer onSelectPlan={setPlan} />
    </>
  )
}
