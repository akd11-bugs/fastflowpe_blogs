'use client'

import React, { useRef, useState } from 'react'

import type { ProcessStepsBlock as ProcessStepsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { brandAccent } from '@/utilities/stringToColor'

/**
 * Giant-text list with a hover-revealed floating preview card — matches
 * metajive.com's "Featured Work" section (confirmed via extracted video
 * frames): a plain vertical list in massive type, normal page scroll, and
 * hovering a row surfaces an animated floating card beside it showing an
 * image placeholder and the step's description together.
 */
export const ProcessStepsBlock: React.FC<ProcessStepsBlockProps> = ({
  eyebrow,
  heading,
  description,
  steps,
}) => {
  const stepList = steps || []
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const [previewTop, setPreviewTop] = useState(0)

  const handleEnter = (index: number) => {
    const row = rowRefs.current[index]
    const list = listRef.current
    if (!row || !list) return
    const rowRect = row.getBoundingClientRect()
    const listRect = list.getBoundingClientRect()
    setPreviewTop(rowRect.top - listRect.top + rowRect.height / 2)
    setHoveredIndex(index)
  }

  const hovered = hoveredIndex !== null ? stepList[hoveredIndex] : null

  return (
    <div className="container my-16">
      <div className="max-w-2xl mb-10 md:mb-16">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{heading}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {/* lg-and-up: giant list + hover preview. */}
      <div ref={listRef} className="relative hidden lg:block" onMouseLeave={() => setHoveredIndex(null)}>
        {stepList.map((step, index) => (
          <div
            key={step.id || index}
            ref={(el) => {
              rowRefs.current[index] = el
            }}
            onMouseEnter={() => handleEnter(index)}
            className="border-b-2 border-border py-8 cursor-default"
          >
            <span
              className={cn(
                'block text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-colors',
                hoveredIndex === index ? brandAccent.text : 'text-foreground',
              )}
            >
              {step.title}
            </span>
          </div>
        ))}

        {/* Floating preview — repositions to the hovered row's vertical
            center, fades/scales in. Image placeholder + description
            together as one card, no badge/number marks. */}
        <div
          className={cn(
            'pointer-events-none absolute right-0 w-80 -translate-y-1/2 transition-all duration-200 ease-out',
            hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          )}
          style={{ top: previewTop }}
        >
          {hovered && (
            <div className="border-2 border-border rounded-2xl overflow-hidden bg-card shadow-2xl">
              <div className={cn('relative w-full aspect-[4/3] overflow-hidden', brandAccent.bg)}>
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center text-sm font-medium',
                    brandAccent.text,
                  )}
                >
                  Image placeholder
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm">{hovered.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/touch: no hover available — show every step's full content
          inline and always visible. */}
      <div className="lg:hidden flex flex-col">
        {stepList.map((step, index) => (
          <div key={step.id || index} className="border-b-2 border-border py-8 flex flex-col gap-3">
            <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
