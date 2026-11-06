import type { Settings } from '../game/types'

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6 border-t border-line py-4 first:border-t-0">
      <span className="flex flex-col gap-1">
        <span className="type-label-m text-ink">{label}</span>
        <span className="type-label-s text-ink-3">{hint}</span>
      </span>
      <span className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer absolute inset-0 size-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden="true"
          className="block h-7 w-12 rounded-full border-2 border-ink bg-surface transition-colors duration-[120ms] peer-checked:bg-lime peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[5px] left-[5px] size-[18px] rounded-full bg-ink transition-[translate] duration-[120ms] peer-checked:translate-x-5"
        />
      </span>
    </label>
  )
}

type Props = {
  settings: Settings
  reduceMotion: boolean
  onChange: (settings: Settings) => void
}

export function SettingsPanel({ settings, reduceMotion, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="type-display-m text-ink md:pr-10">Settings</h2>
      <div className="flex flex-col">
        <Toggle
          label="High contrast"
          hint="Wrong-spot letters turn orange with dark text, and tile borders thicken to 3px."
          checked={settings.highContrast}
          onChange={(highContrast) => onChange({ ...settings, highContrast })}
        />
        <Toggle
          label="Reduce motion"
          hint="Swaps flips, shakes and hops for quick crossfades. Starts from your device setting."
          checked={reduceMotion}
          onChange={(value) => onChange({ ...settings, reduceMotion: value })}
        />
      </div>
    </div>
  )
}
