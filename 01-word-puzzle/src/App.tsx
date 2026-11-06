import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { tipFor } from './game/copy'
import { buildShareText, copyToClipboard } from './game/share'
import { activeStreak } from './game/stats'
import { loadSettings, saveSettings } from './game/storage'
import { WORD_LENGTH, type Settings } from './game/types'
import { useGame } from './game/useGame'
import { ReduceMotionContext, useIsMobile, useSystemReducedMotion } from './useMotionPrefs'
import { GameBoard } from './components/GameBoard'
import { GameHeader, type Panel } from './components/GameHeader'
import { GameKeyboard } from './components/GameKeyboard'
import { GameModal } from './components/GameModal'
import { HowToPlay } from './components/HowToPlay'
import { IntroCompact, IntroPanel } from './components/IntroPanel'
import { Legend } from './components/Legend'
import { ResultsPanel } from './components/ResultsPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { StatsPanel } from './components/StatsPanel'
import { Toast, type ToastData } from './components/Toast'
import { YourRun } from './components/YourRun'

type Modal = Panel | 'results' | null

const MODAL_LABELS: Record<Exclude<Modal, null>, string> = {
  help: 'How to play',
  stats: 'Statistics',
  settings: 'Settings',
  results: 'Results',
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const systemReduced = useSystemReducedMotion()
  const reduceMotion = settings.reduceMotion ?? systemReduced
  const mobile = useIsMobile()

  const [modal, setModal] = useState<Modal>(null)
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState<ToastData | null>(null)
  const toastTimer = useRef<number>(undefined)

  // One polite live region for reveals and toasts
  const announce = useCallback((text: string) => setMessage(text), [])
  const showToast = useCallback(
    (kind: ToastData['kind'], text: string) => {
      window.clearTimeout(toastTimer.current)
      setToast({ id: Date.now(), kind, message: text })
      announce(text)
      toastTimer.current = window.setTimeout(() => setToast(null), 1800)
    },
    [announce],
  )

  const game = useGame({ reduceMotion, announce, showToast })
  const { addLetter, removeLetter, submit, status, guesses, answer, puzzle, stats, mode } = game
  const finished = status !== 'playing'
  const playing = !finished

  useEffect(() => {
    if (game.resultsTick > 0) setModal('results')
  }, [game.resultsTick])

  // Physical keyboard. Skipped while a dialog is open; Enter and Space stay with a
  // focused button so keyboard users can operate the on-screen controls.
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (modal || event.metaKey || event.ctrlKey || event.altKey) return
      const onButton = document.activeElement?.tagName === 'BUTTON'
      if (event.key === 'Enter') {
        if (onButton) return
        event.preventDefault()
        setPressedKey('ENTER')
        if (!event.repeat) submit()
      } else if (event.key === 'Backspace') {
        setPressedKey('BACKSPACE')
        removeLetter()
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        setPressedKey(event.key.toUpperCase())
        if (!event.repeat) addLetter(event.key.toLowerCase())
      }
    }
    const onKeyUp = () => setPressedKey(null)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [modal, addLetter, removeLetter, submit])

  // On :root: high contrast overrides tokens, and reduced motion must reach the modal too
  useLayoutEffect(() => {
    document.documentElement.dataset.contrast = settings.highContrast ? 'high' : 'normal'
    document.documentElement.dataset.reduceMotion = String(reduceMotion)
  }, [settings.highContrast, reduceMotion])

  // Background is inert while a dialog is open
  const appRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    appRef.current?.toggleAttribute('inert', modal !== null)
  }, [modal])

  const changeSettings = (next: Settings) => {
    setSettings(next)
    saveSettings(next)
  }

  const share = async () => {
    const text = buildShareText({ mode, puzzle, guesses, answer, won: status === 'won', highContrast: settings.highContrast })
    const copied = await copyToClipboard(text)
    if (copied) showToast('success', 'Copied — paste it in the group chat')
    else showToast('error', 'Couldn’t copy. Your browser blocked it.')
  }

  const playAgain = () => {
    setModal(null)
    game.playAgain()
  }

  const tip = tipFor(guesses, answer, finished)
  const used = guesses.length
  const practice = mode === 'practice'

  return (
    <ReduceMotionContext.Provider value={reduceMotion}>
      <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
        <div ref={appRef} className="flex min-h-dvh flex-col">
          <GameHeader practice={practice} streak={activeStreak(stats, puzzle)} onOpen={setModal} />

          <main className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_494px_minmax(0,1fr)] lg:items-start lg:gap-x-4 lg:px-[clamp(40px,calc(16.67vw-160px),80px)] lg:pt-[var(--page-top)] lg:pb-6">
            {/* Desktop: left column */}
            <aside aria-label="About today’s puzzle" className="hidden lg:block">
              <IntroPanel mode={mode} puzzle={puzzle} used={used} playing={playing} />
            </aside>

            {/* Centre column (the only column below 1200px) */}
            <div className="flex flex-1 flex-col items-center md:flex-none">
              <div className="w-full px-5 pt-4 md:flex md:justify-center md:pt-6 lg:hidden [@media(max-height:699px)]:pt-3">
                <IntroCompact mode={mode} puzzle={puzzle} used={used} playing={playing} />
              </div>

              <div className="my-auto pt-3 md:my-0 md:mt-6 md:pt-0 lg:mt-0">
                <div className="relative">
                <GameBoard
                  key={game.gameId}
                  guesses={guesses}
                  current={game.current}
                  answer={answer}
                  status={status}
                  revealRow={game.revealRow}
                  hopRow={game.hopRow}
                  invalid={game.invalid}
                  shakeTick={game.shakeTick}
                />
                {/* Mobile: 14px below the active row. Larger screens: 16px above the board. */}
                {!modal && (
                  <Toast
                    toast={toast}
                    className="absolute inset-x-0 md:top-auto md:bottom-full md:mb-4"
                    style={mobile ? { top: `calc(${Math.min(used + 1, 6)} * (var(--tile) + var(--tile-gap)) - var(--tile-gap) + 14px)` } : undefined}
                  />
                )}
                </div>
              </div>

              <div className="w-full pt-4 pb-[max(8px,env(safe-area-inset-bottom))] md:mt-6 md:pt-0 md:pb-0 lg:mt-10">
                <GameKeyboard
                  statuses={game.keyStatuses}
                  pressedKey={pressedKey}
                  finished={finished}
                  canSubmit={game.current.length === WORD_LENGTH}
                  onLetter={addLetter}
                  onDelete={removeLetter}
                  onEnter={submit}
                />
              </div>

              <p className="mt-7 hidden type-mono text-ink-3 md:block">
                {'Type on your keyboard  ·  Enter to submit  ·  ⌫ to delete'}
              </p>
            </div>

            {/* Desktop: right column */}
            <aside aria-label="Your stats" className="hidden lg:flex lg:justify-end">
              <YourRun stats={stats} puzzle={puzzle} tip={tip} className="w-full max-w-[300px]" />
            </aside>

            {/* Tablet: side cards become a row under the keyboard */}
            <div className="mx-auto mt-8 hidden w-full max-w-[720px] grid-cols-2 gap-4 px-6 pb-10 md:grid lg:hidden">
              <section className="rounded-lg border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
                <Legend />
              </section>
              <YourRun stats={stats} puzzle={puzzle} tip={tip} />
            </div>
          </main>
        </div>

        {/* Live region and modal sit outside the inert root */}
        <p aria-live="polite" role="status" className="sr-only">{message}</p>

        {modal && toast && (
          <Toast toast={toast} className="fixed inset-x-0 top-4 md:top-auto md:bottom-[13px]" />
        )}

        <AnimatePresence>
          {modal && (
            <GameModal key={modal} label={MODAL_LABELS[modal]} onClose={() => setModal(null)}>
              {modal === 'results' && <ResultsPanel game={game} onShare={share} onPlayAgain={playAgain} />}
              {modal === 'stats' && <StatsPanel game={game} tip={tip} onShare={share} />}
              {modal === 'help' && <HowToPlay />}
              {modal === 'settings' && (
                <SettingsPanel settings={settings} reduceMotion={reduceMotion} onChange={changeSettings} />
              )}
            </GameModal>
          )}
        </AnimatePresence>
      </MotionConfig>
    </ReduceMotionContext.Provider>
  )
}
