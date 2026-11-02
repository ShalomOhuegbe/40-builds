import { motion, useReducedMotion } from 'framer-motion'
import type { Temperature } from '../content'
import lampCool from '../assets/figma/lamp-cool.svg'
import lampNeutral from '../assets/figma/lamp-neutral.svg'
import lampWarm from '../assets/figma/lamp-warm.svg'

const sources: Record<Temperature, string> = { cool: lampCool, neutral: lampNeutral, warm: lampWarm }
const temperatures: Temperature[] = ['cool', 'neutral', 'warm']

// Figma "Lamp" sits in a square frame; the artwork overhangs it 12.5% on the
// right (the light pool), and the desk contact line is at 604/640 = 94.375%.
export const LAMP_CONTACT = 0.94375

type Props = {
  temperature: Temperature
  className?: string
}

export function Lamp({ temperature, className = '' }: Props) {
  return (
    <div className={`pointer-events-none absolute aspect-square ${className}`} aria-hidden="true">
      <img src={sources[temperature]} alt="" className="absolute inset-y-0 left-0 block h-full w-[112.5%] max-w-none" />
    </div>
  )
}

// Light region of the lamp artwork (cone + desk pool), as % of the SVG's
// 244.8×217.6 viewBox: cone 152→204 at the head, 102→224 at the desk; the
// pool starts at x 40% so the base plate and its shadow stay in the body layer.
const LIGHT_POINTS = '61.5% 19%, 84% 19%, 91.5% 91.4%, 100% 91.4%, 100% 98%, 40% 98%, 40% 91.4%, 42.5% 91.4%'
const LIGHT_CLIP = `polygon(${LIGHT_POINTS})`
const BODY_CLIP = `polygon(evenodd, -10% -10%, 110% -10%, 110% 110%, -10% 110%, -10% -10%, ${LIGHT_POINTS}, 61.5% 19%)`

// Hero lamp: the same Figma asset split into a static body (arm, head, base)
// and a light layer that powers on with a soft LED flicker, then breathes.
export function HeroLamp({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const imgClass = 'absolute inset-y-0 left-0 block h-full w-[112.5%] max-w-none'

  return (
    <div className={`pointer-events-none absolute aspect-square ${className}`} aria-hidden="true">
      <img src={lampWarm} alt="" className={imgClass} style={{ clipPath: BODY_CLIP }} />
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { opacity: [1, 0.78, 1] }}
        transition={{ duration: 6, delay: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.img
          src={lampWarm}
          alt=""
          className={imgClass}
          style={{ clipPath: LIGHT_CLIP }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: reduceMotion ? 1 : [0, 0.65, 0.15, 0.9, 0.55, 1] }}
          transition={{ duration: 1.6, delay: 0.5, times: [0, 0.18, 0.3, 0.5, 0.65, 1], ease: 'easeOut' }}
        />
      </motion.div>
    </div>
  )
}

// Stacks all three temperature variants and crossfades between them (400ms).
// plus-lighter makes identical pixels (the aluminium arm) add back up to 100%,
// so only the light colour shifts: no dip in the arm mid-fade.
export function CrossfadeLamp({ temperature, className = '' }: Props) {
  const reduceMotion = useReducedMotion()
  return (
    <div className={`pointer-events-none absolute isolate aspect-square ${className}`} aria-hidden="true">
      {temperatures.map((t) => (
        <motion.img
          key={t}
          src={sources[t]}
          alt=""
          initial={false}
          animate={{ opacity: t === temperature ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeInOut' }}
          className="absolute inset-y-0 left-0 block h-full w-[112.5%] max-w-none mix-blend-plus-lighter"
        />
      ))}
    </div>
  )
}
