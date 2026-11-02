import { Eyebrow } from './Eyebrow'
import { FocusSessionCard } from './FocusSessionCard'
import { Lamp } from './Lamp'
import glow from '../assets/figma/focus-glow.svg'

// Container-query units keep the lamp's contact line on the desk at any width.
// Geometry from the 342×380 / 308×718 / 620×1071 Figma frames.
function ProductImage() {
  return (
    <div className="on-dark-surface relative h-[380px] overflow-hidden rounded-lg bg-dark [container-type:inline-size] md:col-start-1 md:row-start-2 md:h-auto lg:row-span-2 lg:row-start-1 lg:aspect-[620/1071] lg:self-center">
      <div className="absolute inset-x-0 top-0 hidden h-[79.46%] bg-linear-to-r from-[#292a29] to-[#171918] lg:block" />
      <img
        src={glow}
        alt=""
        className="absolute top-[5px] left-[25%] h-[304px] w-full max-w-none md:top-[23.3%] md:left-0 md:h-[70%] md:w-[120%] lg:top-[30.9%] lg:left-[9.68%] lg:h-[46.69%] lg:w-[112.9%]"
      />
      <div className="absolute inset-x-0 bottom-0 h-[90px] bg-linear-to-b from-[#383836] to-[#141614] md:h-[120px] lg:h-[20.54%]" />
      <Lamp
        temperature="cool"
        className="bottom-[calc(90px-102.9cqw*0.05625)] left-[-5.85%] w-[102.9cqw] md:bottom-[calc(120px-128.8cqw*0.05625)] md:left-[-9.74%] md:w-[128.8cqw] lg:bottom-[calc(20.54%-103.2cqw*0.05625)] lg:left-[-6.45%] lg:w-[103.2cqw]"
      />
      <p className="absolute bottom-[42px] left-8 hidden type-caps text-on-dark-muted lg:block">
        HALO Pro · Anodised aluminium
      </p>
    </div>
  )
}

export function FocusMode() {
  return (
    <section id="focus-mode" aria-labelledby="focus-title" className="bg-canvas pb-24 md:pb-32 lg:pt-16 lg:pb-40">
      {/* Mobile: image → copy → card · Tablet: copy, then image | card · Desktop: image | copy + card */}
      <div className="shell grid gap-8 md:grid-cols-[minmax(0,1fr)_340px] md:gap-x-6 md:gap-y-12 lg:grid-cols-[minmax(0,620fr)_minmax(0,532fr)] lg:gap-x-24 lg:gap-y-8">
        <ProductImage />

        <div className="flex flex-col gap-4 md:col-span-2 md:row-start-1 md:gap-6 lg:col-span-1 lg:col-start-2 lg:gap-8 lg:self-end">
          <Eyebrow>Focus Mode</Eyebrow>
          <h2 id="focus-title" className="type-display-s text-ink md:type-display-m lg:max-w-[520px]">
            Made for <br className="hidden lg:block" />
            deep work.
          </h2>
          <p className="type-body-m text-muted md:max-w-[560px] md:type-body-l lg:max-w-[520px]">
            Start a 45-minute session from the touch strip or your phone. HALO raises colour temperature for
            alertness,<span className="hidden lg:inline"> holds it steady while you work,</span> then eases into
            warm light for the last five minutes.
          </p>
        </div>

        <FocusSessionCard className="md:col-start-2 md:row-start-2 lg:w-full lg:max-w-[460px] lg:self-start" />
      </div>
    </section>
  )
}
