import { getServerSideURL } from '@/utilities/getURL'

// Kept identical, word-for-word, to the hero copy on the homepage and to
// public/llms.txt — entity resolution for AI answer/generative engines relies
// on this description being consistent across every surface, not just present.
export const CANONICAL_DESCRIPTION =
  'FastFlowPe is a payment orchestration platform that lets Indian businesses connect every payment gateway and bank account into a single dashboard — routing, collecting, disbursing, and reconciling payments in real time.'

export const StructuredData: React.FC = () => {
  const url = getServerSideURL()

  const organization = {
    '@type': 'Organization',
    name: 'GoFastFlowPe Solutions Pvt Ltd',
    alternateName: 'FastFlowPe',
    description: CANONICAL_DESCRIPTION,
    url: 'https://fastflowpe.com',
    logo: `${url}/favicon.svg`,
    sameAs: [
      'https://www.linkedin.com/company/fastflowpe/',
      'https://x.com/FastFlowPe',
      'https://www.instagram.com/fastflowpe/',
      'https://www.facebook.com/fastflowpe',
      'https://www.youtube.com/@fastflowpe',
    ],
  }

  const website = {
    '@type': 'WebSite',
    name: 'FastFlowPe Blog',
    url,
    publisher: organization,
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
