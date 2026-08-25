import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getOGImage = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  if (image && typeof image === 'object' && 'url' in image) {
    const ogSize = image.sizes?.og

    if (ogSize?.url) {
      return { url: serverUrl + ogSize.url, width: ogSize.width, height: ogSize.height }
    }

    return { url: serverUrl + image.url, width: image.width, height: image.height }
  }

  // 1200x630 is the actual dimension of this static fallback asset — declaring it
  // explicitly lets social/AI crawlers render the card without fetching the image.
  return { url: serverUrl + '/website-template-OG.webp', width: 1200, height: 630 }
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  collection?: 'pages' | 'posts'
}): Promise<Metadata> => {
  const { doc, collection = 'pages' } = args

  const ogImage = getOGImage(doc?.meta?.image)

  // The homepage IS the blog now, and its own meta.title is meant to be the
  // complete tab title (e.g. "FastFlowPe Blog | Payments, Checkout & Banking
  // Insights...") — appending " | FastFlowPe Blog" to it, same as every
  // other page, would duplicate the brand name in the title. Every other
  // page/post keeps the existing "Page Title | FastFlowPe Blog" pattern.
  const isHome = doc?.slug === 'home'
  const title = doc?.meta?.title
    ? isHome
      ? doc.meta.title
      : doc.meta.title + ' | FastFlowPe Blog'
    : 'FastFlowPe Blog'

  const slugPath = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug || ''
  const path = isHome ? '/' : collection === 'posts' ? `/posts/${slugPath}` : `/${slugPath}`

  return {
    alternates: {
      canonical: path,
    },
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: [
        {
          url: ogImage.url,
          width: ogImage.width || undefined,
          height: ogImage.height || undefined,
        },
      ],
      title,
      url: path,
    }),
    title,
  }
}
