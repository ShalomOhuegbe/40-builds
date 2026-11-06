import { activeStreak, winRate } from '../game/stats'
import type { Stats } from '../game/types'

export function StatRow({ stats, puzzle }: { stats: Stats; puzzle: number }) {
  const items = [
    { label: 'Played', value: stats.played },
    { label: 'Win rate', value: `${winRate(stats)}%` },
    { label: 'Streak', value: activeStreak(stats, puzzle) },
    { label: 'Best', value: stats.bestStreak },
  ]
  return (
    <dl className="flex overflow-hidden rounded-[14px] border border-line">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col-reverse items-center gap-1 border-r border-line py-3.5 last:border-r-0">
          <dt className="type-label-s text-ink-3">{item.label}</dt>
          <dd className="text-[20px] font-semibold tracking-[-0.01em] text-ink md:text-[24px] font-display leading-[1.2]">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
