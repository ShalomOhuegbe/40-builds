import { MAX_GUESSES } from '../game/types'

// Bars scale to the most-used row with a 28px floor; today's row is lime.
export function Distribution({ counts, highlight }: { counts: number[]; highlight: number | null }) {
  const max = Math.max(1, ...counts)
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="type-mono text-ink-3">Guess distribution</h3>
      <ol className="flex flex-col gap-1.5">
        {Array.from({ length: MAX_GUESSES }, (_, i) => {
          const count = counts[i] ?? 0
          const today = highlight === i + 1
          return (
            <li key={i} className="flex items-center gap-2.5" aria-label={`${i + 1} ${i === 0 ? 'guess' : 'guesses'}: ${count} ${count === 1 ? 'win' : 'wins'}`}>
              <span aria-hidden="true" className="w-2.5 type-label-m text-ink-2">{i + 1}</span>
              <span aria-hidden="true" className="min-w-0 flex-1">
                <span
                  className={`flex h-[22px] items-center justify-end rounded-xs pr-2 type-label-s ${today ? 'border-[1.5px] border-ink bg-lime text-ink' : 'bg-surface-2 text-ink-2'}`}
                  style={{ width: `max(28px, ${(count / max) * 100}%)` }}
                >
                  {count}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
