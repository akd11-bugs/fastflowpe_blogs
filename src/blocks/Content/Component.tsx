import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { stringToColor } from '@/utilities/stringToColor'

type LexicalNode = {
  text?: string
  children?: LexicalNode[]
}

function extractHeadingText(node: LexicalNode | undefined): string {
  if (!node) return ''
  if (node.text) return node.text
  for (const child of node.children || []) {
    const text = extractHeadingText(child)
    if (text) return text
  }
  return ''
}

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col
            const isFullWidth = size === 'full'

            // Non-full columns are the "feature grid" items — give them a bold,
            // color-blocked card treatment (refined neobrutalism) rather than
            // bare text. Full-width columns are typically section headings and
            // stay unboxed.
            const accentText = isFullWidth
              ? ''
              : extractHeadingText(richText?.root as LexicalNode | undefined) || String(index)
            const accent = accentText ? stringToColor(accentText) : null

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                  'border-2 rounded-2xl p-5 bg-card': !isFullWidth,
                  [accent?.accentBorder.replace('hover:', '') || 'border-border']: !isFullWidth,
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
