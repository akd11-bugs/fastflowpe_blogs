import React from 'react'

import type { IndustrySolutionsBlock as IndustrySolutionsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { stringToColor } from '@/utilities/stringToColor'

/**
 * Plain responsive grid of industry cards — deliberately NOT full-bleed like
 * ProcessSteps above it. Two adjacent takeover sections back to back would
 * compete for the same attention; this one recedes into the normal container
 * width so the page has a place to breathe after the panels.
 *
 * Card language matches src/components/Card (the /posts cards): border-2,
 * rounded-2xl, bg-card, and the same hover accent-bar reveal, so a reader who
 * has already seen post cards recognizes this as the same design system
 * rather than a one-off.
 */
export const IndustrySolutionsBlock: React.FC<IndustrySolutionsBlockProps> = ({
  eyebrow,
  heading,
  description,
  items,
}) => {
  const itemList = items || []

  if (!itemList.length) return null

  return (
    <div className="container my-16">
      <div className="max-w-2xl mb-10 md:mb-16">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{heading}</h2>
        {description && <p className="text-muted-foreground max-w-[65ch]">{description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemList.map((item, index) => {
          const accent = stringToColor(item.title || String(index))

          return (
            <article
              key={item.id || index}
              className={cn(
                // Margin, not flex `gap` — see the note in Footer/Component.tsx.
                'group relative flex flex-col border-2 border-border rounded-2xl overflow-hidden bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                accent.accentBorder,
              )}
            >
              <div
                className={cn(
                  'absolute inset-x-0 top-0 h-0 group-hover:h-2 transition-[height] duration-300 ease-out',
                  accent.solidBg,
                )}
              />
              <span
                className={cn(
                  'mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                  accent.solidBg,
                  accent.solidText,
                )}
              >
                {item.title}
              </span>
              <h3 className="mb-3 text-xl font-bold tracking-tight">{item.headline}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
