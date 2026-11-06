import { useCallback, useEffect, useRef, useState } from 'react'
import { describeGuess } from './copy.ts'
import { answerForPuzzle, answerList, puzzleNumberForDate } from './daily.ts'
import { isValidGuess } from './dictionary.ts'
import { keyboardStatuses } from './evaluate.ts'
import { timings } from './motion.ts'
import { recordResult } from './stats.ts'
import { loadGame, loadStats, saveGame, saveStats } from './storage.ts'
import { MAX_GUESSES, WORD_LENGTH, type GameMode, type GameStatus, type Stats } from './types.ts'

type ToastKind = 'error' | 'info' | 'success'

type Options = {
  reduceMotion: boolean
  announce: (message: string) => void
  showToast: (kind: ToastKind, message: string) => void
}

const statusOf = (guesses: string[], answer: string): GameStatus =>
  guesses.includes(answer) ? 'won' : guesses.length >= MAX_GUESSES ? 'lost' : 'playing'

function dailyState() {
  const puzzle = puzzleNumberForDate(new Date())
  const answer = answerForPuzzle(puzzle)
  const saved = loadGame(puzzle)
  return { puzzle, answer, guesses: saved?.guesses ?? [], current: saved?.current ?? '' }
}

export function useGame({ reduceMotion, announce, showToast }: Options) {
  const [initial] = useState(dailyState)
  const [mode, setMode] = useState<GameMode>('daily')
  const [gameId, setGameId] = useState(0)
  const [puzzle, setPuzzle] = useState(initial.puzzle)
  const [answer, setAnswer] = useState(initial.answer)
  const [guesses, setGuesses] = useState(initial.guesses)
  const [current, setCurrent] = useState(initial.current)
  const [stats, setStats] = useState<Stats>(loadStats)

  const [revealRow, setRevealRow] = useState<number | null>(null)
  const [revealedCount, setRevealedCount] = useState(initial.guesses.length) // drives the keyboard
  const [invalid, setInvalid] = useState(false)
  const [shakeTick, setShakeTick] = useState(0)
  const [hopRow, setHopRow] = useState<number | null>(null)
  const [resultsTick, setResultsTick] = useState(() =>
    statusOf(initial.guesses, initial.answer) === 'playing' ? 0 : 1,
  )

  const status = statusOf(guesses, answer)
  const busy = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const load = useCallback(
    (next: { mode: GameMode; puzzle: number; answer: string; guesses: string[]; current: string }) => {
      timers.current.forEach(window.clearTimeout)
      timers.current = []
      busy.current = false
      setMode(next.mode)
      setPuzzle(next.puzzle)
      setAnswer(next.answer)
      setGuesses(next.guesses)
      setCurrent(next.current)
      setRevealedCount(next.guesses.length)
      setRevealRow(null)
      setHopRow(null)
      setInvalid(false)
      setGameId((id) => id + 1)
    },
    [],
  )

  // Midnight: today's puzzle changes under an open tab
  useEffect(() => {
    const id = window.setInterval(() => {
      if (puzzleNumberForDate(new Date()) === puzzle || mode === 'practice') return
      load({ mode: 'daily', ...dailyState() })
      setStats(loadStats())
    }, 1000)
    return () => window.clearInterval(id)
  }, [puzzle, mode, load])

  const canType = () => !busy.current && status === 'playing'

  const addLetter = useCallback(
    (letter: string) => {
      if (!canType()) return
      setInvalid(false)
      setCurrent((word) => {
        if (word.length >= WORD_LENGTH) return word
        const next = word + letter
        if (mode === 'daily') saveGame({ puzzle, guesses, current: next })
        return next
      })
    },
    [status, mode, puzzle, guesses],
  )

  const removeLetter = useCallback(() => {
    if (!canType()) return
    setInvalid(false)
    setCurrent((word) => {
      const next = word.slice(0, -1)
      if (mode === 'daily') saveGame({ puzzle, guesses, current: next })
      return next
    })
  }, [status, mode, puzzle, guesses])

  const submit = useCallback(() => {
    if (!canType()) return

    if (current.length < WORD_LENGTH) {
      setShakeTick((tick) => tick + 1)
      showToast('info', 'Not enough letters')
      return
    }
    if (!isValidGuess(current)) {
      setInvalid(true)
      setShakeTick((tick) => tick + 1)
      showToast('error', 'Not in word list')
      return
    }

    const row = guesses.length
    const nextGuesses = [...guesses, current]
    const nextStatus = statusOf(nextGuesses, answer)
    const { tile, stagger, hop, hopStagger, resultsAfterWin, resultsAfterLoss } = timings(reduceMotion)
    const revealTime = stagger * (WORD_LENGTH - 1) + tile

    busy.current = true
    setGuesses(nextGuesses)
    setCurrent('')
    setRevealRow(row)

    // Saved now, not after the animation, so a refresh mid-reveal can't undo a guess
    let finalStats = stats
    if (mode === 'daily') {
      saveGame({ puzzle, guesses: nextGuesses, current: '' })
      if (nextStatus !== 'playing') {
        finalStats = recordResult(stats, puzzle, nextStatus === 'won' ? nextGuesses.length : null)
        saveStats(finalStats)
      }
    }

    later(() => {
      setRevealRow(null)
      announce(describeGuess(current, answer, row))
      later(() => setRevealedCount(nextGuesses.length), 100) // keys recolour 100ms after landing

      if (nextStatus === 'playing') {
        busy.current = false
        return
      }
      setStats(finalStats)
      if (nextStatus === 'won') {
        setHopRow(row)
        later(() => setHopRow(null), hop + hopStagger * (WORD_LENGTH - 1))
        later(() => setResultsTick((tick) => tick + 1), resultsAfterWin)
      } else {
        later(() => setResultsTick((tick) => tick + 1), resultsAfterLoss)
      }
      busy.current = false
    }, revealTime)
  }, [status, current, guesses, answer, stats, mode, puzzle, reduceMotion, announce, showToast])

  // Figma's "Play again" on a one-a-day game: an unranked practice round.
  // It never touches the daily save or stats, and a refresh returns to the daily.
  const playAgain = useCallback(() => {
    const daily = answerForPuzzle(puzzleNumberForDate(new Date()))
    let word = daily
    while (word === daily || word === answer) word = answerList[Math.floor(Math.random() * answerList.length)]
    load({ mode: 'practice', puzzle, answer: word, guesses: [], current: '' })
  }, [answer, puzzle, load])

  return {
    gameId,
    mode,
    puzzle,
    answer,
    guesses,
    current,
    status,
    stats,
    revealRow,
    invalid,
    shakeTick,
    hopRow,
    resultsTick,
    keyStatuses: keyboardStatuses(guesses.slice(0, revealedCount), answer),
    addLetter,
    removeLetter,
    submit,
    playAgain,
  }
}

export type Game = ReturnType<typeof useGame>
