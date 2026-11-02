import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { navLinks } from '../content'
import { Button } from './Button'
import { Logo } from './Logo'
import menuIcon from '../assets/figma/icon-menu.svg'

// Swaps to Navigation / State=Scrolled once the hero has left the viewport.
function useScrolledPastHero() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: '-96px 0px 0px 0px',
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])
  return scrolled
}

const transition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }

export function Nav() {
  const scrolled = useScrolledPastHero()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    firstLinkRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Tablet + desktop: floating pill, 24px from the top → pinned 16px once scrolled */}
      <motion.nav
        aria-label="Main"
        className="pointer-events-auto hidden justify-center px-6 md:flex lg:px-16"
        initial={false}
        animate={{ y: scrolled ? 16 : 24 }}
        transition={transition}
      >
        <div
          className={`flex w-full max-w-[960px] items-center justify-between rounded-pill border border-line py-2 pr-2 pl-6 transition-[background-color,box-shadow,backdrop-filter] duration-200 ease-out ${
            scrolled
              ? 'bg-canvas/80 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)] backdrop-blur-[24px]'
              : 'bg-canvas shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] backdrop-blur-[12px]'
          }`}
        >
          <Logo />
          <ul className="flex gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative type-body-m text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="#pricing">Pre-order</Button>
        </div>
      </motion.nav>

      {/* Mobile: pill bar at the top → full-width white bar once scrolled */}
      <nav
        aria-label="Main"
        className={`pointer-events-auto transition-[padding] duration-200 ease-out md:hidden ${scrolled ? 'p-0' : 'px-4 pt-5 pb-3'}`}
      >
        <div
          className={`flex items-center justify-between py-2 pr-2 transition-[background-color,border-radius,padding] duration-200 ease-out ${
            scrolled
              ? 'border-b border-line bg-raised/95 py-4 pr-6 pl-6 backdrop-blur-[10px]'
              : 'rounded-pill border border-line bg-canvas pl-5'
          }`}
        >
          <Logo />
          <div className="flex items-center gap-4">
            <Button href="#pricing">Pre-order</Button>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-10 place-items-center rounded-pill"
            >
              {menuOpen ? (
                <X aria-hidden="true" size={24} strokeWidth={1.6} />
              ) : (
                <img src={menuIcon} alt="" width={24} height={24} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={transition}
              className={`rounded-lg border border-line bg-canvas p-2 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.25)] ${scrolled ? 'mx-4 mt-2' : 'mt-2'}`}
            >
              <ul>
                {navLinks.map((link, i) => (
                  <li key={link.href} className="border-b border-line last:border-b-0">
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-md px-4 py-4 type-heading-m text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
