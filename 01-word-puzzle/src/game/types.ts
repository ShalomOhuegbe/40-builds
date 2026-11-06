export type LetterStatus = 'correct' | 'present' | 'absent'
export type TileStatus = 'empty' | 'active' | 'filled' | 'invalid' | LetterStatus
export type GameStatus = 'playing' | 'won' | 'lost'
export type GameMode = 'daily' | 'practice'

export const WORD_LENGTH = 5
export const MAX_GUESSES = 6

export type SavedGame = {
  puzzle: number
  guesses: string[]
  current: string
}

export type Stats = {
  played: number
  wins: number
  currentStreak: number
  bestStreak: number
  distribution: number[] // wins by attempts; index 0 = solved in 1
  lastPuzzle: number // last puzzle recorded (guards against double counting)
  lastWonPuzzle: number
  history: Record<number, number | 'X'> // puzzle number → attempts, or X for a loss
}

export type Settings = {
  highContrast: boolean
  reduceMotion: boolean | null // null = follow the operating system
}
