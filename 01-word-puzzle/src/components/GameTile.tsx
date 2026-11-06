import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { statusLabel } from '../game/copy'
import { easePop, timings } from '../game/motion'
import type { LetterStatus, TileStatus } from '../game/types'
import { useReduceMotion } from '../useMotionPrefs'
import { StatusMark } from './StatusMark'

const faces: Record<TileStatus, string> = {
  empty: 'border-line bg-surface border-[length:var(--tile-border)]',
  active: 'border-cobalt bg-surface border-[length:var(--tile-border)]',
  filled: 'border-ink bg-surface text-ink border-[length:var(--tile-border)]',
  invalid: 'border-error bg-error-tint text-ink border-[length:var(--tile-border)]',
  correct: 'bg-correct text-correct-ink shadow-[var(--glow-tile)]',
  present: 'bg-present text-present-ink',
  absent: 'bg-absent text-absent-ink',
}

const isRevealed = (status: TileStatus): status is LetterStatus =>
  status === 'correct' || status === 'present' || status === 'absent'

export const describeTile = (letter: string, status: TileStatus) =>
  isRevealed(status) ? `${letter.toUpperCase()}, ${statusLabel(status)}` : letter ? letter.toUpperCase() : 'Empty'

type Props = {
  letter: string
  status: TileStatus
  index?: number
  revealing?: boolean
  hopping?: boolean
}

export function GameTile({ letter, status, index = 0, revealing = false, hopping = false }: Props) {
  const reduce = useReduceMotion()
  const { tile, stagger, edge, hop, hopStagger } = timings(reduce)
  const delay = index * stagger

  // During a reveal the tile stays "filled" until it is edge-on, and the corner
  // mark only appears once it has landed.
  const [swapped, setSwapped] = useState(false)
  const [landed, setLanded] = useState(false)
  useEffect(() => {
    if (!revealing) return
    const toSwap = window.setTimeout(() => setSwapped(true), delay + edge)
    const toLand = window.setTimeout(() => setLanded(true), delay + tile)
    return () => {
      window.clearTimeout(toSwap)
      window.clearTimeout(toLand)
    }
  }, [revealing, delay, edge, tile])

  const face: TileStatus = isRevealed(status) && revealing && !swapped ? 'filled' : status
  const showMark = isRevealed(face) && (!revealing || landed)
  const markAnimates = useRef(false)
  if (revealing) markAnimates.current = true

  // Letter entry pops 1 → 1.08 → 1 (100ms); delete dips to 0.94 (80ms)
  const press = useAnimationControls()
  const previous = useRef(letter)
  useEffect(() => {
    if (previous.current === letter) return
    const added = !previous.current
    previous.current = letter
    if (reduce || isRevealed(status)) return
    if (added) press.start({ scale: [1, 1.08, 1], transition: { duration: 0.1, ease: easePop } })
    else press.start({ scale: [1, 0.94, 1], transition: { duration: 0.08, ease: 'easeOut' } })
  }, [letter, reduce, status, press])

  return (
    <motion.div
      role="gridcell"
      aria-label={describeTile(letter, status)}
      className="relative"
      style={{ width: 'var(--tile)', height: 'var(--tile)' }}
      animate={hopping && !reduce ? { y: [0, -12, 0] } : { y: 0 }}
      transition={{ duration: hop / 1000, delay: (index * hopStagger) / 1000, ease: 'easeOut' }}
    >
      {/* Lime glow pulse travels with the hop */}
      {hopping && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-md shadow-[var(--glow-win)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 1 : [0, 1, 0] }}
          transition={{ duration: reduce ? 0.15 : hop / 1000, delay: (index * hopStagger) / 1000 }}
        />
      )}
      <motion.div
        className="size-full"
        initial={false}
        animate={revealing && !reduce ? { rotateX: [0, 60, 90, 60, 0] } : { rotateX: 0 }}
        transition={
          revealing && !reduce
            ? { duration: tile / 1000, delay: delay / 1000, times: [0, 0.244, 0.5, 0.756, 1], ease: 'linear' }
            : { duration: 0 }
        }
      >
        <motion.div
          animate={press}
          className={`relative grid size-full place-items-center rounded-md ${faces[face]}`}
        >
          <AnimatePresence initial={false}>
            {letter && (
              <motion.span
                key={letter}
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center font-display font-bold uppercase"
                style={{ fontSize: 'var(--tile-font)', lineHeight: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
              >
                {letter}
              </motion.span>
            )}
          </AnimatePresence>
          {face === 'active' && (
            <span
              aria-hidden="true"
              className="rounded-[2px] bg-cobalt"
              style={{ width: 2.5, height: 'calc(var(--tile) * 0.4375)' }}
            />
          )}
          {showMark && <StatusMark status={face as LetterStatus} on="tile" animate={markAnimates.current} />}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Static tile for the legend, How to Play and the answer reveal
export function StaticTile({
  letter,
  status,
  size,
  fontSize,
  mark = true,
  glow = false,
}: {
  letter: string
  status: LetterStatus
  size: number
  fontSize: number
  mark?: boolean
  glow?: boolean
}) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-md ${faces[status]}`}
      style={{ width: size, height: size, boxShadow: glow ? undefined : 'none' }}
      role="img"
      aria-label={describeTile(letter, status)}
    >
      <span aria-hidden="true" className="font-display leading-none font-bold uppercase" style={{ fontSize }}>
        {letter}
      </span>
      {mark && <StatusMark status={status} on="tile" />}
    </span>
  )
}
