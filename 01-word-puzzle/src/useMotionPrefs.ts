import { createContext, useContext, useEffect, useState } from 'react'

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

export function useSystemReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCE_QUERY).matches)
  useEffect(() => {
    const media = window.matchMedia(REDUCE_QUERY)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function useIsMobile() {
  const query = '(max-width: 47.99rem)'
  const [mobile, setMobile] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMobile(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return mobile
}

// The effective preference: the Settings choice if made, otherwise the OS setting
export const ReduceMotionContext = createContext(false)
export const useReduceMotion = () => useContext(ReduceMotionContext)
