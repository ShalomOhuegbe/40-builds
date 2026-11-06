// Lowercase Unbounded with a lime tile as the full stop: the cursor waiting for your guess.
export function Wordmark({ scale = 1 }: { scale?: number }) {
  const size = 26 * scale
  const tile = 10 * scale
  return (
    <span
      role="img"
      aria-label="krak"
      className="inline-flex items-end"
      style={{ gap: 3 * scale, paddingBottom: 2 * scale }}
    >
      <span
        aria-hidden="true"
        className="font-display font-semibold text-ink"
        style={{ fontSize: size, lineHeight: `${size}px`, letterSpacing: '-0.04em' }}
      >
        krak
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 border-ink bg-lime"
        style={{ width: tile, height: tile, borderWidth: 2 * scale, borderRadius: 2.5 * scale }}
      />
    </span>
  )
}
