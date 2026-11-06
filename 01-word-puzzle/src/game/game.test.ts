import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { evaluateGuess, keyboardStatuses } from './evaluate.ts'
import { answerForPuzzle, answerList, formatCountdown, puzzleNumberForDate } from './daily.ts'
import { activeStreak, emptyStats, recordResult, winRate } from './stats.ts'
import { buildShareText } from './share.ts'
import { lossMessage, tipFor, winMessage } from './copy.ts'

const short = (guess: string, answer: string) =>
  evaluateGuess(guess, answer).map((s) => s[0]).join('')

test('evaluates the Figma example: STARE and ROACH against CRACK', () => {
  assert.equal(short('stare', 'crack'), 'aacpa')
  assert.equal(short('roach', 'crack'), 'pacca')
})

test('handles repeated letters', () => {
  // One E in the answer: the exact match claims it, so earlier Es are absent
  assert.equal(short('geese', 'crane'), 'aaaac')
  assert.equal(short('eerie', 'crane'), 'aapac')
  // One L in the answer, taken by the exact match in position 2
  assert.equal(short('llama', 'alarm'), 'accpp')
  assert.equal(short('hello', 'world'), 'aaacp')
  // One L in the answer, no exact match: first L present, second absent
  assert.equal(short('allow', 'wheel'), 'apaap')
  // Two Es guessed, two in the answer: both present
  assert.equal(short('speed', 'erase'), 'pappa')
  // Exact matches are claimed before earlier presents
  assert.equal(short('abbey', 'babes'), 'ppcca')
  assert.equal(short('sassy', 'class'), 'ppaca')
  assert.equal(short('crack', 'crack'), 'ccccc')
})

test('repeated-letter counts never exceed the answer', () => {
  for (const [guess, answer] of [['allow', 'wheel'], ['geese', 'crane'], ['sassy', 'class'], ['eerie', 'crane'], ['abbey', 'babes']]) {
    const statuses = evaluateGuess(guess, answer)
    for (const letter of new Set(guess)) {
      const marked = [...guess].filter((c, i) => c === letter && statuses[i] !== 'absent').length
      const inAnswer = [...answer].filter((c) => c === letter).length
      assert.ok(marked <= inAnswer, `${guess}/${answer}: ${letter}`)
    }
  }
})

test('keyboard keeps the best status and never downgrades', () => {
  const keys = keyboardStatuses(['stare', 'roach'], 'crack')
  assert.equal(keys.a, 'correct')
  assert.equal(keys.c, 'correct')
  assert.equal(keys.r, 'present')
  assert.equal(keys.s, 'absent')
  assert.equal(keyboardStatuses(['crack', 'stare'], 'crack').r, 'correct')
})

test('puzzle numbers follow the calendar: Figma date is No. 214', () => {
  assert.equal(puzzleNumberForDate(new Date(2026, 9, 19, 0, 0, 1)), 214)
  assert.equal(puzzleNumberForDate(new Date(2026, 9, 19, 23, 59, 59)), 214)
  assert.equal(puzzleNumberForDate(new Date(2026, 9, 20, 0, 0, 0)), 215)
  // Across the UK and US daylight-saving changes
  assert.equal(puzzleNumberForDate(new Date(2026, 10, 1, 12)) - puzzleNumberForDate(new Date(2026, 9, 25, 12)), 7)
  assert.equal(puzzleNumberForDate(new Date(2027, 2, 29, 12)) - puzzleNumberForDate(new Date(2027, 2, 27, 12)), 2)
})

test('the daily word is deterministic and does not repeat within the pool', () => {
  assert.equal(answerForPuzzle(232), answerForPuzzle(232))
  const pass = Array.from({ length: answerList.length }, (_, i) => answerForPuzzle(i + 1))
  assert.equal(new Set(pass).size, answerList.length)
})

test('every answer is five lowercase letters, defined, and in the dictionary', () => {
  const dictionary = new Set(readFileSync(new URL('../data/dictionary.txt', import.meta.url), 'utf8').trim().split(/\s+/))
  const missing = answerList.filter((word) => !dictionary.has(word))
  assert.deepEqual(missing, [])
  for (const word of answerList) assert.match(word, /^[a-z]{5}$/)
  assert.ok(answerList.length >= 300)
})

test('stats: wins, losses and streaks', () => {
  let stats = recordResult(emptyStats, 100, 4)
  stats = recordResult(stats, 101, 3)
  assert.deepEqual([stats.played, stats.wins, stats.currentStreak, stats.bestStreak], [2, 2, 2, 2])
  assert.equal(stats.distribution[3], 1)
  assert.equal(stats.distribution[2], 1)

  stats = recordResult(stats, 102, null)
  assert.deepEqual([stats.played, stats.wins, stats.currentStreak, stats.bestStreak], [3, 2, 0, 2])
  assert.equal(winRate(stats), 67)
  assert.equal(stats.history[102], 'X')

  stats = recordResult(stats, 103, 6)
  assert.equal(stats.currentStreak, 1)
  // A skipped day restarts the streak
  stats = recordResult(stats, 105, 2)
  assert.equal(stats.currentStreak, 1)
})

test('stats: the same puzzle cannot be counted twice', () => {
  const once = recordResult(emptyStats, 100, 4)
  assert.equal(recordResult(once, 100, 4), once)
  assert.equal(recordResult(once, 100, null), once)
})

test('streak display drops to 0 after a missed day', () => {
  const stats = recordResult(emptyStats, 100, 4)
  assert.equal(activeStreak(stats, 100), 1)
  assert.equal(activeStreak(stats, 101), 1)
  assert.equal(activeStreak(stats, 102), 0)
})

test('share text has number, attempts and grid but never the answer', () => {
  const text = buildShareText({ mode: 'daily', puzzle: 214, guesses: ['stare', 'roach', 'crack'], answer: 'crack', won: true })
  assert.equal(text, 'krak. No. 214  3/6\n\n⬜⬜🟩🟦⬜\n🟦⬜🟩🟩⬜\n🟩🟩🟩🟩🟩')
  assert.ok(!/crack|stare|roach/i.test(text))
  const lost = buildShareText({ mode: 'daily', puzzle: 214, guesses: ['stare'], answer: 'crack', won: false, highContrast: true })
  assert.ok(lost.startsWith('krak. No. 214  X/6'))
  assert.ok(lost.includes('🟧'))
})

test('messages and tips use real game state', () => {
  assert.equal(tipFor(['stare', 'roach'], 'crack', false), 'Tip: A and C are locked in. Try moving the R.')
  assert.equal(lossMessage(['crank'], 'crack'), 'Four letters nailed at your closest. The word was:')
  let stats = emptyStats
  for (let i = 0; i < 2; i++) stats = recordResult(stats, 100 + i, 5)
  assert.equal(winMessage(4, stats), 'You cracked today’s word in four tries — one better than your average.')
  assert.equal(winMessage(4, null), 'You cracked today’s word in four tries.')
})

test('countdown format', () => {
  assert.equal(formatCountdown(34937000), '09:42:17')
})
