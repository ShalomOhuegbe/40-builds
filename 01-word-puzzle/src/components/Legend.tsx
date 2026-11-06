import { StaticTile } from './GameTile'
import type { LetterStatus } from '../game/types'

const rows: { letter: string; status: LetterStatus; text: string }[] = [
  { letter: 'a', status: 'correct', text: 'Right letter, right spot' },
  { letter: 'r', status: 'present', text: 'In the word, wrong spot' },
  { letter: 'e', status: 'absent', text: 'Not in the word' },
]

export function Legend() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="type-mono text-ink-3">How it reads</h2>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.status} className="flex items-center gap-3">
            <StaticTile letter={row.letter} status={row.status} size={44} fontSize={18} glow={row.status === 'correct'} />
            <span className="type-label-m text-ink-2">{row.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
