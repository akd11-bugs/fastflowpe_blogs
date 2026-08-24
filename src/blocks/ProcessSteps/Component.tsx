'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

import type { ProcessStepsBlock as ProcessStepsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { canUseMotionEffects } from '@/utilities/canUseMotionEffects'
import { useScrollTriggerLenis } from '@/utilities/useScrollTriggerLenis'

/**
 * Full-bleed stacking process section.
 *
 * Each step is a viewport-height panel that pins at the top while the next
 * scrolls up over it, so the section reads as a stack of cards being dealt
 * rather than as a list. `pinSpacing: false` is what makes them overlap — with
 * spacing on, GSAP inserts a spacer per panel and each one adds a full extra
 * screen of scroll instead of covering its predecessor.
 *
 * The panels' colours and the `min-height` live in globals.css under
 * `.process-panel`; see the note there on opacity and z-index, both of which
 * the effect depends on.
 *
 * Two things this block relies on from outside itself:
 *  - RenderBlocks must NOT wrap it in ScrollReveal. GSAP pins by switching an
 *    element to `position: fixed`, which resolves against a transformed
 *    ancestor, and `.scroll-reveal` is transformed until it comes into view.
 *    RenderBlocks keeps an allow-list for exactly this reason.
 *  - Lenis owns the scroll position, so ScrollTrigger has to be fed from it
 *    (useScrollTriggerLenis) or every trigger fires against a stale offset.
 */
export const ProcessStepsBlock: React.FC<ProcessStepsBlockProps> = ({
  eyebrow,
  heading,
  description,
  steps,
}) => {
  const stepList = steps || []
  const rootRef = useRef<HTMLDivElement>(null)

  useScrollTriggerLenis()

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      // Same gate as the WebGL hero, the custom cursor and the hover wiggle:
      // reduced motion, coarse pointers and low-spec hardware get the panels
      // as plain stacked sections. Pinning is the most expensive scroll effect
      // on the site, so this is the one place that matters most.
      if (!canUseMotionEffects()) return
      if (window.innerWidth < 1024) return

      gsap.registerPlugin(ScrollTrigger)

      const panels = gsap.utils.toArray<HTMLElement>('[data-process-panel]', root)

      panels.forEach((panel, index) => {
        const next = panels[index + 1]

        // The last panel is left unpinned so the following section scrolls up
        // against it normally instead of the stack appearing to jam.
        if (next) {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top top',
            // Held pinned until its successor has fully covered it. Ending at
            // `+=offsetHeight` instead let a panel unpin while still partly
            // visible, so it scrolled away as a dimmed slab with a gap above it.
            endTrigger: next,
            end: 'top top',
            pin: true,
            // Without this GSAP inserts a spacer per panel and each one adds a
            // full extra screen of scroll instead of covering its predecessor.
            pinSpacing: false,
            // Lenis drives native window scroll rather than transforming a
            // wrapper, so fixed-position pinning is correct here.
            pinType: 'fixed',
          })
        }

        // Depth cue: the panel being covered recedes. Without it the transition
        // reads as one flat colour replacing another.
        //
        // The scale goes on the panel's CONTENT, never the panel itself. A
        // pinned panel is `position: fixed`, so scaling it shrinks it away from
        // the viewport edges and the panels behind show through as strips down
        // every side. Brightness is safe to apply to the whole panel — it
        // changes no geometry — and children inherit it, so the content dims
        // along with the background.
        if (index > 0) {
          const prev = panels[index - 1]
          const prevInner = prev.querySelector('[data-panel-inner]')

          const dim = gsap.timeline({
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top top', scrub: true },
          })

          dim.fromTo(prev, { filter: 'brightness(1)' }, { filter: 'brightness(0.72)', ease: 'none' }, 0)
          if (prevInner) {
            dim.fromTo(prevInner, { scale: 1 }, { scale: 0.94, ease: 'none' }, 0)
          }
        }
      })

      // Panel images change the measured heights every `end` depends on.
      const images = Array.from(root.querySelectorAll('img'))
      const pending = images.filter((img) => !img.complete)
      if (pending.length) {
        let left = pending.length
        const done = () => {
          left -= 1
          if (left === 0) ScrollTrigger.refresh()
        }
        pending.forEach((img) => {
          img.addEventListener('load', done, { once: true })
          img.addEventListener('error', done, { once: true })
        })
      }
    },
    // useGSAP scopes everything above to this element and reverts it on
    // unmount — no manual ScrollTrigger.kill() calls, and crucially no
    // ScrollTrigger.getAll() sweep, which would take out other components'
    // triggers along with these.
    { scope: rootRef, dependencies: [stepList.length] },
  )

  if (!stepList.length) return null

  return (
    <div ref={rootRef} className="process-stack">
      {/* Intro band, deliberately not a pinned panel — four panels already add
          roughly four screens of scroll to the page. */}
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
          data-process-panel
          data-panel-tone={index % 4}
          // Explicit paint order, and it is load-bearing rather than tidiness.
          // With `pinSpacing: false` GSAP parks a panel at its end position
          // using a transform once its pin finishes — and a transformed element
          // paints above a later STATIC sibling, so the outgoing panel covered
          // its own successor and the last step was never visible at all.
          // Positioning every panel and ramping z-index makes DOM order the
          // paint order unconditionally. Contained by `.process-stack`'s own
          // stacking context, so these never compete with the header's z-50.
          style={{ zIndex: index + 1 }}
          className="process-panel relative flex flex-col justify-center overflow-hidden px-6 py-16 md:px-12 lg:px-16"
          aria-label={`Step ${index + 1}: ${step.title}`}
        >
          <div data-panel-inner className="mx-auto flex w-full max-w-[90rem] flex-col gap-[4vh]">
            <p className="font-mono text-xs uppercase tracking-[0.25em] panel-dim">
              {String(index + 1).padStart(2, '0')} / {String(stepList.length).padStart(2, '0')}
            </p>

            <hr className="panel-rule border-t" />

            {/* h3, not the demo's h1 — the hero owns the page's h1 and this
                section already has an h2 above. */}
            <h3 className="text-[clamp(3rem,9vw,8rem)] font-bold uppercase leading-[0.85] tracking-tight">
              {step.title}
            </h3>

            <hr className="panel-rule border-t" />

            {/* Image beside the description on wide screens, below it on
                narrow — the responsive answer to "under or beside". */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
              <div className="w-full lg:w-1/2">
                {step.image && typeof step.image === 'object' ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                    <Media
                      fill
                      pictureClassName="absolute inset-0"
                      imgClassName="object-cover"
                      resource={step.image}
                    />
                  </div>
                ) : (
                  <div className="panel-placeholder flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-dashed">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] panel-dim">
                      Image placeholder
                    </span>
                  </div>
                )}
              </div>

              <p className="w-full text-[clamp(1.05rem,1.8vw,1.6rem)] leading-relaxed lg:w-1/2">
                {step.description}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
