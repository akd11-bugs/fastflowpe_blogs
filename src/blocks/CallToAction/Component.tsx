import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

// Same deliberate, scoped FastFlowPe blue used in FeatureSlides — the CTA
// is the homepage's one confident "closing" color moment, not a recurring
// theme color.
const FASTFLOWPE_BLUE = '#028DD0'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div
        className="rounded-2xl border-2 border-transparent p-6 md:p-8 flex flex-col md:flex-row md:justify-between md:items-center text-white [&_*]:text-white"
        style={{ backgroundColor: FASTFLOWPE_BLUE }}
      >
        {/* Margin, not flex `gap` — see the note in Footer/Component.tsx. */}
        <div className="max-w-[48rem] flex items-center mb-8 md:mb-0">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col">
          {(links || []).map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                size="lg"
                className="!bg-white !text-primary mb-8 last:mb-0"
                {...link}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
