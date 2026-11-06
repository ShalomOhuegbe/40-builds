import { MAX_GUESSES, type Stats } from './types.ts'

export const emptyStats: Stats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  bestStreak: 0,
  distribution: Array.from({ length: MAX_GUESSES }, () => 0),
  lastPuzzle: 0,
  lastWonPuzzle: 0,
  history: {},
}

// Pure and idempotent: recording the same puzzle twice changes nothing.
// attempts is null for a loss.
export function recordResult(stats: Stats, puzzle: number, attempts: number | null): Stats {
  if (stats.history[puzzle] !== undefined) return stats

  const history = { ...stats.history, [puzzle]: attempts ?? ('X' as const) }
  const base = { ...stats, played: stats.played + 1, lastPuzzle: Math.max(stats.lastPuzzle, puzzle), history }

  if (attempts === null) return { ...base, currentStreak: 0 }

  const continues = stats.lastWonPuzzle === puzzle - 1
  const currentStreak = continues ? stats.currentStreak + 1 : 1
  const distribution = [...stats.distribution]
  distribution[attempts - 1] += 1

  return {
    ...base,
    wins: stats.wins + 1,
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    distribution,
    lastWonPuzzle: puzzle,
  }
}

// A streak survives until a whole day is missed.
export function activeStreak(stats: Stats, todayPuzzle: number): number {
  return stats.lastWonPuzzle >= todayPuzzle - 1 ? stats.currentStreak : 0
}

export function winRate(stats: Stats): number {
  return stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100)
}

export function averageAttempts(stats: Stats): number | null {
  if (stats.wins === 0) return null
  const total = stats.distribution.reduce((sum, count, i) => sum + count * (i + 1), 0)
  return total / stats.wins
}
