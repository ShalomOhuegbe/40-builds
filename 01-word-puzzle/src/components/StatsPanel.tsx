import type { Game } from '../game/useGame'
import { useCountdown } from '../useCountdown'
import { Button } from './Button'
import { Distribution } from './Distribution'
import { Legend } from './Legend'
import { ResultCard } from './ResultCard'
import { StatRow } from './StatRow'

const DAYS = 7

// Last seven puzzles at a glance. Today gets an ink outline.
function DailyProgress({ history, puzzle }: { history: Game['stats']['history']; puzzle: number }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="type-mono text-ink-3">Daily progress</h3>
      <ol className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: DAYS }, (_, i) => {
          const number = puzzle - (DAYS - 1 - i)
          const result = history[number]
          const today = number === puzzle
          const won = typeof result === 'number'
          return (
            <li
              key={number}
              aria-label={`No. ${number}: ${result === undefined ? 'not played' : won ? `solved in ${result}` : 'missed'}${today ? ', today' : ''}`}
              className={`grid h-11 place-items-center rounded-sm type-label-m ${
                won ? 'bg-correct text-correct-ink' : result === 'X' ? 'bg-absent text-absent-ink' : 'border border-line bg-surface text-ink-3'
              } ${today ? 'outline-2 outline-ink' : ''}`}
            >
              <span aria-hidden="true">{result ?? '·'}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

type Props = { game: Game; tip: string; onShare: () => void }

export function StatsPanel({ game, tip, onShare }: Props) {
  const countdown = useCountdown()
  const { mode, puzzle, guesses, answer, status, stats } = game
  const finished = status !== 'playing'

  return (
    <div className="flex flex-col gap-5 md:gap-[22px]">
      <h2 className="type-display-m text-ink md:pr-10">Statistics</h2>
      <StatRow stats={stats} puzzle={puzzle} />
      {stats.played === 0 && (
        <p className="rounded-md bg-canvas px-3.5 py-3 type-label-s text-ink-2">
          Nothing here yet. Finish today’s word and your numbers start counting.
        </p>
      )}
      <Distribution counts={stats.distribution} highlight={status === 'won' && mode === 'daily' ? guesses.length : null} />
      <DailyProgress history={stats.history} puzzle={puzzle} />
      <div className="flex items-center justify-between border-t border-line pt-4">
        <p className="type-mono text-ink-3">Next word in</p>
        <p className="font-display text-[20px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink tabular-nums">{countdown}</p>
      </div>

      {/* Side content from the desktop layout moves here on mobile */}
      <p className="rounded-md bg-cobalt-tint px-3.5 py-3 type-label-s text-cobalt-deep md:hidden">{tip}</p>
      <div className="border-t border-line pt-4 md:hidden"><Legend /></div>

      {finished && (
        <div className="flex flex-col gap-4 border-t border-line pt-4">
          <h3 className="type-mono text-ink-3">Today’s result</h3>
          <ResultCard mode={mode} puzzle={puzzle} guesses={guesses} answer={answer} won={status === 'won'} />
          <Button icon="share" onClick={onShare} className="w-full">Share result</Button>
        </div>
      )}
    </div>
  )
}
