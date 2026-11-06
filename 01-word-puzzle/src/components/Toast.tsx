import { AnimatePresence, motion } from 'framer-motion'
import error from '../assets/figma/dot-error.svg'
import info from '../assets/figma/dot-info.svg'
import success from '../assets/figma/dot-success.svg'
import { useReduceMotion } from '../useMotionPrefs'

export type ToastData = { id: number; kind: 'error' | 'info' | 'success'; message: string }

const dots = { error, info, success }

// Announced through the app's single aria-live region, not here.
export function Toast({ toast, className = '', style }: { toast: ToastData | null; className?: string; style?: React.CSSProperties }) {
  const reduce = useReduceMotion()
  return (
    <div className={`pointer-events-none z-[60] flex justify-center ${className}`} style={style}>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2.5 rounded-full bg-ink py-3 pr-5 pl-4 shadow-[var(--shadow-card)]"
          >
            <img src={dots[toast.kind]} alt="" width={8} height={8} />
            <span className="type-label-m whitespace-nowrap text-surface">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
