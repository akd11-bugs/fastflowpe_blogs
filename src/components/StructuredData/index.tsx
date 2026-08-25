import { getServerSideURL } from '@/utilities/getURL'
import { getOrganizationJsonLd, getOrganizationRef } from '@/utilities/organizationSchema'

export const StructuredData: React.FC = () => {
  const url = getServerSideURL()

  const website = {
    '@type': 'WebSite',
    name: 'FastFlowPe Blog',
    url,
    inLanguage: 'en-IN',
    publisher: getOrganizationRef(),
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [getOrganizationJsonLd(), website],
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
