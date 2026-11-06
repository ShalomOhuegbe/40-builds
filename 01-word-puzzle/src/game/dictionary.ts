import raw from '../data/dictionary.txt?raw'
import { answerList } from './daily.ts'

const words = new Set([...raw.trim().split(/\s+/), ...answerList])

export const isValidGuess = (word: string) => words.has(word)
