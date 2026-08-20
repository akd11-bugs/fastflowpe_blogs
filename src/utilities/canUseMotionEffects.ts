/**
 * Shared capability gate for decorative client-side motion (WebGL shaders,
 * the custom cursor, hover effects). Used by src/providers/Cursor,
 * src/heros/HighImpact/HeroCanvas, and src/components/webgl/HoverWiggle so
 * all three agree on the same rules instead of drifting independently.
 *
 * `navigator.hardwareConcurrency`/`deviceMemory` are deliberately checked
 * with a conservative threshold (<= 2) — this is meant to exclude genuinely
 * low-spec/old hardware, not ordinary business laptops. Both APIs default to
 * "allow" when unavailable (deviceMemory is Chromium-only; Safari/Firefox
 * never report it), matching this codebase's existing safe-by-default style.
 */
export const canUseMotionEffects = (): boolean => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  if (prefersReducedMotion || isCoarsePointer) return false

  const cores = (navigator as { hardwareConcurrency?: number }).hardwareConcurrency
  if (typeof cores === 'number' && cores <= 2) return false

  const memory = (navigator as { deviceMemory?: number }).deviceMemory
  if (typeof memory === 'number' && memory <= 2) return false

  return true
}
