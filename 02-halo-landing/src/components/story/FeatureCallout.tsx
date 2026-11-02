import { motion, useReducedMotion } from 'framer-motion'

type Props = {
  active: boolean
  number: string
  title: string
  body: string
  short: string
}

// Figma "Feature callout": when active, the amber rule draws left → right
// (300ms) and the content fades 45% → 100%.
export function FeatureCallout({ active, number, title, body, short }: Props) {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <article aria-current={active ? 'step' : undefined} className="relative pt-6 lg:max-w-[340px]">
      <span className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent"
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={transition}
      />
      <motion.div
        className="flex flex-col gap-4"
        initial={false}
        animate={{ opacity: active ? 1 : 0.45 }}
        transition={transition}
      >
        <p className={`type-caps transition-colors duration-300 ${active ? 'text-accent' : 'text-muted'}`}>
          {number}
        </p>
        <h3 className="type-heading-l text-ink">{title}</h3>
        <p className="type-body-m text-muted">
          <span className="lg:hidden">{short}</span>
          <span className="hidden lg:inline">{body}</span>
        </p>
      </motion.div>
    </article>
  )
}
