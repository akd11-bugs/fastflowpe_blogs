import React from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FeaturedPostsBlock } from '@/blocks/FeaturedPosts/Component'
import { FeatureSlidesBlock } from '@/blocks/FeatureSlides/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { IndustrySolutionsBlock } from '@/blocks/IndustrySolutions/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProcessStepsBlock } from '@/blocks/ProcessSteps/Component'
import { ScrollReveal } from '@/components/ScrollReveal'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  featuredPosts: FeaturedPostsBlock,
  featureSlides: FeatureSlidesBlock,
  formBlock: FormBlock,
  industrySolutions: IndustrySolutionsBlock,
  mediaBlock: MediaBlock,
  processSteps: ProcessStepsBlock,
}

type GridPosition = {
  colStart?: number | null
  colSpan?: number | null
  rowStart?: number | null
  rowSpan?: number | null
}

// Post IDs already shown in any featuredPosts block on this page — passed
// down to archive blocks so the listing below doesn't repeat them. Reading
// sibling blocks' content here (rather than giving archive its own
// "exclude" field an admin would have to fill in twice) means the two
// blocks can never drift out of sync with each other.
function collectFeaturedPostIds(blocks: Page['layout'][0][]): (string | number)[] {
  const ids: (string | number)[] = []
  for (const block of blocks) {
    if (block.blockType === 'featuredPosts') {
      const posts = (block as { posts?: unknown[] }).posts || []
      for (const post of posts) {
        if (typeof post === 'object' && post !== null && 'id' in post) ids.push((post as { id: string | number }).id)
        else if (typeof post === 'string' || typeof post === 'number') ids.push(post)
      }
    }
  }
  return ids
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const featuredPostIds = hasBlocks ? collectFeaturedPostIds(blocks) : []

  if (hasBlocks) {
    return (
      <div className="grid grid-cols-12">
        {blocks.map((block, index) => {
          const { blockType } = block

          // featuredPosts renders nothing when empty (see its Component.tsx)
          // — skip the wrapper entirely rather than reserving its my-16
          // margin for a block that draws no content, which otherwise left
          // a dead ~128px gap above whatever comes next.
          if (blockType === 'featuredPosts' && !(block as { posts?: unknown[] }).posts?.length) {
            return null
          }

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const { colStart, colSpan, rowStart, rowSpan } =
                (block as { gridPosition?: GridPosition }).gridPosition || {}

              const hasCustomRow = (rowStart && rowStart > 1) || (rowSpan && rowSpan > 1)

              const extraProps = blockType === 'archive' ? { excludeIds: featuredPostIds } : {}

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
                    <Block {...block} {...extraProps} disableInnerContainer />
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
