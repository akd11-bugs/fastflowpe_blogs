'use client'

import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Distance from the cursor (in plane-local uv space) drives a radial
    // displacement; uVelocity adds directional drag so the surface trails
    // the cursor instead of just bulging symmetrically.
    float dist = distance(uv, uMouse);
    float falloff = smoothstep(0.5, 0.0, dist) * uHover;
    float wave = sin(dist * 12.0 - length(uVelocity) * 4.0) * 0.5 + 0.5;

    pos.z += falloff * wave * 0.35;
    pos.xy += uVelocity * falloff * 0.12;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uCoverScale;
  uniform vec2 uCoverOffset;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv * uCoverScale + uCoverOffset;
    vec4 tex = texture2D(uTexture, uv);
    gl_FragColor = tex;
  }
`

/**
 * Fills the entire R3F viewport (a plane sized to viewport.width/height) and
 * emulates CSS `object-fit: cover` in the fragment shader via a UV scale/
 * offset, rather than resizing the plane to the image's own aspect ratio —
 * this keeps it correct as a full-bleed hero background regardless of how
 * the container is cropped by its parent.
 */
export const WiggleShaderPlane: React.FC<{
  textureUrl: string
  imageAspect: number
}> = ({ textureUrl, imageAspect }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(textureUrl)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [textureUrl])

  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const velocity = useRef(new THREE.Vector2(0, 0))
  const targetHover = useRef(0)
  const currentHover = useRef(0)

  const containerAspect = viewport.width / viewport.height
  const coverScale = useMemo(() => {
    if (containerAspect > imageAspect) {
      return { scale: new THREE.Vector2(1, imageAspect / containerAspect), offset: 0 }
    }
    return { scale: new THREE.Vector2(containerAspect / imageAspect, 1), offset: 0 }
  }, [containerAspect, imageAspect])

  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uTexture: { value: texture },
      uCoverScale: { value: new THREE.Vector2(1, 1) },
      uCoverOffset: { value: new THREE.Vector2(0, 0) },
    }),
    [texture],
  )

  const handlePointerMove = (event: { uv?: THREE.Vector2 }) => {
    if (!event.uv) return
    targetMouse.current.set(event.uv.x, event.uv.y)
  }

  useFrame((_state, delta) => {
    if (!materialRef.current) return

    // Critically-damped spring toward the target, framerate-independent.
    const springStrength = Math.min(delta * 8, 1)
    const prevX = currentMouse.current.x
    const prevY = currentMouse.current.y
    currentMouse.current.lerp(targetMouse.current, springStrength)
    velocity.current.set(
      (currentMouse.current.x - prevX) / Math.max(delta, 0.001),
      (currentMouse.current.y - prevY) / Math.max(delta, 0.001),
    )
    currentHover.current += (targetHover.current - currentHover.current) * Math.min(delta * 6, 1)

    materialRef.current.uniforms.uMouse.value.copy(currentMouse.current)
    materialRef.current.uniforms.uVelocity.value.copy(velocity.current)
    materialRef.current.uniforms.uHover.value = currentHover.current

    const scaleX = coverScale.scale.x
    const scaleY = coverScale.scale.y
    materialRef.current.uniforms.uCoverScale.value.set(scaleX, scaleY)
    materialRef.current.uniforms.uCoverOffset.value.set((1 - scaleX) / 2, (1 - scaleY) / 2)
  })

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        targetHover.current = 1
      }}
      onPointerLeave={() => {
        targetHover.current = 0
        targetMouse.current.set(0.5, 0.5)
      }}
    >
      <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}
