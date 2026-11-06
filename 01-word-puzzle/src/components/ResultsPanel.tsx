import { definitionFor } from '../game/daily'
import { lossMessage, winMessage, winTitle } from '../game/copy'
import type { Game } from '../game/useGame'
import { MAX_GUESSES, type Stats } from '../game/types'
import { useCountdown } from '../useCountdown'
import { useIsMobile } from '../useMotionPrefs'
import { activeStreak } from '../game/stats'
import { Button } from './Button'
import { Distribution } from './Distribution'
import { StaticTile } from './GameTile'
import { StatRow } from './StatRow'

// The average you were chasing, i.e. stats without today's game
function statsBeforeToday(stats: Stats, attempts: number): Stats {
  const distribution = [...stats.distribution]
  distribution[attempts - 1] = Math.max(0, distribution[attempts - 1] - 1)
  return { ...stats, wins: stats.wins - 1, distribution }
}

type Props = { game: Game; onShare: () => void; onPlayAgain: () => void }

export function ResultsPanel({ game, onShare, onPlayAgain }: Props) {
  const mobile = useIsMobile()
  const countdown = useCountdown()
  const { mode, puzzle, guesses, answer, status, stats } = game
  const won = status === 'won'
  const attempts = guesses.length
  const score = `${won ? attempts : 'X'} / ${MAX_GUESSES}`
  const heading = mode === 'daily' ? `No. ${puzzle}  ·  ${score}` : `Practice  ·  ${score}`

  const message = won
    ? mode === 'daily'
      ? winMessage(attempts, stats.wins > 1 ? statsBeforeToday(stats, attempts) : null)
      : `You cracked the practice word in ${attempts} ${attempts === 1 ? 'try' : 'tries'}.`
    : lossMessage(guesses, answer)

  const share = (
    <Button key="share" variant={won ? 'primary' : 'secondary'} icon="share" onClick={onShare} data-autofocus={won || undefined} className="w-full md:flex-1">
      Share result
    </Button>
  )
  const again = (
    <Button key="again" variant={won ? 'secondary' : 'primary'} icon="refresh" onClick={onPlayAgain} data-autofocus={!won || undefined} className="w-full md:flex-1">
      Play again
    </Button>
  )

  return (
    <div className="flex flex-col gap-5 md:gap-[22px]">
      {mobile ? (
        <p className="type-mono text-ink-3">{heading}</p>
      ) : (
        <p className="w-fit rounded-full border-[1.5px] border-ink bg-lime px-3 py-1.5 type-mono text-ink">{heading}</p>
      )}

      <div className="flex flex-col gap-2 md:gap-2.5">
        <h2 className="font-display text-[32px] leading-[1.08] font-bold tracking-[-0.02em] text-ink md:type-display-l">
          {won ? winTitle(attempts) : 'So close.'}
        </h2>
        <p className="type-body-m text-ink-2">{message}</p>
      </div>

      <div className="flex gap-1.5">
        {[...answer].map((letter, i) => (
          <StaticTile
            key={i}
            letter={letter}
            status="correct"
            size={mobile ? 56 : 48}
            fontSize={mobile ? 26 : 22}
            mark={false}
            glow={!won}
          />
        ))}
      </div>

      {!won && <p className="rounded-md bg-canvas px-3.5 py-3 type-label-s text-ink-2">{definitionFor(answer)}</p>}

      {mobile && !won ? (
        <div className="flex justify-between type-label-m">
          <p className="text-ink">{mode === 'daily' ? `Streak reset to ${activeStreak(stats, puzzle)}` : 'Practice rounds don’t count'}</p>
          <p className="text-ink-3">Best: {stats.bestStreak}</p>
        </div>
      ) : (
        <>
          <StatRow stats={stats} puzzle={puzzle} />
          {!mobile && <Distribution counts={stats.distribution} highlight={won && mode === 'daily' ? attempts : null} />}
        </>
      )}

      {/* Figma: Share leads a win, Play again leads a loss */}
      <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">{won ? [share, again] : [again, share]}</div>

      <div className="hidden items-center justify-between border-t border-line pt-4 md:flex">
        <p className="type-mono text-ink-3">Next word in</p>
        <p className="font-display text-[20px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink tabular-nums">{countdown}</p>
      </div>
      <p className="type-mono text-ink-3 tabular-nums md:hidden">Next word in {countdown}</p>
    </div>
  )
}
