import type { PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { Button } from './Button'
import { HeroLamp } from './Lamp'
import { SpecTicker } from './SpecTicker'
import glow from '../assets/figma/hero-glow.svg'
import dot from '../assets/figma/dot-amber-8.svg'

const spring = { stiffness: 60, damping: 20 }

// Geometry from the 390 / 768 / 1440 frames. The "scene" is the strip between
// the copy and the desk; the lamp's contact line sits on its bottom edge.
export function Hero() {
  const reduceMotion = useReducedMotion()
  // Ambient glow drifts towards a mouse pointer (±40px / ±24px)
  const glowX = useSpring(useMotionValue(0), spring)
  const glowY = useSpring(useMotionValue(0), spring)

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    glowX.set(((event.clientX - rect.left) / rect.width - 0.5) * 80)
    glowY.set(((event.clientY - rect.top) / rect.height - 0.5) * 48)
  }
  const onPointerLeave = () => {
    glowX.set(0)
    glowY.set(0)
  }

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="on-dark-surface relative overflow-hidden bg-dark pt-[104px] md:pt-[140px] lg:pt-[196px]"
    >
      <div className="shell relative z-10">
        <div className="flex flex-col gap-6 md:gap-8 lg:max-w-[649px]">
          <p className="flex w-fit items-center gap-2 rounded-pill border border-line-dark py-2 pr-4 pl-3">
            <img src={dot} alt="" width={8} height={8} />
            <span className="type-caps text-on-dark-muted">
              <span className="hidden md:inline">Pre-orders open · </span>Ships March 2027
            </span>
          </p>

          <h1
            id="hero-title"
            className="type-display-m text-on-dark md:type-display-xl md:text-[min(160px,20.83vw)] lg:text-[min(160px,11.11vw)]"
          >
            <span className="block">Find your</span>
            <span className="block text-accent">flow.</span>
          </h1>

          <p className="type-body-m text-on-dark-muted md:max-w-[460px] md:type-body-l lg:max-w-[520px]">
            <span className="lg:hidden">
              HALO reads your focus sessions. Cooler, brighter light when you go deep. Warmer, softer light
              as you wind down.
            </span>
            <span className="hidden lg:inline">
              HALO is a desk lamp that reads your focus sessions. Cooler, brighter light when you go deep.
              Warmer, softer light as you wind down. No switches to think about.
            </span>
          </p>

          <div className="flex flex-col gap-3 md:flex-row">
            <Button href="#pricing" variant="accent" icon>
              Pre-order HALO
            </Button>
            <Button href="#technology" variant="on-dark">
              Discover the technology
            </Button>
          </div>
        </div>
      </div>

      {/* Scene: glow + lamp, anchored to the desk line */}
      <div className="shell relative h-[390px] md:h-[359px] lg:h-[50px]">
        <motion.div
          style={{ x: glowX, y: glowY }}
          animate={reduceMotion ? undefined : { opacity: [1, 0.55, 1] }}
          transition={{ duration: 4, delay: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute right-[-234px] bottom-[103px] h-[468px] w-[546px] md:right-[-396px] md:bottom-[40px] md:h-[900px] md:w-[1000px] lg:right-[-220px] lg:bottom-[30px] lg:w-[1100px]"
        >
          {/* Fades in with the lamp's power-on, then breathes with the light */}
          <motion.img
            src={glow}
            alt=""
            className="size-full max-w-none"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: [0, 1, 0.8, 1], scale: [1, 1.12, 1] }}
            transition={
              reduceMotion
                ? undefined
                : {
                    opacity: { duration: 1.6, delay: 0.6, times: [0, 0.6, 0.8, 1] },
                    scale: { duration: 4, delay: 2.2, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
          />
        </motion.div>
        <HeroLamp
          className="right-[-60px] bottom-[-22.3px] w-[396.8px] md:right-[-40px] md:bottom-[-32.4px] md:w-[576px] lg:right-[-20px] lg:bottom-[calc(min(716.8px,49.78vw)*-0.05625)] lg:w-[min(716.8px,49.78vw)]"
        />
      </div>

      {/* Desk surface with the spec ticker */}
      <div className="relative h-[120px] border-t border-[rgba(255,217,166,0.18)] bg-linear-to-b from-[#333330] to-[#121312] md:h-[130px] lg:h-[150px]">
        {/* Figma offsets (68/74/76) minus the 1px top border */}
        <div className="pt-[67px] md:pt-[73px] lg:shell lg:pt-[75px]">
          {/* Marquee starts on the gutter and runs off the right edge, as in the 390/768 frames */}
          <div className="pl-6 md:pl-12 lg:pl-0">
            <SpecTicker />
          </div>
        </div>
      </div>
    </section>
  )
}
