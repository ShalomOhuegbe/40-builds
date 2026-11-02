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

// The cone alone (no desk pool), for effects that travel through the beam
const CONE_CLIP = 'polygon(61.5% 19%, 84% 19%, 91.7% 94%, 41.7% 94%)'

// Dust motes drifting in the beam. x/y are % of the lamp artwork; each one
// rises and twinkles on its own loop so the pattern never visibly repeats.
const motes = [
  { x: 66, y: 34, size: 3, duration: 5.2, delay: 0.2 },
  { x: 74, y: 48, size: 2, duration: 6.4, delay: 1.4 },
  { x: 59, y: 62, size: 4, duration: 7.1, delay: 0.8 },
  { x: 80, y: 70, size: 2, duration: 5.8, delay: 2.6 },
  { x: 69, y: 80, size: 3, duration: 6.9, delay: 3.1 },
  { x: 54, y: 85, size: 2, duration: 5.5, delay: 1.9 },
  { x: 84, y: 86, size: 3, duration: 7.6, delay: 0.5 },
  { x: 72, y: 26, size: 2, duration: 6.1, delay: 3.8 },
  { x: 63, y: 74, size: 2, duration: 8.0, delay: 2.2 },
  { x: 78, y: 56, size: 3, duration: 6.6, delay: 4.4 },
]

// Hero lamp: the same Figma asset split into a static body (arm, head, base)
// and a light layer. The light powers on with an LED flicker, then breathes,
// a warm band sweeps down the cone and dust motes drift through the beam.
export function HeroLamp({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const imgClass = 'absolute inset-y-0 left-0 block h-full w-[112.5%] max-w-none'

  return (
    <div className={`pointer-events-none absolute aspect-square ${className}`} aria-hidden="true">
      <img src={lampWarm} alt="" className={imgClass} style={{ clipPath: BODY_CLIP }} />
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { opacity: [1, 0.5, 1] }}
        transition={{ duration: 4, delay: 2.2, repeat: Infinity, ease: 'easeInOut' }}
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

      {!reduceMotion && (
        <motion.div
          className="absolute inset-y-0 left-0 w-[112.5%] overflow-hidden mix-blend-plus-lighter"
          style={{ clipPath: CONE_CLIP }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          {/* Warm band travelling from the head down to the desk */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[28%] bg-linear-to-b from-transparent via-[rgba(255,196,120,0.55)] to-transparent"
            animate={{ y: ['-100%', '360%'] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 0.6, ease: [0.45, 0, 0.55, 1] }}
          />
          {motes.map((m, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#ffe2b0] shadow-[0_0_6px_2px_rgba(255,200,130,0.6)]"
              style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.size, height: m.size }}
              animate={{ y: [0, -36, -72], x: [0, 6, -4], opacity: [0, 1, 0] }}
              transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
      )}
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
