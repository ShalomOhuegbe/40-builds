import mark from '../assets/figma/logo-mark.svg'
import markDark from '../assets/figma/logo-mark-dark.svg'

export function Logo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <a
      href="#top"
      aria-label="HALO, back to top"
      className="inline-flex shrink-0 items-center gap-[10px] rounded-sm"
    >
      <img src={tone === 'dark' ? markDark : mark} alt="" width={22} height={22} />
      <span
        aria-hidden="true"
        className={`font-display text-[24px] leading-[1.2] font-medium tracking-[0.14em] ${tone === 'dark' ? 'text-on-dark' : 'text-ink'}`}
      >
        HALO
      </span>
    </a>
  )
}
