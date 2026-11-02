import { motion, useTransform, type MotionValue } from 'framer-motion'
import { storyStates } from '../../content'
import { CrossfadeLamp } from '../Lamp'
import { TemperatureScale } from './TemperatureScale'
import coolGlow from '../../assets/figma/stage-glow.svg'
import warmGlow from '../../assets/figma/hero-glow.svg'

// Piecewise so the readout agrees with the scale: 4000K sits at its centre.
const KELVIN_STOPS = storyStates.map((s) => s.kelvin) // 6500 → 4000 → 2700

// Figma "Stage (sticky)". Positions are percentages of the 342×420 / 672×560 /
// 808×720 frames so the stage can shrink on short viewports without drifting.
export function Stage({ progress, activeIndex }: { progress: MotionValue<number>; activeIndex: number }) {
  const state = storyStates[activeIndex]
  const kelvinValue = useTransform(progress, [0, 0.5, 1], KELVIN_STOPS)
  const kelvin = useTransform(kelvinValue, (k) => `${Math.round(k / 10) * 10}K`)
  const coolOpacity = useTransform(progress, [0, 1], [1, 0])
  const warmOpacity = useTransform(progress, [0, 1], [0, 0.8])

  return (
    <div
      role="img"
      aria-label={`HALO lit at ${state.kelvin}K in ${state.title}, ${state.brightness}% brightness`}
      className="on-dark-surface relative aspect-[342/420] w-full overflow-hidden rounded-lg bg-dark md:aspect-[672/560] md:w-[min(100%,calc((100svh-392px)*1.2))] lg:aspect-[808/720] lg:w-[min(808px,calc((100svh-128px)*1.1222),100%)] lg:shrink-0"
    >
      {/* Ambient glow: cool fades out as warm fades in */}
      <div className="absolute top-[-20%] left-[20%] h-full w-[120%] lg:top-[-19.44%] lg:left-[27.23%] lg:h-[88.89%] lg:w-[99.01%]">
        <motion.img src={coolGlow} alt="" style={{ opacity: coolOpacity }} className="absolute inset-0 size-full" />
        <motion.img src={warmGlow} alt="" style={{ opacity: warmOpacity }} className="absolute inset-0 size-full" />
      </div>

      <div className="absolute inset-x-0 top-[80.95%] bottom-0 bg-linear-to-b from-[#333330] to-[#171918] md:top-[82.14%] lg:top-[80.56%]" />

      <CrossfadeLamp
        temperature={state.temperature}
        className="top-[9.05%] left-[21.05%] w-[93.57%] md:top-[4.49%] md:left-[34.4%] md:w-[68.57%] lg:top-[5.06%] lg:left-[29.95%] lg:w-[71.29%]"
      />

      <TemperatureScale
        progress={progress}
        activeIndex={activeIndex}
        className="top-6 left-6 w-[calc(100%-48px)] md:top-8 md:left-8 md:w-[320px] lg:top-10 lg:left-12 lg:w-[480px]"
      />

      <div className="absolute top-24 left-6 flex flex-col gap-1 md:top-[110px] md:left-8 lg:top-32 lg:left-12">
        <motion.p className="type-numeric-m text-on-dark tabular-nums md:type-numeric-l">{kelvin}</motion.p>
        <p className="type-body-s text-on-dark-muted" aria-live="polite">
          {state.title} · {state.brightness}%<span className="hidden md:inline"> brightness</span>
        </p>
      </div>
    </div>
  )
}
