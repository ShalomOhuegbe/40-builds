import ring from '../assets/figma/timer-ring.svg'
import thermo from '../assets/figma/icon-thermo.svg'
import sun from '../assets/figma/icon-sun.svg'
import dot from '../assets/figma/dot-amber-8.svg'
import nextDot from '../assets/figma/dot-amber-6.svg'

// Fills read from the Figma meters: 91/158, 113/158, phase "done" widths.
const stats = [
  { icon: thermo, label: 'Colour temperature', short: 'Temperature', value: '5200K', fill: '57.6%' },
  { icon: sun, label: 'Brightness', short: 'Brightness', value: '72%', fill: '71.5%' },
]

const phases = [
  { label: 'Warm-up', flex: 5, done: '100%', reached: true },
  { label: 'Deep focus', flex: 35, done: '77.7%', reached: true },
  { label: 'Wind-down', flex: 5, done: '0%', reached: false },
]

export function FocusSessionCard({ className = '' }: { className?: string }) {
  return (
    <figure
      aria-label="HALO app: focus session in progress"
      className={`on-dark-surface flex flex-col gap-8 rounded-lg border border-line-dark bg-dark-raised px-6 py-8 drop-shadow-[0_40px_40px_rgba(0,0,0,0.35)] md:py-6 lg:p-8 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="type-caps text-on-dark-muted">Focus session</p>
          <p className="type-heading-s text-on-dark">Deep work · Desk</p>
        </div>
        <p className="flex items-center gap-2 rounded-pill border border-line-dark bg-dark px-3 py-1">
          <img src={dot} alt="" width={8} height={8} className="motion-safe:animate-[live-pulse_2s_ease-in-out_infinite]" />
          <span className="type-label-m text-on-dark">Live</span>
        </p>
      </div>

      <div className="relative mx-auto grid size-60 place-items-center">
        <img src={ring} alt="" width={240} height={240} className="absolute inset-0" />
        <p className="relative flex flex-col items-center gap-1.5">
          <span className="type-numeric-l text-on-dark tabular-nums">12:46</span>
          <span className="type-body-s text-on-dark-muted">left of 45:00</span>
        </p>
      </div>

      <dl className="flex gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-md bg-dark p-4">
            <dt className="flex items-center gap-2 type-body-s text-on-dark-muted">
              <img src={stat.icon} alt="" width={16} height={16} />
              {/* Full label only once the card reaches its 460px desktop width */}
              <span className="xl:hidden">{stat.short}</span>
              <span className="hidden xl:inline">{stat.label}</span>
            </dt>
            {/* As in Figma the value may run into the tile's right padding (tile clips).
                40px at the 390 frame, easing to ~36px at 360 so it stays inside the tile. */}
            <dd className="type-numeric-m whitespace-nowrap text-on-dark max-md:text-[min(40px,calc(40px-(390px-100vw)*0.17))]">
              {stat.value}
            </dd>
            <dd className="h-1 overflow-hidden rounded-[2px] bg-line-dark" aria-hidden="true">
              <div className="h-full bg-accent" style={{ width: stat.fill }} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="type-body-s text-on-dark-muted">Session progress</p>
          <p className="type-label-m text-on-dark">72%</p>
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          {phases.map((phase) => (
            <div
              key={phase.label}
              className="h-1.5 min-w-px overflow-hidden rounded-[3px] bg-line-dark"
              style={{ flex: `${phase.flex} 0 0` }}
            >
              <div className="h-full bg-accent" style={{ width: phase.done }} />
            </div>
          ))}
        </div>
        <ol className="flex justify-between type-body-s">
          {phases.map((phase) => (
            <li key={phase.label} className={phase.reached ? 'text-on-dark' : 'text-on-dark-muted'}>
              {phase.label}
            </li>
          ))}
        </ol>
      </div>

      <figcaption className="flex items-center gap-2 rounded-md bg-dark px-4 py-3 type-body-s text-on-dark">
        <img src={nextDot} alt="" width={6} height={6} />
        Wind-down in 7 min · light warms to 3000K
      </figcaption>
    </figure>
  )
}
