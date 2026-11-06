import { emptyStats } from './stats.ts'
import type { SavedGame, Settings, Stats } from './types.ts'

const KEYS = { game: 'krak.game.v1', stats: 'krak.stats.v1', settings: 'krak.settings.v1' }

// Storage can be blocked or full (private windows, for example): the game still
// runs, it just won't remember anything.
function read<T>(key: string): Partial<T> | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Partial<T>) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Nothing useful to do; progress lasts for this session only
  }
}

export function loadGame(puzzle: number): SavedGame | null {
  const saved = read<SavedGame>(KEYS.game)
  if (!saved || saved.puzzle !== puzzle || !Array.isArray(saved.guesses)) return null
  return { puzzle, guesses: saved.guesses, current: typeof saved.current === 'string' ? saved.current : '' }
}

export const saveGame = (game: SavedGame) => write(KEYS.game, game)

export function loadStats(): Stats {
  return { ...emptyStats, ...read<Stats>(KEYS.stats) }
}

export const saveStats = (stats: Stats) => write(KEYS.stats, stats)

export function loadSettings(): Settings {
  return { highContrast: false, reduceMotion: null, ...read<Settings>(KEYS.settings) }
}

export const saveSettings = (settings: Settings) => write(KEYS.settings, settings)
