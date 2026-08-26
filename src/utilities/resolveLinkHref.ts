import type { Page, Post } from '@/payload-types'

type LinkFields = {
  type?: ('reference' | 'custom') | null
  reference?:
    | { relationTo: 'pages'; value: number | Page | null }
    | { relationTo: 'posts'; value: number | Post | null }
    | null
  url?: string | null
}

/**
 * Mirrors the href derivation inside components/Link/index.tsx's CMSLink —
 * duplicated rather than imported because CMSLink is a component, and this
 * is needed as a plain string before render (to decide a nav item's active
 * state), not as JSX.
 */
export function resolveLinkHref(link?: LinkFields | null): string | null {
  if (!link) return null

  if (link.type === 'reference' && typeof link.reference?.value === 'object' && link.reference.value?.slug) {
    const prefix = link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return `${prefix}/${link.reference.value.slug}`
  }

  return link.url || null
}
