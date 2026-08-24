import React from 'react'

import type { ProcessStepsBlock as ProcessStepsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

/**
 * Plain full-bleed process section — no scroll-jacking.
 *
 * This was previously a GSAP ScrollTrigger pin-and-stack effect (each step
 * pinned at the top while the next scrolled over it). Dropped in favour of a
 * static page in the style of juspay.io's blog: the panels' visual identity
 * (giant type, mono counter, full-bleed colour) stays, they just sit in
 * normal document flow now, like any other section. No client JS, no GSAP,
 * no scroll listeners — this can render on the server.
 */
export const ProcessStepsBlock: React.FC<ProcessStepsBlockProps> = ({
  eyebrow,
  heading,
  description,
  steps,
}) => {
  const stepList = steps || []

  if (!stepList.length) return null

  return (
    <div>
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{heading}</h2>
          {description && <p className="text-muted-foreground max-w-[65ch]">{description}</p>}
        </div>
      </div>

      {stepList.map((step, index) => (
        <section
          key={step.id || index}
          data-panel-tone={index % 4}
          className="process-panel flex flex-col justify-center px-6 py-16 md:px-12 md:py-20 lg:px-16"
          aria-label={`Step ${index + 1}: ${step.title}`}
        >
          <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] panel-dim">
              {String(index + 1).padStart(2, '0')} / {String(stepList.length).padStart(2, '0')}
            </p>

            <hr className="panel-rule border-t" />

            {/* h3, not h1 — the hero owns the page's h1 and this section
                already has an h2 above. */}
            <h3 className="text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.9] tracking-tight">
              {step.title}
            </h3>

            <hr className="panel-rule border-t" />

            {/* Image beside the description on wide screens, below it on
                narrow. No placeholder box when a step has no image — an empty
                dashed rectangle read as an unfinished page, not a deliberate
                gap, so the description just takes the full row instead. */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
              {step.image && typeof step.image === 'object' && (
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                    <Media
                      fill
                      pictureClassName="absolute inset-0"
                      imgClassName="object-cover"
                      resource={step.image}
                    />
                  </div>
                </div>
              )}

              <p
                className={cn(
                  'text-base leading-relaxed md:text-lg',
                  step.image && typeof step.image === 'object' ? 'w-full lg:w-1/2' : 'w-full max-w-3xl',
                )}
              >
                {step.description}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
