import { useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { storyStates } from '../../content'
import { Eyebrow } from '../Eyebrow'
import { FeatureCallout } from './FeatureCallout'
import { Stage } from './Stage'

const stateForProgress = (p: number) => (p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2)

// Signature interaction. The track pins the stage for 300vh (tablet/desktop);
// scroll progress 0 → 1 drives lamp temperature, the scale knob, the counting
// K readout and which callout is active. On mobile the stage pins under the
// nav and the callouts scroll up beneath it.
export function ProductStory() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const smoothed = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.0005 })
  const progress = reduceMotion ? scrollYProgress : smoothed

  const [activeIndex, setActiveIndex] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActiveIndex(stateForProgress(p)))

  return (
    <section id="product" aria-labelledby="product-title" className="bg-canvas py-24 md:py-32 lg:py-40">
      <div className="shell">
        <header className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 md:gap-6">
            <Eyebrow>The product</Eyebrow>
            <h2
              id="product-title"
              className="type-display-s text-ink md:type-display-m lg:type-display-l lg:max-w-[820px] lg:text-[min(96px,6.667vw)]"
            >
              <span className="block">Your workspace.</span> <span className="block">In a better light.</span>
            </h2>
          </div>
          <p className="type-body-m text-muted md:max-w-[520px] lg:max-w-[360px]">
            Scroll to see HALO move through the day: cool and bright for deep work,
            <span className="hidden md:inline"> neutral for everything else,</span> warm when it’s time to stop.
          </p>
        </header>

        <div ref={trackRef} className="relative mt-12 md:mt-16 md:h-[300vh] lg:mt-24">
          <div className="md:sticky md:top-0 md:flex md:h-svh md:items-center md:pt-24 md:pb-8">
            <div className="flex w-full flex-col gap-8 md:gap-16 lg:flex-row-reverse lg:items-end">
              {/* Desktop: callouts keep a fixed 340px column; the stage takes the rest (max 808) */}
              <div className="sticky top-0 z-10 -mx-6 bg-canvas px-6 pt-[88px] pb-2 md:static md:mx-0 md:bg-transparent md:p-0 lg:flex lg:flex-1 lg:justify-end">
                <Stage progress={progress} activeIndex={activeIndex} />
              </div>

              <div className="flex flex-col gap-8 pb-[18svh] md:grid md:grid-cols-3 md:gap-6 md:pb-0 lg:flex lg:w-[340px] lg:shrink-0 lg:flex-col lg:gap-12 lg:[@media(max-height:880px)]:gap-8">
                {storyStates.map((state, i) => (
                  <FeatureCallout
                    key={state.number}
                    active={i === activeIndex}
                    number={state.number}
                    title={state.title}
                    body={state.body}
                    short={state.short}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
