import { useEffect, useState } from 'react'
import { formatCountdown, msUntilNextPuzzle } from './game/daily.ts'

export function useCountdown() {
  const [value, setValue] = useState(() => formatCountdown(msUntilNextPuzzle(new Date())))
  useEffect(() => {
    const id = window.setInterval(() => setValue(formatCountdown(msUntilNextPuzzle(new Date()))), 1000)
    return () => window.clearInterval(id)
  }, [])
  return value
}
