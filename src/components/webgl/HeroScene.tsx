'use client'

import React from 'react'

import { WebGLCanvas } from './WebGLCanvas'
import { WiggleShaderPlane } from './WiggleShaderPlane'

// Combined into one module so a single next/dynamic(..., { ssr: false })
// import pulls in exactly one copy of `three` — splitting the canvas and
// the plane into two separate dynamic imports caused Turbopack to place
// `three` in two separate chunks, triggering THREE's "multiple instances"
// warning.
export const HeroScene: React.FC<{ textureUrl: string; imageAspect: number }> = ({
  textureUrl,
  imageAspect,
}) => {
  return (
    <WebGLCanvas>
      <WiggleShaderPlane textureUrl={textureUrl} imageAspect={imageAspect} />
    </WebGLCanvas>
  )
}
