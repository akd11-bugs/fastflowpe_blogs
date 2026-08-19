'use client'

import { Canvas } from '@react-three/fiber'
import React from 'react'

export const WebGLCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Canvas
      dpr={[1, 2]}
      orthographic
      camera={{ position: [0, 0, 10] }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {children}
    </Canvas>
  )
}
