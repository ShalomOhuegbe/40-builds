import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import arrowLight from '../assets/figma/arrow-right-16.svg'
import arrowDark from '../assets/figma/arrow-right-18.svg'

// Figma "Button": Primary (M) · Accent / Secondary / On dark (L)
type Variant = 'primary' | 'accent' | 'secondary' | 'on-dark'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-on-dark px-4 py-3 hover:bg-[color-mix(in_srgb,var(--color-text-primary),black_6%)]',
  accent:
    'bg-accent text-ink px-6 py-4 hover:bg-[color-mix(in_srgb,var(--color-accent-default),black_6%)]',
  secondary: 'border border-line text-ink px-6 py-4 hover:bg-ink/[0.06]',
  'on-dark': 'border border-line-dark text-on-dark px-6 py-4 hover:bg-on-dark/[0.06]',
}

type Props = {
  variant?: Variant
  icon?: boolean
  children: ReactNode
  className?: string
} & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children'>)
  | ({ href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>)
)

export function Button({ variant = 'primary', icon = false, children, className = '', ...rest }: Props) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-pill type-label-m whitespace-nowrap transition-colors duration-200 ease-out disabled:cursor-progress ${variants[variant]} ${className}`

  const content = (
    <>
      {children}
      {icon && (
        <img
          src={variant === 'primary' ? arrowLight : arrowDark}
          alt=""
          width={variant === 'primary' ? 16 : 18}
          height={variant === 'primary' ? 16 : 18}
          className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-[3px]"
        />
      )}
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {content}
    </button>
  )
}
