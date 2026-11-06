import { activeStreak, winRate } from '../game/stats'
import type { Stats } from '../game/types'
import { useCountdown } from '../useCountdown'

type Props = { stats: Stats; puzzle: number; tip: string; className?: string }

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col-reverse justify-end gap-1">
      <dt className="type-label-s text-ink-3">{label}</dt>
      <dd className="type-display-m text-ink">{value}</dd>
    </div>
  )
}

export function YourRun({ stats, puzzle, tip, className = '' }: Props) {
  const countdown = useCountdown()
  return (
    <section
      aria-labelledby="your-run"
      className={`flex flex-col gap-5 rounded-lg border border-line bg-surface p-6 shadow-[var(--shadow-card)] ${className}`}
    >
      <h2 id="your-run" className="type-mono text-ink-3">Your run</h2>
      <dl className="grid grid-cols-2 gap-4">
        <Stat value={stats.played} label="Played" />
        <Stat value={`${winRate(stats)}%`} label="Win rate" />
        <Stat value={activeStreak(stats, puzzle)} label="Streak" />
        <Stat value={stats.bestStreak} label="Best" />
      </dl>
      <hr className="border-line" />
      <div className="flex flex-col gap-1.5">
        <p className="type-mono text-ink-3">Next word in</p>
        <p className="font-display text-[28px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink tabular-nums">{countdown}</p>
      </div>
      <p className="rounded-md bg-cobalt-tint px-3.5 py-3 type-label-s text-cobalt-deep">{tip}</p>
    </section>
  )
}
