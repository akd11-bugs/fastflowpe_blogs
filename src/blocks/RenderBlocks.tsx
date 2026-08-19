import React from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FeatureSlidesBlock } from '@/blocks/FeatureSlides/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProcessStepsBlock } from '@/blocks/ProcessSteps/Component'
import { ScrollReveal } from '@/components/ScrollReveal'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  featureSlides: FeatureSlidesBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  processSteps: ProcessStepsBlock,
}

type GridPosition = {
  colStart?: number | null
  colSpan?: number | null
  rowStart?: number | null
  rowSpan?: number | null
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <div className="grid grid-cols-12">
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const { colStart, colSpan, rowStart, rowSpan } =
                (block as { gridPosition?: GridPosition }).gridPosition || {}

              const hasCustomRow = (rowStart && rowStart > 1) || (rowSpan && rowSpan > 1)

              return (
                <div
                  className="my-16"
                  key={index}
                  style={{
                    gridColumn: `${colStart || 1} / span ${colSpan || 12}`,
                    ...(hasCustomRow
                      ? { gridRow: `${rowStart || 1} / span ${rowSpan || 1}` }
                      : {}),
                  }}
                >
                  <ScrollReveal>
                    {/* @ts-expect-error there may be some mismatch between the expected types here */}
                    <Block {...block} disableInnerContainer />
                  </ScrollReveal>
                </div>
              )
            }
          }
          return null
        })}
      </div>
    )
  }

  return null
}
