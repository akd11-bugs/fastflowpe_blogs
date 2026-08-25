import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { CANONICAL_DESCRIPTION } from './canonicalDescription'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: CANONICAL_DESCRIPTION,
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
      width: 1200,
      height: 630,
    },
  ],
  siteName: 'FastFlowPe',
  title: 'FastFlowPe Blog',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
