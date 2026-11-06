import backspace from '../assets/figma/icon-backspace.svg'
import close from '../assets/figma/icon-close.svg'
import flame from '../assets/figma/icon-flame.svg'
import help from '../assets/figma/icon-help.svg'
import refresh from '../assets/figma/icon-refresh.svg'
import settings from '../assets/figma/icon-settings.svg'
import share from '../assets/figma/icon-share.svg'
import stats from '../assets/figma/icon-stats.svg'

// Figma exports each glyph trimmed to its strokes, so it sits inside the 24px
// grid at these insets (glyph group, then stroke overhang), taken from the file.
const glyphs = {
  backspace: { src: backspace, group: '20.83% 12.5%', overhang: '-7.79% -6.06%' },
  close: { src: close, group: '25%', overhang: '-8.33%' },
  flame: { src: flame, group: '12.5% 20.83%', overhang: '-5.56% -7.14%' },
  help: { src: help, group: '12.5%', overhang: '-5.56%' },
  refresh: { src: refresh, group: '16.67% 16.67% 16.66% 16.67%', overhang: '-7.5%' },
  settings: { src: settings, group: '18.75% 16.67%', overhang: '-8% -7.5%' },
  share: { src: share, group: '12.5% 20.83%', overhang: '-6.67% -8.57%' },
  stats: { src: stats, group: '20.83% 20.83% 16.67% 20.83%', overhang: '-8% -8.57%' },
}

export type IconName = keyof typeof glyphs

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const { src, group, overhang } = glyphs[name]
  return (
    <span aria-hidden="true" className="relative block shrink-0" style={{ width: size, height: size }}>
      <span className="absolute" style={{ inset: group }}>
        <img src={src} alt="" className="absolute block size-full max-w-none" style={{ inset: overhang }} />
      </span>
    </span>
  )
}
