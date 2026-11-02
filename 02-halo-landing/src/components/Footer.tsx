import { footerColumns, type PlanId } from '../content'
import { Logo } from './Logo'
import { Newsletter } from './Newsletter'

export function Footer({ onSelectPlan }: { onSelectPlan: (plan: PlanId) => void }) {
  return (
    <footer className="on-dark-surface bg-dark pt-16 pb-8 md:pt-24 md:pb-8 lg:pt-32 lg:pb-12">
      <div className="shell flex flex-col gap-12 md:gap-16 lg:gap-24">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="flex flex-col gap-6 md:w-[312px] md:gap-6 lg:w-[520px] lg:gap-8">
            <Logo tone="dark" />
            <p className="font-display text-[36px] leading-[1.04] font-medium tracking-[-0.025em] text-on-dark md:type-display-s">
              Light that <br className="hidden lg:block" />
              works with you.
            </p>
          </div>
          <Newsletter />
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-6 lg:flex lg:gap-24">
          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h2 className="type-caps text-on-dark-muted">{column.title}</h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label} className={link.desktopOnly ? 'hidden lg:block' : undefined}>
                    <a
                      href={link.href}
                      onClick={link.plan ? () => onSelectPlan(link.plan!) : undefined}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="type-body-m whitespace-nowrap text-on-dark transition-colors duration-200 hover:text-accent"
                    >
                      {link.label}
                      {link.external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-2 border-t border-line-dark pt-6 type-body-s text-on-dark-muted md:flex-row md:justify-between">
          <p>
            © 2026 HALO Lighting Ltd. A fictional product<span className="md:hidden lg:inline"> for a design study</span>.
          </p>
          <p>Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  )
}
