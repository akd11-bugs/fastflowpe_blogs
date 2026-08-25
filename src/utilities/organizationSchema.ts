import { getServerSideURL } from './getURL'
import { CANONICAL_DESCRIPTION } from './canonicalDescription'

export const ORGANIZATION_ID = 'https://fastflowpe.com/#organization'

// The full Organization node — declared once, referenced everywhere else by
// @id (getOrganizationRef) rather than duplicated. Duplicating this object
// across Organization/WebSite/BlogPosting nodes is what let the three drift
// out of sync with each other in the first place.
export const getOrganizationJsonLd = () => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'GoFastFlowPe Solutions Pvt Ltd',
  alternateName: 'FastFlowPe',
  description: CANONICAL_DESCRIPTION,
  url: 'https://fastflowpe.com',
  logo: `${getServerSideURL()}/favicon.svg`,
  sameAs: [
    'https://www.linkedin.com/company/fastflowpe/',
    'https://x.com/FastFlowPe',
    'https://www.instagram.com/fastflowpe/',
    'https://www.facebook.com/fastflowpe',
    'https://www.youtube.com/@fastflowpe',
  ],
})

export const getOrganizationRef = () => ({ '@id': ORGANIZATION_ID })
