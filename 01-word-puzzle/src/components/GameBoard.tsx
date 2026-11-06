import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { evaluateGuess } from '../game/evaluate'
import { MAX_GUESSES, WORD_LENGTH, type GameStatus, type TileStatus } from '../game/types'
import { useReduceMotion } from '../useMotionPrefs'
import { describeTile, GameTile } from './GameTile'

type Props = {
  guesses: string[]
  current: string
  answer: string
  status: GameStatus
  revealRow: number | null
  hopRow: number | null
  invalid: boolean
  shakeTick: number
}

export function GameBoard({ guesses, current, answer, status, revealRow, hopRow, invalid, shakeTick }: Props) {
  const reduce = useReduceMotion()
  const shake = useAnimationControls()
  const activeRow = guesses.length

  // 0, −8, 8, −6, 6, −3, 0 px over 400ms
  useEffect(() => {
    if (shakeTick === 0 || reduce) return
    shake.start({ x: [0, -8, 8, -6, 6, -3, 0], transition: { duration: 0.4, ease: 'easeInOut' } })
  }, [shakeTick, reduce, shake])

  const tilesFor = (row: number): { letter: string; status: TileStatus }[] => {
    if (row < guesses.length) {
      const statuses = evaluateGuess(guesses[row], answer)
      return statuses.map((s, i) => ({ letter: guesses[row][i], status: s }))
    }
    return Array.from({ length: WORD_LENGTH }, (_, i) => {
      if (row !== activeRow || status !== 'playing') return { letter: '', status: 'empty' as const }
      if (i < current.length) return { letter: current[i], status: invalid ? ('invalid' as const) : ('filled' as const) }
      if (i === current.length && revealRow === null) return { letter: '', status: 'active' as const }
      return { letter: '', status: 'empty' as const }
    })
  }

  return (
    <div
      role="grid"
      tabIndex={0}
      aria-label={`Game board. ${guesses.length} of ${MAX_GUESSES} guesses used.`}
      aria-readonly="true"
      className="flex flex-col rounded-md"
      style={{ gap: 'var(--tile-gap)' }}
    >
      {Array.from({ length: MAX_GUESSES }, (_, row) => {
        const tiles = tilesFor(row)
        const filled = tiles.some((tile) => tile.letter)
        return (
          <motion.div
            key={row}
            role="row"
            aria-label={`Guess ${row + 1} of ${MAX_GUESSES}: ${filled ? tiles.map((t) => describeTile(t.letter, t.status)).join('; ') : 'empty'}`}
            className="flex"
            style={{ gap: 'var(--tile-gap)' }}
            animate={row === activeRow ? shake : undefined}
          >
            {tiles.map((tile, i) => (
              <GameTile
                key={i}
                index={i}
                letter={tile.letter}
                status={tile.status}
                revealing={revealRow === row}
                hopping={hopRow === row}
              />
            ))}
          </motion.div>
        )
      })}
    </div>
  )
}
