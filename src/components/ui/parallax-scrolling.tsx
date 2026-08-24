'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'

import { useLenis } from '@/providers/SmoothScroll'
import { canUseMotionEffects } from '@/utilities/canUseMotionEffects'
import { useScrollTriggerLenis } from '@/utilities/useScrollTriggerLenis'
import { cn } from '@/utilities/ui'

/**
 * Scroll-scrubbed layered parallax, adapted from Osmo's GSAP demo.
 *
 * Four differences from the original snippet, each load-bearing:
 *
 * 1. It does NOT construct Lenis. The app already owns one instance
 *    (providers/SmoothScroll); a second one fighting it for window scroll makes
 *    the whole site unscrollable. This consumes the existing one via context
 *    and falls back to native scroll where smooth scroll is deliberately off.
 * 2. Cleanup kills only THIS component's ScrollTrigger. The original called
 *    `ScrollTrigger.getAll().forEach(st => st.kill())`, which destroys every
 *    other component's triggers on unmount.
 * 3. Layers are props, not hardcoded CDN images, so the hero keeps rendering
 *    Payload content instead of demo art.
 * 4. The original shipped no CSS at all — the 11 `.parallax__*` classes it
 *    referenced were never provided. The stacking, sizing and masking are
 *    expressed as Tailwind here instead.
 */

export interface ParallaxLayer {
  /** Rendered content for this layer — an image, a heading, anything. */
  content: React.ReactNode
  /**
   * How far the layer travels over the scroll range, as a percentage of its own
   * height. Higher = moves more = reads as further from the camera. The
   * original demo used 70 / 55 / 40 / 10 back-to-front.
   */
  yPercent: number
  className?: string
}

export interface ParallaxScrollingProps {
  /** Back-to-front. The last entry paints on top. */
  layers: ParallaxLayer[]
  className?: string
  /** Height of the scroll-scrubbed stage. */
  heightClassName?: string
  /** Fades the bottom edge into the page background below. */
  fade?: boolean
  children?: React.ReactNode
}

export const ParallaxScrolling: React.FC<ParallaxScrollingProps> = ({
  layers,
  className,
  heightClassName = 'min-h-[80vh]',
  fade = true,
  children,
}) => {
  const stageRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  // Forwards Lenis's interpolated position to ScrollTrigger. Shared with every
  // other scroll-linked component so Lenis keeps exactly one driver.
  useScrollTriggerLenis()

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    // The shared gate the rest of the codebase uses for decorative motion
    // (Cursor, HeroCanvas, HoverWiggle). Covers reduced-motion AND coarse
    // pointers/low-spec hardware, so this doesn't scrub transforms every frame
    // on phones while the sibling WebGL hero is gated off on exactly those
    // devices. Gated-out visitors get the composed still frame.
    if (!canUseMotionEffects()) return

    gsap.registerPlugin(ScrollTrigger)

    // Scoped to this element, so `revert()` below cannot touch anything else.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      })

      layers.forEach((layer, i) => {
        tl.to(
          stage.querySelectorAll(`[data-parallax-layer="${i}"]`),
          { yPercent: layer.yPercent, ease: 'none' },
          // All layers share one position on the timeline — they move together,
          // just at different rates. Staggering them would break the parallax.
          i === 0 ? undefined : '<',
        )
      })
    }, stage)

    return () => ctx.revert()
    // `layers` is intentionally excluded: it contains ReactNodes and would be a
    // new array identity every render, tearing down the timeline each time. The
    // layer COUNT and travel distances are what the timeline depends on.
  }, [layers.length, lenis])

  return (
    <div ref={stageRef} className={cn('relative isolate overflow-hidden', heightClassName, className)}>
      {layers.map((layer, i) => (
        <div
          key={i}
          data-parallax-layer={i}
          className={cn(
            // Layers are oversized and pulled up: a layer that travels 70% of
            // its height would otherwise expose bare background at its edge.
            'pointer-events-none absolute inset-x-0 -top-1/4 h-[150%] will-change-transform',
            '[&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:select-none',
            layer.className,
          )}
        >
          {layer.content}
        </div>
      ))}

      {fade && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-background to-transparent"
        />
      )}

      {children}
    </div>
  )
}
