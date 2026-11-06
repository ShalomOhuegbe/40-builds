import { statusLabel } from '../game/copy'
import type { LetterStatus } from '../game/types'
import { Icon } from './Icon'
import { StatusMark } from './StatusMark'

const base =
  'relative grid place-items-center rounded-sm transition-[background-color,box-shadow,translate,border-color] duration-[120ms] ease-[var(--ease-standard)] select-none focus-visible:outline-offset-[-3px]'

// Pressed drops the 2px lip and shifts the key down into it. It applies to both
// :active (pointer) and data-pressed (physical keyboard), so the two stay in sync.
const pressed =
  'data-[pressed=true]:translate-y-0.5 active:translate-y-0.5 data-[pressed=true]:shadow-none active:shadow-none'

const letterStyles: Record<LetterStatus | 'unused', string> = {
  unused: `border border-line bg-surface text-ink shadow-[var(--shadow-key)] hover:border-ink hover:bg-lime-tint data-[pressed=true]:border-line data-[pressed=true]:bg-surface-2 active:border-line active:bg-surface-2 ${pressed}`,
  correct: `border border-correct-line bg-correct text-correct-ink shadow-[var(--shadow-key)] ${pressed}`,
  present: `border border-present-line bg-present text-present-ink shadow-[var(--shadow-key)] ${pressed}`,
  absent: 'bg-absent text-absent-ink data-[pressed=true]:translate-y-0.5 active:translate-y-0.5',
}

type LetterProps = {
  letter: string
  status?: LetterStatus
  disabled: boolean
  isPressed: boolean
  onPress: () => void
}

export function LetterKey({ letter, status, disabled, isPressed, onPress }: LetterProps) {
  return (
    <button
      type="button"
      data-pressed={isPressed}
      aria-disabled={disabled}
      aria-label={status ? `${letter}, ${statusLabel(status)}` : letter}
      // Keeps focus off the key on click, so a physical Enter submits the guess
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => !disabled && onPress()}
      className={`${base} font-body font-semibold ${letterStyles[status ?? 'unused']} ${disabled ? `cursor-not-allowed ${status ? '' : 'opacity-40'}` : ''}`}
      style={{ width: 'var(--key-w)', height: 'var(--key-h)', fontSize: 'var(--key-font)', lineHeight: 1 }}
    >
      <span className={status === 'absent' ? 'line-through decoration-[1.5px]' : undefined}>{letter}</span>
      {status && status !== 'absent' && <StatusMark status={status} on="key" />}
    </button>
  )
}

type ActionProps = {
  action: 'enter' | 'backspace'
  dimmed: boolean
  disabled: boolean
  isPressed: boolean
  onPress: () => void
}

export function ActionKey({ action, dimmed, disabled, isPressed, onPress }: ActionProps) {
  const enter = action === 'enter'
  const style = enter
    ? dimmed
      ? 'bg-surface-2 text-ink-3'
      : `bg-ink text-surface shadow-[var(--shadow-key)] hover:bg-ink-2 data-[pressed=true]:bg-ink-2 active:bg-ink-2 ${pressed}`
    : `border border-line bg-surface shadow-[var(--shadow-key)] hover:bg-lime-tint data-[pressed=true]:bg-surface-2 active:bg-surface-2 ${pressed}`

  return (
    <button
      type="button"
      data-pressed={isPressed}
      aria-disabled={disabled || dimmed}
      aria-label={enter ? 'Enter' : 'Delete letter'}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => !disabled && onPress()}
      className={`${base} font-body text-[13px] leading-none font-semibold tracking-[0.04em] uppercase ${style} ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
      style={{ width: 'var(--action-w)', height: 'var(--key-h)' }}
    >
      {enter ? 'Enter' : <Icon name="backspace" size={22} />}
    </button>
  )
}
