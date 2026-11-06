import type { LetterStatus } from './types.ts'

// Two passes so repeated letters are handled correctly: exact matches claim
// their letter first, then remaining letters are matched left to right.
export function evaluateGuess(guess: string, answer: string): LetterStatus[] {
  const result: LetterStatus[] = Array.from(guess, () => 'absent')
  const remaining = new Map<string, number>()

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) result[i] = 'correct'
    else remaining.set(answer[i], (remaining.get(answer[i]) ?? 0) + 1)
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue
    const left = remaining.get(guess[i]) ?? 0
    if (left > 0) {
      result[i] = 'present'
      remaining.set(guess[i], left - 1)
    }
  }

  return result
}

const RANK: Record<LetterStatus, number> = { absent: 0, present: 1, correct: 2 }

// Best status seen for each letter, for the keyboard. Correct is never downgraded.
export function keyboardStatuses(guesses: string[], answer: string): Record<string, LetterStatus> {
  const keys: Record<string, LetterStatus> = {}
  for (const guess of guesses) {
    evaluateGuess(guess, answer).forEach((status, i) => {
      const letter = guess[i]
      if (!keys[letter] || RANK[status] > RANK[keys[letter]]) keys[letter] = status
    })
  }
  return keys
}
