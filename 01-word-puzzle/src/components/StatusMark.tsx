import { motion } from 'framer-motion'
import checkKey from '../assets/figma/mark-check-key.svg'
import check from '../assets/figma/mark-check.svg'
import dash from '../assets/figma/mark-dash.svg'
import ringKey from '../assets/figma/mark-ring-key.svg'
import ring from '../assets/figma/mark-ring.svg'
import type { LetterStatus } from '../game/types'
import { useReduceMotion } from '../useMotionPrefs'

// Boxes from the Figma marks (12px on tiles, 9px on keys), as [left, top, width, height].
const tileMarks = {
  correct: { src: check, box: [1.7, 2.8, 8.6, 6.6] },
  present: { src: ring, box: [2.3, 2.3, 7.4, 7.4] },
  absent: { src: dash, box: [2.1, 5.1, 7.8, 1.8] },
}
const keyMarks = {
  correct: { src: checkKey, box: [1.05, 1.87, 6.9, 5.4] },
  present: { src: ringKey, box: [1.5, 1.5, 6, 6] },
}

type Props = { status: LetterStatus; on: 'tile' | 'key'; animate?: boolean }

// The Figma SVG used as a mask, so high-contrast mode can recolour it through
// currentColor. On tiles it wipes in after landing ("mark strokes in").
export function StatusMark({ status, on, animate = false }: Props) {
  const reduce = useReduceMotion()
  const mark = on === 'tile' ? tileMarks[status] : status === 'absent' ? null : keyMarks[status]
  if (!mark) return null
  const [left, top, width, height] = mark.box
  const size = on === 'tile' ? 12 : 9
  const url = `url("${mark.src}")`

  return (
    <span
      aria-hidden="true"
      className={`absolute ${on === 'tile' ? 'top-1.5 right-1.5' : 'top-1 right-1'}`}
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute bg-current"
        style={{ left, top, width, height, maskImage: url, WebkitMaskImage: url, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}
        initial={animate ? (reduce ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }) : false}
        animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: reduce ? 0.15 : 0.18, ease: 'easeOut' }}
      />
    </span>
  )
}
