import { evaluateGuess } from './evaluate.ts'
import { MAX_GUESSES, type GameMode, type LetterStatus } from './types.ts'

const EMOJI: Record<LetterStatus, string> = { correct: '🟩', present: '🟦', absent: '⬜' }
const EMOJI_HIGH_CONTRAST: Record<LetterStatus, string> = { ...EMOJI, present: '🟧' }

// Colours only. Letters never appear, so a shared result can't spoil the answer.
export function buildShareText(options: {
  mode: GameMode
  puzzle: number
  guesses: string[]
  answer: string
  won: boolean
  highContrast?: boolean
}): string {
  const { mode, puzzle, guesses, answer, won, highContrast } = options
  const emoji = highContrast ? EMOJI_HIGH_CONTRAST : EMOJI
  const score = `${won ? guesses.length : 'X'}/${MAX_GUESSES}`
  const title = mode === 'daily' ? `krak. No. ${puzzle}  ${score}` : `krak. Practice  ${score}`
  const grid = guesses.map((guess) => evaluateGuess(guess, answer).map((s) => emoji[s]).join('')).join('\n')
  return `${title}\n\n${grid}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for browsers or contexts without the async clipboard API
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const copied = document.execCommand('copy')
    area.remove()
    return copied
  }
}
