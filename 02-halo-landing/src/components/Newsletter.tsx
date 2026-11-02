import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import { Button } from './Button'

type State = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // There is no mailing-list backend for this design study; submission is simulated.
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setState('error')
      return
    }
    setState('submitting')
    timer.current = window.setTimeout(() => setState('success'), 900)
  }

  return (
    <div className="flex flex-col gap-3 md:w-[312px] lg:w-[440px] lg:gap-4">
      <h2 className="type-heading-s text-on-dark">Get launch updates</h2>
      <p className="type-body-s text-on-dark-muted lg:max-w-[420px]">
        Shipping news and the occasional note on light and focus.<span className="hidden lg:inline"> No spam.</span>
      </p>

      {state === 'success' ? (
        <p role="status" className="flex items-center gap-2 py-4 type-body-m text-on-dark">
          <CircleCheck aria-hidden="true" size={20} className="shrink-0 text-accent" />
          You’re on the list. We’ll write when HALO ships.
        </p>
      ) : (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-2 lg:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (state === 'error') setState('idle')
            }}
            aria-invalid={state === 'error'}
            aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
            className={`min-w-0 flex-1 rounded-pill border bg-transparent px-6 py-4 type-body-m text-on-dark placeholder:text-on-dark-muted ${state === 'error' ? 'border-[#f2a08f]' : 'border-line-dark'}`}
          />
          <Button type="submit" variant="accent" disabled={state === 'submitting'} className="w-full lg:w-auto">
            {state === 'submitting' && <LoaderCircle aria-hidden="true" size={18} className="animate-spin" />}
            {state === 'submitting' ? 'Subscribing…' : 'Subscribe'}
          </Button>
        </form>
      )}

      {state === 'error' && (
        <p id="newsletter-error" role="alert" className="flex items-center gap-2 type-body-s text-[#f2a08f]">
          <CircleAlert aria-hidden="true" size={16} className="shrink-0" />
          Enter an email address like name@example.com.
        </p>
      )}
    </div>
  )
}
