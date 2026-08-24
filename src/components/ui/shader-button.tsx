'use client'

import * as React from 'react'

import { cn } from '@/utilities/ui'

/**
 * Iridescent "shader" button — stacked rotating gradient layers under blend
 * modes. Styles live in globals.css under `.shader-btn`; see the note there
 * for why they are not injected from this component.
 *
 * The label is rendered twice by construction: once on the blended face and
 * once in the multiply overlay. Only one copy is exposed to assistive tech —
 * the other is aria-hidden, or the button announces its name twice.
 */

/**
 * Mismatched periods are the whole trick: seven layers rotating at the same
 * speed would move as one rigid stack, and the surface would never change.
 */
const SHADER_LAYERS = [
  { delay: '0s', duration: '25s' },
  { delay: '0.15s', duration: '15.9s' },
  { delay: '0.53s', duration: '26.4s' },
  { delay: '0.45s', duration: '17.8s' },
  { delay: '1.6s', duration: '19.2s' },
  { delay: '1.6s', duration: '29.2s' },
  { delay: '1.6s', duration: '20.2s' },
]

export interface ShaderButtonProps extends React.ComponentProps<'button'> {
  /** `spectrum` is the stock red/blue palette; `brand` retints it to #028DD0. */
  variant?: 'spectrum' | 'brand'
}

export const ShaderButton: React.FC<ShaderButtonProps> = ({
  className,
  children = 'Start',
  type = 'button',
  variant = 'spectrum',
  ref,
  ...props
}) => {
  const localRef = React.useRef<HTMLButtonElement>(null)
  const [active, setActive] = React.useState(true)

  React.useImperativeHandle(ref, () => localRef.current as HTMLButtonElement)

  // Pause the animations while the button is scrolled out of view — seven
  // blend-mode layers otherwise repaint for the entire session, on every page
  // the button appears on.
  React.useEffect(() => {
    const el = localRef.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <button
      ref={localRef}
      type={type}
      data-shader-active={String(active)}
      className={cn('shader-btn', variant === 'brand' && 'shader-btn--brand', className)}
      {...props}
    >
      <span aria-hidden="true" className="shader-lightbar" />
      {SHADER_LAYERS.map((layer, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="shader-layer"
          // Replaces the original's :nth-child(8) selector, which depended on
          // the light bar being the first child and broke on any reorder.
          data-shader-top={String(index === SHADER_LAYERS.length - 1)}
          style={{ animationDelay: layer.delay, animationDuration: layer.duration }}
        />
      ))}
      <span className="shader-face">{children}</span>
      <span aria-hidden="true" className="shader-overlay">
        {children}
      </span>
    </button>
  )
}
