import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getServerSideURL } from '@/utilities/getURL'

/**
 * llms.txt (https://llmstxt.org) — a plain-text index for LLM crawlers,
 * the AI-discovery equivalent of a sitemap. Generated at request time
 * (cached, same pattern as posts-sitemap.xml) so every published post
 * shows up automatically instead of living in a hand-maintained static
 * file that drifts out of date.
 */
const getLlmsTxt = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL().replace(/\/$/, '')

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        title: true,
        meta: true,
      },
    })

    const postLines = results.docs
      .filter((post) => Boolean(post?.slug))
      .map((post) => {
        const description = post.meta?.description?.replace(/\s+/g, ' ').trim()
        return description
          ? `- [${post.title}](${SITE_URL}/posts/${post.slug}): ${description}`
          : `- [${post.title}](${SITE_URL}/posts/${post.slug})`
      })
      .join('\n')

    return `# FastFlowPe Blog

> FastFlowPe is a payment orchestration platform that lets Indian businesses connect every payment gateway and bank account into a single dashboard — routing, collecting, disbursing, and reconciling payments in real time. This blog publishes product updates, engineering notes, and practical guides on payment gateways, checkout optimization, UPI, and banking integrations for Indian D2C, ecommerce, and fintech teams.

## About

- [FastFlowPe](https://fastflowpe.com): the main product site.

## Posts

${postLines || '- No posts published yet.'}
`
  },
  ['llms-txt'],
  {
    tags: ['llms-txt'],
  },
)

export async function GET() {
  const body = await getLlmsTxt()

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
