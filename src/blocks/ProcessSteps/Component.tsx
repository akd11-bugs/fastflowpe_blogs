'use client'

import React, { useState } from 'react'

import type { ProcessStepsBlock as ProcessStepsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { brandAccent } from '@/utilities/stringToColor'

/**
 * Plain giant-text list — hovering a step title changes its color and
 * shows that step's description as plain text beside it, in the same row.
 * No floating/boxed preview panel, no image placeholder, no badge marks,
 * no transition animation — just an instant show/hide next to the title.
 */
export const ProcessStepsBlock: React.FC<ProcessStepsBlockProps> = ({
  eyebrow,
  heading,
  description,
  steps,
}) => {
  const stepList = steps || []
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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

      {/* lg-and-up: giant list, description appears beside the title on
          hover. Same viewport-breakpoint split (not a pointer/coarse check)
          already used by FeatureSlides for its sticky-vs-inline fallback. */}
      <div className="hidden lg:block" onMouseLeave={() => setHoveredIndex(null)}>
        {stepList.map((step, index) => (
          <div
            key={step.id || index}
            onMouseEnter={() => setHoveredIndex(index)}
            className="border-b-2 border-border py-8 flex items-center justify-between gap-10 cursor-default"
          >
            <span
              className={cn(
                'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight shrink-0',
                hoveredIndex === index ? brandAccent.text : 'text-foreground',
              )}
            >
              {step.title}
            </span>
            {hoveredIndex === index && (
              <p className="text-muted-foreground text-lg max-w-md text-right">
                {step.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Mobile/touch: no hover available — show every step's title and
          description stacked inline and always visible. */}
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
