import { dimensions, specs } from '../content'
import { Eyebrow } from './Eyebrow'

export function Specs() {
  return (
    <section id="technology" aria-labelledby="specs-title" className="bg-sunken py-24 md:py-32 lg:py-40">
      <div className="shell flex flex-col gap-12 md:gap-16 lg:gap-24">
        <header className="flex flex-col gap-12 md:gap-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 md:gap-6">
            <Eyebrow>Specifications</Eyebrow>
            <h2
              id="specs-title"
              className="type-display-s text-ink md:type-display-m lg:type-display-l lg:max-w-[760px] lg:text-[min(96px,6.667vw)]"
            >
              Engineered <br />
              to disappear.
            </h2>
          </div>

          {/* Mobile 2×2, tablet 4-up, desktop: ruled list */}
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8 lg:flex lg:w-[280px] lg:flex-col lg:gap-2">
            {dimensions.map((d) => (
              <div
                key={d.label}
                className="flex flex-col gap-1 lg:flex-row lg:items-start lg:justify-between lg:border-b lg:border-line lg:pb-[10px]"
              >
                <dt className="type-body-s text-muted lg:type-body-m">{d.label}</dt>
                <dd className="type-heading-m text-ink lg:type-label-m">{d.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <ol className="grid md:grid-cols-2 md:gap-x-8 md:gap-y-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-4">
          {specs.map((spec, i) => (
            <li key={spec.title} className="flex flex-col gap-3 border-t border-line pt-6 pb-8">
              <p className="type-caps text-muted" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="type-heading-m text-ink">{spec.title}</h3>
              <p className="type-body-s text-muted">{spec.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
