import { answers } from '../data/answers.ts'

// No. 1 is 20 March 2026, which makes Mon 19 Oct 2026 No. 214 as in the Figma file.
const EPOCH_UTC = Date.UTC(2026, 2, 20)
const DAY_MS = 86_400_000

export const answerList = Object.keys(answers).sort()

// Calendar-day based (not elapsed ms), so daylight saving can't shift a puzzle.
export function puzzleNumberForDate(date: Date): number {
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((today - EPOCH_UTC) / DAY_MS) + 1
}

function seededShuffle(words: string[], seed: number): string[] {
  let state = seed >>> 0
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const list = [...words]
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

// Same puzzle number → same word for everyone. Each pass through the pool uses a
// fresh fixed-seed shuffle, so no word repeats until the whole pool has been used.
export function answerForPuzzle(puzzle: number): string {
  const size = answerList.length
  const index = puzzle - 1
  const cycle = Math.floor(index / size)
  return seededShuffle(answerList, 214 + cycle)[((index % size) + size) % size]
}

export function definitionFor(word: string): string {
  return answers[word] ?? ''
}

export function formatPuzzleDate(date: Date): string {
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  return `${weekday} ${day} ${month}`
}

export function msUntilNextPuzzle(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return next.getTime() - now.getTime()
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}
