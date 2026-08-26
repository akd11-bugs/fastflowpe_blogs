import type { Page, Post } from '@/payload-types'

type LinkFields = {
  type?: ('reference' | 'custom') | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  url?: string | null
}

/**
 * The one place a link's fields resolve to an href — used directly by
 * CMSLink (components/Link/index.tsx) and, as a plain string ahead of
 * render, by nav components that need to compare it against the current
 * pathname for active-state highlighting.
 */
export function resolveLinkHref(link?: LinkFields | null): string | null {
  if (!link) return null
  const { type, reference, url } = link

  if (type === 'reference' && typeof reference?.value === 'object' && reference.value?.slug) {
    const prefix = reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''
    return `${prefix}/${reference.value.slug}`
  }

  return url || null
}
