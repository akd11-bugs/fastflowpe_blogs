import type { Post } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'
import { getOrganizationRef } from '@/utilities/organizationSchema'

export const BlogSchema: React.FC<{
  name: string
  description?: string | null
  posts: Post[]
}> = ({ name, description, posts }) => {
  const serverUrl = getServerSideURL()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name,
    description: description || undefined,
    url: `${serverUrl}/`,
    inLanguage: 'en-IN',
    publisher: getOrganizationRef(),
    blogPost: posts.length
      ? posts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: `${serverUrl}/posts/${post.slug}`,
          datePublished: post.publishedAt || undefined,
          dateModified: post.updatedAt || post.publishedAt || undefined,
        }))
      : undefined,
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
