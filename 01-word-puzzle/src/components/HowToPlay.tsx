import { StaticTile } from './GameTile'
import { evaluateGuess } from '../game/evaluate'

// The STARE → CRANK → CRACK figure from the Figma cover
const EXAMPLE = ['stare', 'crank', 'crack']

export function HowToPlay() {
  return (
    <div className="flex flex-col gap-5 md:gap-[22px]">
      <div className="flex flex-col gap-2 md:pr-10">
        <h2 className="type-display-m text-ink">How to play</h2>
        <p className="type-body-m text-ink-2">Five letters. Six tries. Everyone gets the same word each day.</p>
      </div>
      <ol className="flex list-decimal flex-col gap-2 pl-5 type-body-m text-ink-2 marker:text-ink-3">
        <li>Type a five-letter word and press Enter.</li>
        <li>Each tile flips to show how close you got.</li>
        <li>Use what you learn to crack it within six tries.</li>
      </ol>
      <div className="flex flex-col gap-1.5" role="group" aria-label="Example guesses: stare, crank, crack">
        {EXAMPLE.map((word) => (
          <div key={word} className="flex gap-1.5">
            {evaluateGuess(word, 'crack').map((status, i) => (
              <StaticTile key={i} letter={word[i]} status={status} size={44} fontSize={18} glow={status === 'correct'} />
            ))}
          </div>
        ))}
        <p className="mt-1.5 type-label-s text-ink-3">Corner marks carry meaning without relying on colour.</p>
      </div>
      <ul className="flex flex-col gap-2 border-t border-line pt-4 type-label-m text-ink-2">
        <li><span className="text-ink">✓ Correct:</span> right letter, right spot</li>
        <li><span className="text-ink">○ Present:</span> in the word, wrong spot</li>
        <li><span className="text-ink">– Absent:</span> not in the word</li>
      </ul>
      <p className="type-mono text-ink-3">A new word lands at midnight</p>
    </div>
  )
}
