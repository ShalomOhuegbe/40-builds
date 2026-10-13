import { motion } from 'framer-motion'
import { Hammer } from 'lucide-react'

// Placeholder screen — replace with the real build.
export default function App() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-[var(--space-gutter)] py-12">
      <motion.p
        className="font-mono text-sm uppercase tracking-[var(--tracking-wide)] text-muted"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        Build 01 / 40
      </motion.p>
      <h1 className="font-display text-[length:var(--text-display)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]">
        Word Puzzle
      </h1>
      <p className="flex items-center gap-2 text-muted">
        <Hammer aria-hidden="true" size={18} />
        Scaffolded and ready to design.
      </p>
    </main>
  )
}
