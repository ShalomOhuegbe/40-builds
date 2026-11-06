import type { LetterStatus } from '../game/types'
import { ActionKey, LetterKey } from './KeyboardKey'

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

type Props = {
  statuses: Record<string, LetterStatus>
  pressedKey: string | null
  finished: boolean
  canSubmit: boolean
  onLetter: (letter: string) => void
  onDelete: () => void
  onEnter: () => void
}

export function GameKeyboard({ statuses, pressedKey, finished, canSubmit, onLetter, onDelete, onEnter }: Props) {
  const letter = (char: string) => (
    <LetterKey
      key={char}
      letter={char}
      status={statuses[char.toLowerCase()]}
      disabled={finished}
      isPressed={pressedKey === char}
      onPress={() => onLetter(char.toLowerCase())}
    />
  )

  return (
    <div role="group" aria-label="Keyboard" className="flex flex-col items-center gap-2">
      <div className="flex" style={{ gap: 'var(--key-gap)' }}>{[...ROWS[0]].map(letter)}</div>
      <div className="flex" style={{ gap: 'var(--key-gap)' }}>{[...ROWS[1]].map(letter)}</div>
      <div className="flex" style={{ gap: 'var(--key-gap)' }}>
        <ActionKey action="enter" dimmed={!canSubmit} disabled={finished} isPressed={pressedKey === 'ENTER'} onPress={onEnter} />
        {[...ROWS[2]].map(letter)}
        <ActionKey action="backspace" dimmed={false} disabled={finished} isPressed={pressedKey === 'BACKSPACE'} onPress={onDelete} />
      </div>
    </div>
  )
}
