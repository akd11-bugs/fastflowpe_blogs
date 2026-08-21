const PALETTE = [
  {
    bg: 'bg-blue-100 dark:bg-blue-500/20',
    text: 'text-blue-700 dark:text-blue-300',
    solidBg: 'bg-blue-600',
    solidText: 'text-white',
    accentBorder: 'hover:border-blue-600',
    vibrantBg: 'bg-blue-300 dark:bg-blue-500/35',
    vibrantText: 'text-blue-950 dark:text-blue-50',
  },
  {
    bg: 'bg-purple-100 dark:bg-purple-500/20',
    text: 'text-purple-700 dark:text-purple-300',
    solidBg: 'bg-purple-600',
    solidText: 'text-white',
    accentBorder: 'hover:border-purple-600',
    vibrantBg: 'bg-purple-300 dark:bg-purple-500/35',
    vibrantText: 'text-purple-950 dark:text-purple-50',
  },
  {
    bg: 'bg-rose-100 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-300',
    solidBg: 'bg-rose-600',
    solidText: 'text-white',
    accentBorder: 'hover:border-rose-600',
    vibrantBg: 'bg-rose-300 dark:bg-rose-500/35',
    vibrantText: 'text-rose-950 dark:text-rose-50',
  },
  {
    bg: 'bg-amber-100 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-300',
    solidBg: 'bg-amber-500',
    solidText: 'text-black',
    accentBorder: 'hover:border-amber-500',
    vibrantBg: 'bg-amber-300 dark:bg-amber-500/35',
    vibrantText: 'text-amber-950 dark:text-amber-50',
  },
  {
    bg: 'bg-emerald-100 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    solidBg: 'bg-emerald-600',
    solidText: 'text-white',
    accentBorder: 'hover:border-emerald-600',
    vibrantBg: 'bg-emerald-300 dark:bg-emerald-500/35',
    vibrantText: 'text-emerald-950 dark:text-emerald-50',
  },
  {
    bg: 'bg-cyan-100 dark:bg-cyan-500/20',
    text: 'text-cyan-700 dark:text-cyan-300',
    solidBg: 'bg-cyan-500',
    solidText: 'text-black',
    accentBorder: 'hover:border-cyan-500',
    vibrantBg: 'bg-cyan-300 dark:bg-cyan-500/35',
    vibrantText: 'text-cyan-950 dark:text-cyan-50',
  },
  {
    bg: 'bg-pink-100 dark:bg-pink-500/20',
    text: 'text-pink-700 dark:text-pink-300',
    solidBg: 'bg-pink-600',
    solidText: 'text-white',
    accentBorder: 'hover:border-pink-600',
    vibrantBg: 'bg-pink-300 dark:bg-pink-500/35',
    vibrantText: 'text-pink-950 dark:text-pink-50',
  },
  {
    bg: 'bg-indigo-100 dark:bg-indigo-500/20',
    text: 'text-indigo-700 dark:text-indigo-300',
    solidBg: 'bg-indigo-600',
    solidText: 'text-white',
    accentBorder: 'hover:border-indigo-600',
    vibrantBg: 'bg-indigo-300 dark:bg-indigo-500/35',
    vibrantText: 'text-indigo-950 dark:text-indigo-50',
  },
] as const

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/** Deterministic color set (pastel bg/text, solid block variant, vibrant card-surface variant, hover accent border) derived from a string, e.g. a category or author name. */
export function stringToColor(input: string) {
  return PALETTE[hashString(input) % PALETTE.length]
}

/** The palette's blue entry, matching FastFlowPe's brand blue (#028DD0) — for
 * surfaces that should read as consistently on-brand rather than hashed
 * per-item (e.g. ProcessSteps's hover-preview badge/image tint), as opposed
 * to `stringToColor`'s varied per-string palette pick. */
export const brandAccent = PALETTE[0]
