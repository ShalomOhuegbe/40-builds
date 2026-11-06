import dot from '../assets/figma/dot-daily.svg'

export function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border-[1.5px] border-ink bg-lime px-3 py-1.5">
      <img src={dot} alt="" width={6} height={6} />
      <span className="type-mono text-ink">{text}</span>
    </span>
  )
}
