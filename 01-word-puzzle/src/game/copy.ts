import { evaluateGuess } from './evaluate.ts'
import { averageAttempts } from './stats.ts'
import type { Stats } from './types.ts'

const WORDS = ['one', 'two', 'three', 'four', 'five', 'six']
const TITLES = ['Unreal!', 'Brilliant!', 'Superb!', 'Splendid!', 'Nice one!', 'Phew!']

export const winTitle = (attempts: number) => TITLES[attempts - 1]

// statsBefore excludes today's game, so "your average" is the one you were chasing.
export function winMessage(attempts: number, statsBefore: Stats | null): string {
  const tries = attempts === 1 ? 'one try' : `${WORDS[attempts - 1]} tries`
  const start = `You cracked today’s word in ${tries}`
  const average = statsBefore ? averageAttempts(statsBefore) : null
  if (average === null) return `${start}.`
  const diff = Math.round(average - attempts)
  if (diff === 0) return `${start}, right on your average.`
  const amount = WORDS[Math.abs(diff) - 1]
  return diff > 0 ? `${start} — ${amount} better than your average.` : `${start} — ${amount} over your average.`
}

export function lossMessage(guesses: string[], answer: string): string {
  const best = Math.max(0, ...guesses.map((g) => evaluateGuess(g, answer).filter((s) => s === 'correct').length))
  if (best === 0) return 'A tough one. The word was:'
  const word = WORDS[best - 1]
  const capital = word[0].toUpperCase() + word.slice(1)
  return `${capital} ${best === 1 ? 'letter' : 'letters'} nailed at your closest. The word was:`
}

const list = (letters: string[]) =>
  letters.length === 1 ? letters[0] : `${letters.slice(0, -1).join(', ')} and ${letters[letters.length - 1]}`

// Only ever uses letters the player has already uncovered, so it can't spoil the word.
export function tipFor(guesses: string[], answer: string, finished: boolean): string {
  if (finished) return 'That’s today done. A new word lands at midnight.'
  if (guesses.length === 0) return 'Tip: open with common vowels and consonants to learn the most.'

  const locked = new Set<string>()
  const moving = new Set<string>()
  for (const guess of guesses) {
    evaluateGuess(guess, answer).forEach((status, i) => {
      if (status === 'correct') locked.add(guess[i].toUpperCase())
      if (status === 'present') moving.add(guess[i].toUpperCase())
    })
  }
  const toMove = [...moving].filter((letter) => !locked.has(letter))
  const lockedList = [...locked]

  if (lockedList.length && toMove.length) {
    const verb = lockedList.length === 1 ? 'is' : 'are'
    return `Tip: ${list(lockedList)} ${verb} locked in. Try moving the ${list(toMove)}.`
  }
  if (lockedList.length) {
    const verb = lockedList.length === 1 ? 'is' : 'are'
    return `Tip: ${list(lockedList)} ${verb} locked in. Try fresh letters around them.`
  }
  if (toMove.length) return `Tip: the ${list(toMove)} ${toMove.length === 1 ? 'is' : 'are'} in the word. Try a new spot.`
  return 'Tip: nothing landed yet. Rule those letters out and try fresh ones.'
}

const STATUS_LABEL = { correct: 'correct', present: 'wrong spot', absent: 'not in word' }

export const statusLabel = (status: keyof typeof STATUS_LABEL) => STATUS_LABEL[status]

// “Guess 2 of 6: R, wrong spot; O, not in word…”
export function describeGuess(guess: string, answer: string, row: number): string {
  const letters = evaluateGuess(guess, answer)
    .map((status, i) => `${guess[i].toUpperCase()}, ${STATUS_LABEL[status]}`)
    .join('; ')
  return `Guess ${row + 1} of 6: ${letters}.`
}
