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
