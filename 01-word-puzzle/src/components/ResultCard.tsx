import { evaluateGuess } from '../game/evaluate'
import { formatPuzzleDate } from '../game/daily'
import { MAX_GUESSES, type GameMode, type LetterStatus } from '../game/types'
import { StatusMark } from './StatusMark'
import { Wordmark } from './Wordmark'

const cell: Record<LetterStatus, string> = {
  correct: 'bg-correct text-correct-ink',
  present: 'bg-present text-present-ink',
  absent: 'bg-absent text-absent-ink',
}

type Props = { mode: GameMode; puzzle: number; guesses: string[]; answer: string; won: boolean }

// Screenshot-friendly summary. Colours and marks only: no letters, so no spoilers.
export function ResultCard({ mode, puzzle, guesses, answer, won }: Props) {
  const score = `${won ? guesses.length : 'X'} / ${MAX_GUESSES}`
  return (
    <figure
      aria-label={`Result card: ${mode === 'daily' ? `No. ${puzzle}` : 'Practice round'}, ${score}`}
      className="flex items-center justify-between gap-4 rounded-lg border-2 border-ink bg-canvas p-5 shadow-[var(--shadow-hard)]"
    >
      <figcaption className="flex min-w-0 flex-col gap-3">
        <Wordmark scale={0.8} />
        <div className="flex flex-col gap-1">
          <p className="font-display text-[28px] leading-[1.1] font-bold tracking-[-0.02em] text-ink">{score}</p>
          <p className="type-mono text-ink-3">{mode === 'daily' ? `No. ${puzzle}` : 'Practice'}</p>
          <p className="type-label-s text-ink-3">{formatPuzzleDate(new Date())}</p>
        </div>
      </figcaption>
      <div aria-hidden="true" className="flex shrink-0 flex-col gap-1">
        {guesses.map((guess, row) => (
          <div key={row} className="flex gap-1">
            {evaluateGuess(guess, answer).map((status, i) => (
              <span key={i} className={`relative block size-6 rounded-xs ${cell[status]}`}>
                <span className="absolute -top-0.5 -right-0.5 origin-top-right scale-[0.6]">
                  <span className="relative block size-3"><StatusMark status={status} on="tile" /></span>
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </figure>
  )
}
