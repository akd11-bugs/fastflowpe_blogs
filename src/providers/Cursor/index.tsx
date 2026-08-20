'use client'

import { cn } from '@/utilities/ui'
import { canUseMotionEffects } from '@/utilities/canUseMotionEffects'
import React, { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select'
const MAGNETIC_PULL = 0.5

/**
 * A spring-follow custom cursor. Deliberately disabled on touch/coarse-pointer
 * devices (cursor-reactive motion has no meaning without a mouse) and on
 * prefers-reduced-motion. Purely a visual overlay — pointer-events stay
 * disabled on the dot itself so it never blocks real clicks/hovers.
 *
 * Also magnetic: while hovering an interactive element, the dot is pulled
 * partway toward that element's center (rather than snapping fully onto it,
 * which would fight the user's actual pointer position) and grows to signal
 * "this is clickable."
 */
export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState(false)
  const [isMagnetized, setIsMagnetized] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const magnetElRef = useRef<Element | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (canUseMotionEffects()) setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const handleMove = (e: PointerEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY

      const interactive = (e.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR) ?? null
      if (interactive !== magnetElRef.current) {
        magnetElRef.current = interactive
        setIsMagnetized(Boolean(interactive))
      }
    }
    window.addEventListener('pointermove', handleMove)

    const tick = () => {
      let desiredX = target.current.x
      let desiredY = target.current.y

      const magnetEl = magnetElRef.current
      if (magnetEl) {
        const rect = magnetEl.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        desiredX = target.current.x * (1 - MAGNETIC_PULL) + centerX * MAGNETIC_PULL
        desiredY = target.current.y * (1 - MAGNETIC_PULL) + centerY * MAGNETIC_PULL
      }

      current.current.x += (desiredX - current.current.x) * 0.2
      current.current.y += (desiredY - current.current.y) * 0.2
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    document.documentElement.classList.add('custom-cursor-active')

    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [enabled])

  return (
    <>
      {children}
      {enabled && (
        <div
          ref={dotRef}
          aria-hidden="true"
          className={cn('cursor-dot', isMagnetized && 'cursor-dot-magnetized')}
        />
      )}
    </>
  )
}
