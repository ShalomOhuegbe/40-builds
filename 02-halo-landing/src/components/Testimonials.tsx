import { Fragment, useEffect, useRef, useState } from 'react'
import { testimonials } from '../content'
import { Eyebrow } from './Eyebrow'
import avatar from '../assets/figma/avatar.svg'

function Quote({ quote, name, role }: (typeof testimonials)[number]) {
  return (
    <figure className="flex flex-col gap-8">
      <blockquote className="type-heading-m text-ink">{quote}</blockquote>
      <figcaption className="flex items-center gap-3">
        <img src={avatar} alt="" width={40} height={40} />
        <span className="flex flex-col gap-0.5">
          <span className="type-label-m text-ink">{name}</span>
          <span className="type-body-s text-muted">{role}</span>
        </span>
      </figcaption>
    </figure>
  )
}

// Mobile + tablet: swipe carousel with scroll-snap and synced pagination.
function Carousel() {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const slides = Array.from(track.children) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(slides.indexOf(entry.target as HTMLElement))
        }
      },
      { root: track, threshold: 0.6 },
    )
    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [])

  const goTo = (index: number) => {
    const slide = trackRef.current?.children[index] as HTMLElement | undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Respects the track's scroll-padding, so the slide lands on the gutter
    slide?.scrollIntoView({ inline: 'start', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="flex flex-col gap-10 md:gap-14 lg:hidden">
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Testimonials, scroll horizontally"
        className="flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 [scrollbar-width:none] md:scroll-px-12 md:gap-6 md:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <li
            key={t.name}
            className="w-[302px] shrink-0 snap-start rounded-lg border border-line bg-raised p-6 md:w-[366px] md:p-8"
          >
            <Quote {...t} />
          </li>
        ))}
      </ul>
      <div className="flex gap-2 px-6 md:px-12">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Show testimonial ${i + 1} of ${testimonials.length}: ${t.name}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => goTo(i)}
            // 24px hit area that doesn't add to the 8px row height
            className="-my-2 grid h-6 place-items-center"
          >
            <span
              className={`block h-2 rounded-[4px] transition-[width,background-color] duration-300 ease-out ${i === active ? 'w-6 bg-ink' : 'w-2 bg-line'}`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="bg-canvas py-24 md:py-32 lg:py-40">
      <div className="shell flex flex-col gap-4 md:gap-6">
        <Eyebrow>In the studio</Eyebrow>
        <h2
          id="studio-title"
          className="type-display-s text-ink md:type-display-m lg:type-display-l lg:max-w-[900px] lg:text-[min(96px,6.667vw)]"
        >
          From people who <br />
          work late.
        </h2>
      </div>

      <div className="mt-10 md:mt-14 lg:mt-24">
        <Carousel />
        {/* Desktop: three equal columns separated by 1px rules */}
        <ul className="shell hidden lg:grid lg:grid-cols-[1fr_1px_1fr_1px_1fr] lg:gap-12">
          {testimonials.map((t, i) => (
            <Fragment key={t.name}>
              {i > 0 && <li aria-hidden="true" className="bg-line" />}
              <li>
                <Quote {...t} />
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  )
}
