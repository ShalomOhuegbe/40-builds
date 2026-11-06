import type { IconName } from './Icon'
import { Icon } from './Icon'
import { Badge } from './Badge'
import { Wordmark } from './Wordmark'

export type Panel = 'help' | 'stats' | 'settings'

const controls: { panel: Panel; icon: IconName; label: string }[] = [
  { panel: 'help', icon: 'help', label: 'How to play' },
  { panel: 'stats', icon: 'stats', label: 'Statistics' },
  { panel: 'settings', icon: 'settings', label: 'Settings' },
]

type Props = { practice: boolean; streak: number; onOpen: (panel: Panel) => void }

export function GameHeader({ practice, streak, onOpen }: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line pr-4 pl-5 md:h-[72px] md:px-10">
      <div className="flex items-center gap-4">
        <span className="md:hidden"><Wordmark scale={0.9} /></span>
        <span className="hidden md:inline-flex"><Wordmark /></span>
        <span aria-hidden="true" className="hidden h-6 w-px bg-line md:block" />
        <span className="hidden md:block"><Badge text={practice ? 'Practice round' : 'Daily challenge'} /></span>
      </div>
      <div className="flex items-center gap-1.5 md:gap-2">
        <p className="hidden items-center gap-1.5 py-2.5 pr-3.5 pl-3 type-label-m text-ink md:mr-2 md:flex">
          <Icon name="flame" size={18} />
          {streak}-day streak
        </p>
        {controls.map(({ panel, icon, label }) => (
          <button
            key={panel}
            type="button"
            aria-label={label}
            onClick={() => onOpen(panel)}
            className="group relative grid size-10 place-items-center rounded-md border-[1.5px] border-line bg-surface transition-colors duration-[120ms] hover:border-ink hover:bg-lime-tint active:border-line active:bg-surface-2 md:size-11"
          >
            <Icon name={icon} />
            {/* Tooltip on desktop hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-full right-0 z-20 mt-2 hidden rounded-sm bg-ink px-2.5 py-1.5 type-label-s whitespace-nowrap text-surface opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100 lg:block"
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </header>
  )
}
