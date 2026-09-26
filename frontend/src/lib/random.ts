/**
 * Deterministic pseudo-random value in [0, 1) for a given seed.
 * Used instead of Math.random() for one-time scene generation so the
 * generators stay pure (safe to call from useMemo/render).
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
