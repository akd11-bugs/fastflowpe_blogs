import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

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

  const path = isHome ? '/' : Array.isArray(doc?.slug) ? doc?.slug.join('/') : `/${doc?.slug || ''}`

  return {
    alternates: {
      canonical: path,
    },
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: path,
    }),
    title,
  }
}
