import type { Post } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'

const getImageURL = (image: Post['meta']) => {
  const serverUrl = getServerSideURL()
  const img = image?.image

  if (img && typeof img === 'object' && 'url' in img) {
    const ogUrl = img.sizes?.og?.url
    return ogUrl ? serverUrl + ogUrl : serverUrl + img.url
  }

  return undefined
}

export const BlogPostingSchema: React.FC<{ post: Post }> = ({ post }) => {
  const url = `${getServerSideURL()}/posts/${post.slug}`
  const image = getImageURL(post.meta)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta?.description || undefined,
    image: image ? [image] : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: post.populatedAuthors?.length
      ? post.populatedAuthors.map((author) => ({ '@type': 'Person', name: author.name }))
      : { '@type': 'Organization', name: 'FastFlowPe' },
    publisher: {
      '@type': 'Organization',
      name: 'GoFastFlowPe Solutions Pvt Ltd',
      logo: {
        '@type': 'ImageObject',
        url: `${getServerSideURL()}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
