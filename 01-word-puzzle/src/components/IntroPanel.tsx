import { formatPuzzleDate } from '../game/daily'
import { MAX_GUESSES, type GameMode } from '../game/types'
import { AttemptPips } from './AttemptPips'
import { Badge } from './Badge'
import { Legend } from './Legend'

type Props = { mode: GameMode; puzzle: number; used: number; playing: boolean }

const TITLE = 'Crack the code.'
const SUBTITLE = 'Five letters. Six tries. Can you find the word?'

const meta = (mode: GameMode, puzzle: number) =>
  mode === 'practice' ? 'Practice round  ·  Unranked' : `No. ${puzzle}  ·  ${formatPuzzleDate(new Date())}`

// Desktop left column
export function IntroPanel({ mode, puzzle, used, playing }: Props) {
  const left = MAX_GUESSES - used
  return (
    <div className="flex w-full max-w-[360px] flex-col gap-5">
      <p className="type-mono text-ink-3">{meta(mode, puzzle)}</p>
      <h1 className="type-display-xl text-[min(56px,3.8vw)] text-ink">{TITLE}</h1>
      <p className="max-w-[320px] type-body-l text-ink-2">{SUBTITLE}</p>
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="type-mono text-ink-3">Attempts</h2>
          <p className="type-label-m text-ink">{left} of {MAX_GUESSES} left</p>
        </div>
        <AttemptPips used={used} playing={playing} size="large" />
      </div>
      <div className="border-t border-line pt-4">
        <Legend />
      </div>
    </div>
  )
}

// Mobile and tablet: one meta row plus the heading above the board
export function IntroCompact({ mode, puzzle, used, playing }: Props) {
  return (
    <div className="flex w-full flex-col gap-1.5 md:max-w-[494px]">
      <div className="flex items-center justify-between pb-2.5">
        <div className="flex items-center gap-2">
          <Badge text={mode === 'practice' ? 'Practice' : 'Daily'} />
          {mode === 'daily' && <p className="type-mono text-ink-3">No. {puzzle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <AttemptPips used={used} playing={playing} size="small" />
          <p className="type-label-s text-ink">{MAX_GUESSES - used} left</p>
        </div>
      </div>
      <h1 className="font-display text-[28px] leading-[1.08] font-bold tracking-[-0.02em] text-ink">{TITLE}</h1>
      <p className="type-body-m text-ink-2 [@media(max-height:699px)]:hidden">{SUBTITLE}</p>
    </div>
  )
}
