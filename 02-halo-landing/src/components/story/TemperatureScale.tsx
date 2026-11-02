import { motion, useTransform, type MotionValue } from 'framer-motion'
import knob from '../../assets/figma/knob.svg'

const labels = ['2700K', '4000K', '6500K']

// Figma "Temperature scale": the knob starts on 6500K (right) and travels
// towards 2700K as the story progresses.
export function TemperatureScale({
  progress,
  activeIndex,
  className = '',
}: {
  progress: MotionValue<number>
  activeIndex: number
  className?: string
}) {
  const knobLeft = useTransform(progress, (p) => `calc(${(1 - p) * 100}% - ${(1 - p) * 24}px)`)
  // Story state 0 → 6500K label (index 2), state 2 → 2700K label (index 0)
  const activeLabel = 2 - activeIndex

  return (
    <div className={`absolute flex flex-col gap-3 ${className}`} aria-hidden="true">
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-[2px] bg-linear-to-r from-[var(--temp-warm)] via-[var(--temp-neutral)] via-[34%] to-[var(--temp-cool)]" />
        <motion.img
          src={knob}
          alt=""
          width={24}
          height={24}
          style={{ left: knobLeft }}
          className="absolute top-0 size-6"
        />
      </div>
      <div className="flex justify-between">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`type-caps transition-colors duration-300 ${i === activeLabel ? 'text-on-dark' : 'text-on-dark-muted'}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
