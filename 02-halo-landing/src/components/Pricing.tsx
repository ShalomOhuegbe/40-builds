import { useEffect, useRef, useState } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import { plans, trustPoints, type PlanId } from '../content'
import { Button } from './Button'
import { Eyebrow } from './Eyebrow'
import checkLight from '../assets/figma/icon-check-light.svg'
import checkDark from '../assets/figma/icon-check-dark.svg'
import dash from '../assets/figma/icon-dash.svg'
import dot from '../assets/figma/dot-trust-4.svg'

type Status = { plan: PlanId; state: 'reserving' | 'reserved' } | null

type CardProps = {
  plan: (typeof plans)[number]
  selected: boolean
  status: Status
  onSelect: () => void
  onReserve: () => void
}

function PricingCard({ plan, selected, status, onSelect, onReserve }: CardProps) {
  const state = status?.plan === plan.id ? status.state : null

  return (
    // Whole card is a click target; the radio inside carries keyboard + AT semantics.
    <article
      onClick={onSelect}
      className={`relative flex cursor-pointer flex-col gap-8 rounded-lg border px-6 py-8 transition-[background-color,border-color,translate,box-shadow] duration-300 ease-out has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-ink md:p-8 lg:p-12 ${
        selected
          ? 'on-dark-surface border-line-dark bg-dark'
          : 'border-line bg-raised hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]'
      } ${plan.id === 'pro' ? 'max-md:order-first' : ''}`}
    >
      <div className="flex items-center justify-between gap-4">
        <input
          type="radio"
          name="plan"
          id={`plan-${plan.id}`}
          value={plan.id}
          checked={selected}
          onChange={onSelect}
          className="sr-only"
        />
        <label
          htmlFor={`plan-${plan.id}`}
          className={`cursor-pointer type-heading-m ${selected ? 'text-on-dark' : 'text-ink'}`}
        >
          {plan.name}
        </label>
        {plan.badge && (
          <span
            className={`rounded-pill px-3 py-1 type-caps text-ink transition-colors duration-300 ${selected ? 'bg-accent' : 'bg-sunken'}`}
          >
            {plan.badge}
          </span>
        )}
      </div>

      <p className="flex items-end gap-3">
        <span className={`type-numeric-l ${selected ? 'text-on-dark' : 'text-ink'}`}>{plan.price}</span>
        <span className={`type-body-s ${selected ? 'text-on-dark-muted' : 'text-muted'}`}>one-time, free shipping</span>
      </p>

      <p className={`type-body-m ${selected ? 'text-on-dark-muted' : 'text-muted'}`}>{plan.description}</p>

      <hr className={`border-0 border-t ${selected ? 'border-line-dark' : 'border-line'}`} />

      <ul className="flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-center gap-3">
            <img
              src={!feature.included ? dash : selected ? checkDark : checkLight}
              alt=""
              width={20}
              height={20}
              className="shrink-0"
            />
            <span
              className={`type-body-m ${
                !feature.included ? 'text-muted' : selected ? 'text-on-dark' : 'text-ink'
              }`}
            >
              <span className="sr-only">{feature.included ? 'Included: ' : 'Not included: '}</span>
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant={selected ? 'accent' : 'secondary'}
        icon={!state}
        disabled={state === 'reserving'}
        aria-describedby="pricing-status"
        onClick={(event) => {
          event.stopPropagation()
          onSelect()
          onReserve()
        }}
        className="mt-auto w-full"
      >
        {state === 'reserving' && <LoaderCircle aria-hidden="true" size={18} className="animate-spin" />}
        {state === 'reserved' && <Check aria-hidden="true" size={18} />}
        {state === 'reserving' ? 'Reserving…' : state === 'reserved' ? `${plan.name} reserved` : plan.cta}
      </Button>
    </article>
  )
}

export function Pricing({ selected, onSelect }: { selected: PlanId; onSelect: (plan: PlanId) => void }) {
  const [status, setStatus] = useState<Status>(null)
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // No payment flow exists for this design study, so the reservation is simulated.
  const reserve = (plan: PlanId) => {
    window.clearTimeout(timer.current)
    setStatus({ plan, state: 'reserving' })
    timer.current = window.setTimeout(() => setStatus({ plan, state: 'reserved' }), 900)
  }

  const reservedPlan = status?.state === 'reserved' ? plans.find((p) => p.id === status.plan) : undefined

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="border-t border-line bg-canvas py-24 md:border-t-0 md:py-32 lg:py-40"
    >
      <div className="shell flex flex-col items-center gap-10 md:gap-14 lg:gap-16">
        <header className="flex flex-col items-center gap-4 text-center md:gap-6">
          <Eyebrow>Pricing</Eyebrow>
          <h2
            id="pricing-title"
            className="type-display-s text-ink md:type-display-m lg:type-display-l lg:text-[min(96px,6.667vw)]"
          >
            Choose your HALO.
          </h2>
          <p className="type-body-m text-muted md:type-body-l">
            One-time price. No subscription.{' '}
            <span className="lg:hidden">Pay when it ships.</span>
            <span className="hidden lg:inline">Pre-order today, pay when your lamp ships.</span>
          </p>
        </header>

        <fieldset className="w-full lg:max-w-[1064px]">
          <legend className="sr-only">Choose a plan</legend>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start lg:gap-6">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                selected={selected === plan.id}
                status={status}
                onSelect={() => onSelect(plan.id)}
                onReserve={() => reserve(plan.id)}
              />
            ))}
          </div>
        </fieldset>

        <div className="relative">
          <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 type-body-s text-muted lg:gap-8">
            {trustPoints.map((point, i) => (
              <li key={point} className="flex items-center gap-2 lg:gap-8">
                {i > 0 && (
                  <>
                    <span aria-hidden="true" className="lg:hidden">·</span>
                    <img src={dot} alt="" width={4} height={4} className="hidden lg:block" />
                  </>
                )}
                {point}
              </li>
            ))}
          </ul>
          {/* Sits in the section's bottom padding so the layout matches Figma */}
          <p
            id="pricing-status"
            role="status"
            className="absolute inset-x-0 top-full mx-auto mt-4 w-[min(342px,calc(100vw-48px))] text-center type-body-s text-ink md:w-max"
          >
            {reservedPlan && `${reservedPlan.name} reserved. This is a design study, so no payment was taken.`}
          </p>
        </div>
      </div>
    </section>
  )
}
