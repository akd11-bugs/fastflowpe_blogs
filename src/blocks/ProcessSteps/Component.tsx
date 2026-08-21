'use client'

import React, { useState } from 'react'

import type { ProcessStepsBlock as ProcessStepsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { stringToColor } from '@/utilities/stringToColor'

import { StickyCard } from '@/components/StickyStack/StickyCard'

import { ProcessTracker } from './ProcessTracker'

/**
 * Sticky-stacking process section (referenced by the user as "43.mp4").
 * Pure CSS positioning — no scroll-linked JS beyond the small "which card
 * is active" detector in StickyCard. The left intro is `sticky` and pins
 * in place while the cards column scrolls past; a vertical stepper in
 * between doubles as a partition and shows scroll progress through the
 * steps. Each step card is *itself* `sticky` at the same top offset as the
 * one before it — the classic CSS-only stacking trick: as the page
 * scrolls, each new sticky card "catches" at that position and visually
 * covers the previous one.
 *
 * Card visual language deliberately mirrors src/components/Card/index.tsx
 * (the /posts cards) — same border/radius/badge/accent-bar recipe — except
 * the accent bar is driven by *active* (stuck) state here instead of
 * `:hover`, since these cards aren't primarily a mouse-hover surface.
 */
export const ProcessStepsBlock: React.FC<ProcessStepsBlockProps> = ({
  eyebrow,
  heading,
  description,
  steps,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const stepList = steps || []

  return (
    <div className="container my-16">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,20rem)_auto_minmax(0,1fr)] gap-10 lg:gap-12">
        <div className="lg:sticky lg:top-32 lg:self-start">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{heading}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>

        <ProcessTracker count={stepList.length} activeIndex={activeIndex} />

        <div className="flex flex-col gap-6 lg:gap-0">
          {stepList.map((step, index) => {
            const accent = stringToColor(step.title || String(index))

            return (
              <div key={step.id || index} className="lg:min-h-[55vh]">
                <StickyCard onActiveChange={(active) => active && setActiveIndex(index)}>
                  {(isActive) => (
                    <article
                      className={cn(
                        'group relative flex flex-col border-2 rounded-2xl overflow-hidden shadow-lg transition-all duration-300',
                        accent.vibrantBg,
                        isActive
                          ? cn('scale-105 shadow-2xl', accent.accentBorder.replace('hover:', ''))
                          : 'border-border',
                      )}
                    >
                      {/* Accent reveal bar — driven by `isActive` (stuck state)
                          instead of :hover, matching Card.tsx's language for a
                          non-hover-driven surface. */}
                      <div
                        className={cn(
                          'absolute inset-x-0 top-0 transition-[height] duration-300 ease-out z-10',
                          isActive ? 'h-2' : 'h-0',
                          accent.solidBg,
                        )}
                      />

                      {/* Image placeholder — real illustrations/icons TBD */}
                      <div className={cn('relative w-full aspect-[21/9] overflow-hidden', accent.bg)}>
                        <div
                          className={cn(
                            'absolute inset-0 flex items-center justify-center text-sm font-medium',
                            accent.text,
                          )}
                        >
                          Image placeholder
                        </div>
                      </div>

                      <div className="p-6 md:p-8 flex flex-col gap-3">
                        <span
                          className={cn(
                            'inline-flex w-fit items-center justify-center text-sm font-bold rounded-full px-3 py-1',
                            accent.solidBg,
                            accent.solidText,
                          )}
                        >
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        <h3 className={cn('text-2xl font-bold tracking-tight', accent.vibrantText)}>
                          {step.title}
                        </h3>
                        <p className={cn(accent.vibrantText, 'opacity-80')}>{step.description}</p>
                      </div>
                    </article>
                  )}
                </StickyCard>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
