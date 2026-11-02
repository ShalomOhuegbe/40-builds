import { specTicker } from '../content'
import dot from '../assets/figma/dot-ticker-4.svg'

export function SpecTicker() {
  // The 390/768 frames drop the last item from the marquee.
  const marqueeItems = specTicker.slice(0, 5)

  return (
    <>
      {/* Desktop: static row, items separated by amber dots */}
      <ul aria-label="Key specifications" className="hidden items-center justify-between lg:flex">
        {specTicker.map((item, i) => (
          <li key={item} className="contents">
            <span className="type-caps whitespace-nowrap text-on-dark-muted">{item}</span>
            {i < specTicker.length - 1 && <img src={dot} alt="" width={4} height={4} />}
          </li>
        ))}
      </ul>

      {/* Mobile + tablet: marquee. Reduced motion leaves it as a swipeable row. */}
      <div className="overflow-x-auto [scrollbar-width:none] motion-safe:overflow-hidden lg:hidden">
        <ul aria-label="Key specifications" className="sr-only">
          {marqueeItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <ul
          aria-hidden="true"
          className="flex w-max motion-safe:animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]"
        >
          {[0, 1].map((copy) => (
            <li key={copy} className="flex shrink-0 items-center gap-8 pr-8">
              {marqueeItems.map((item) => (
                <span key={item} className="flex items-center gap-8">
                  <span className="type-caps whitespace-nowrap text-on-dark-muted">{item}</span>
                  <img src={dot} alt="" width={4} height={4} />
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
