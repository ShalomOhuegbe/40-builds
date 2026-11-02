import type { ReactNode } from 'react'

// Amber Label/Caps line that opens every section.
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`type-caps text-accent ${className}`}>{children}</p>
}
