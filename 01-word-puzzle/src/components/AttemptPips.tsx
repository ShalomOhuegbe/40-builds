import { MAX_GUESSES } from '../game/types'

// Used · current · left. Decorative: the text beside it carries the count.
export function AttemptPips({ used, playing, size }: { used: number; playing: boolean; size: 'large' | 'small' }) {
  const large = size === 'large'
  return (
    <div aria-hidden="true" className={`flex ${large ? 'w-full gap-1.5' : 'gap-[3px]'}`}>
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const current = playing && i === used
        return (
          <span
            key={i}
            className={`${large ? 'h-2 flex-1 rounded-[4px] border-[1.5px]' : 'h-1.5 w-3 rounded-[3px] border'} ${
              i < used ? 'border-ink bg-ink' : current ? 'border-ink bg-lime' : 'border-line bg-surface'
            }`}
          />
        )
      })}
    </div>
  )
}
