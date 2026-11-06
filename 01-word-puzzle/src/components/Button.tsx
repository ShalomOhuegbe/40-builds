import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost'

// Primary carries the signature hard shadow: 4px, lifts to 6px on hover, collapses
// to 0 on press while the button shifts into where the shadow was.
const variants: Record<Variant, string> = {
  primary:
    'border-2 border-ink bg-lime shadow-[var(--shadow-hard)] hover:shadow-[var(--shadow-hard-hover)] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-0 focus-visible:shadow-[0_0_0_3px_var(--brand-cobalt),var(--shadow-hard)] disabled:border-line disabled:bg-surface-2 disabled:text-ink-3 disabled:shadow-none',
  secondary: 'border-2 border-ink bg-surface hover:bg-lime-tint active:bg-surface-2 disabled:opacity-40',
  ghost: 'hover:bg-surface-2 disabled:opacity-40',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: IconName
  children: ReactNode
}

export function Button({ variant = 'primary', icon, children, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex h-[52px] items-center justify-center gap-2.5 rounded-md px-6 type-button whitespace-nowrap text-ink transition-[background-color,box-shadow,translate] duration-[120ms] ease-[var(--ease-standard)] disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}
