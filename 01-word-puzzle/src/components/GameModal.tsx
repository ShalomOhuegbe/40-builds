import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { easeStandard } from '../game/motion'
import { useIsMobile, useReduceMotion } from '../useMotionPrefs'
import { Icon } from './Icon'

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

type Props = { label: string; onClose: () => void; children: ReactNode }

// Centred 480px modal on desktop and tablet, bottom sheet on mobile. Traps focus,
// closes on Esc or scrim click, and restores focus to what opened it.
export function GameModal({ label, onClose, children }: Props) {
  const mobile = useIsMobile()
  const reduce = useReduceMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const drag = useDragControls()
  // Read during first render, before focus moves or the background goes inert
  const [opener] = useState(() => document.activeElement as HTMLElement | null)

  useEffect(() => {
    const dialog = dialogRef.current
    const preferred = dialog?.querySelector<HTMLElement>('[data-autofocus]')
    ;(preferred ?? dialog?.querySelector<HTMLElement>(FOCUSABLE) ?? dialog)?.focus()
    return () => opener?.focus?.()
  }, [opener])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
    }
    if (event.key !== 'Tab' || !dialogRef.current) return
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const hidden = reduce ? { opacity: 0 } : mobile ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 16 }
  const shown = reduce ? { opacity: 1 } : mobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }
  const transition = reduce ? { duration: 0.15, ease: 'linear' as const } : { duration: 0.28, ease: easeStandard }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--scrim)]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        initial={hidden}
        animate={shown}
        exit={hidden}
        transition={transition}
        drag={mobile && !reduce ? 'y' : false}
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => info.offset.y > 96 && onClose()}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-y-auto rounded-t-[28px] border-t-2 border-ink bg-surface px-6 pt-3 pb-[max(34px,env(safe-area-inset-bottom))] shadow-[var(--shadow-modal)] outline-0 md:max-h-[calc(100dvh-32px)] md:w-[480px] md:rounded-xl md:border-2 md:px-10 md:pt-9 md:pb-7"
      >
        <div
          aria-hidden="true"
          onPointerDown={(event) => drag.start(event)}
          className="-my-2 mb-3 flex shrink-0 touch-none justify-center py-2 md:hidden"
        >
          <span className="h-[5px] w-10 rounded-[3px] bg-line" />
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-md opacity-0 focus-visible:opacity-100 md:top-[33px] md:right-[33px] md:opacity-100 md:hover:bg-surface-2"
        >
          <Icon name="close" size={22} />
        </button>
        {children}
      </motion.div>
    </div>
  )
}
