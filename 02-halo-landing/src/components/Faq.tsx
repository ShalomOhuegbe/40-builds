import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { faqs } from '../content'
import { Eyebrow } from './Eyebrow'
import plus from '../assets/figma/icon-plus.svg'
import minus from '../assets/figma/icon-minus.svg'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0, 0, 0.2, 1] as const }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-t border-line bg-canvas py-24 md:py-32 lg:pt-24 lg:pb-40"
    >
      <div className="shell flex flex-col gap-8 md:gap-12 lg:flex-row lg:items-start lg:gap-24">
        <div className="flex flex-col gap-4 md:gap-6 lg:w-[400px] lg:shrink-0">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-title" className="type-display-s text-ink md:type-display-m">
            Questions, <br className="hidden lg:block" />
            answered.
          </h2>
          <p className="hidden type-body-m text-muted lg:block lg:max-w-[340px]">
            Still curious? Write to{' '}
            <a href="mailto:hello@halo.light" className="text-ink underline underline-offset-4">
              hello@halo.light
            </a>{' '}
            and a person will reply within a day.
          </p>
        </div>

        <div className="border-t border-line lg:flex-1">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={faq.question} className="border-b border-line py-6 md:py-8">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    // Negative margin extends the hit area over the row padding without adding height
                    className="-my-6 flex w-full items-center justify-between gap-6 py-6 text-left type-heading-m text-ink md:-my-8 md:py-8"
                  >
                    {faq.question}
                    {/* Plus rotates into the minus */}
                    <span className="relative size-6 shrink-0" aria-hidden="true">
                      <motion.img
                        src={plus}
                        alt=""
                        className="absolute inset-0"
                        initial={false}
                        animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                        transition={transition}
                      />
                      <motion.img
                        src={minus}
                        alt=""
                        className="absolute inset-0"
                        initial={false}
                        animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0 }}
                        transition={transition}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={transition}
                      className="overflow-hidden"
                    >
                      {/* 16px question → answer gap lives inside the animated area */}
                      <p className="pt-4 type-body-l text-muted lg:max-w-[640px]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
