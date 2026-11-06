// Timings from the Figma motion table. Reduced motion swaps flips, shakes and
// hops for 150ms crossfades, so reveals stay sequential but nothing moves.
export const timings = (reduce: boolean) =>
  reduce
    ? { tile: 150, stagger: 120, edge: 0, hop: 0, hopStagger: 0, resultsAfterWin: 400, resultsAfterLoss: 400 }
    : { tile: 450, stagger: 250, edge: 225, hop: 300, hopStagger: 100, resultsAfterWin: 900, resultsAfterLoss: 600 }

export const easePop = [0.34, 1.56, 0.64, 1] as const
export const easeStandard = [0.2, 0.8, 0.2, 1] as const
