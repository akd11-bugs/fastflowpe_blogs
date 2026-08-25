import { getServerSideURL } from '@/utilities/getURL'

export const StructuredData: React.FC = () => {
  const url = getServerSideURL()

  const organization = {
    '@type': 'Organization',
    name: 'GoFastFlowPe Solutions Pvt Ltd',
    alternateName: 'FastFlowPe',
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
