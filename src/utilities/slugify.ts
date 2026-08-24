/**
 * Text -> URL-safe anchor slug. Used to give headings stable `id`s and to
 * generate matching jump-link hrefs for the table of contents — both sides
 * MUST derive from the same function or the links silently point at nothing.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * A slug generator that de-duplicates against everything it has already
 * produced in this call ("overview" -> "overview", then "overview-2", ...).
 *
 * Two independent call sites need this: the heading converter (which stamps
 * `id` on each rendered heading) and the table-of-contents extractor (which
 * builds the matching jump links). Sharing this factory instead of two
 * separate counters is what keeps them from drifting out of sync.
 */
export function createSlugDeduper() {
  const seen = new Map<string, number>()
  return (text: string): string => {
    const base = slugify(text)
    const count = seen.get(base) || 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }
}
