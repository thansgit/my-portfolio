'use client'

import React, { Suspense, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useViewportContext } from '@/components/three/context/ViewportContext'
import { useTetheredCardContext } from '@/components/three/context'
import { TetheredCard } from '@/components/three/experiences/TetheredCard'
import { Environment } from '@/components/three/components'
import { calculateCardPosition } from '@/components/three/utils/threeHelpers'
import * as THREE from 'three'

// Wrapper component for the TetheredCard element
const TetheredCardWrapper = () => {
  const { cardExperiencePosition } = useTetheredCardContext()

  return <TetheredCard position={[cardExperiencePosition.x, cardExperiencePosition.y, cardExperiencePosition.z]} />
}

// Physics and visible content container
const SceneContent = () => {
  const { isVisible } = useViewportContext()

  if (!isVisible) {
    return null
  }

  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <TetheredCardWrapper />
    </Physics>
  )
}

/**
 * TetheredCardManager handles the tethered card experience,
 * including positioning, physics, lighting, and environment setup
 */
export const TetheredCardManager: React.FC = () => {
  const { isMobile } = useViewportContext()
  const { viewport } = useThree()
  const { setCardExperiencePosition, setRopeColor, setRopeRadius } = useTetheredCardContext()

  // Calculate and update card position when viewport changes
  useEffect(() => {
    const [x, y, z] = calculateCardPosition(viewport, isMobile)
    setCardExperiencePosition(new THREE.Vector3(x, y, z))
  }, [viewport.width, viewport.height, isMobile, setCardExperiencePosition])

  /**
   * Updates rope visual properties
   * @param color - The color of the rope
   * @param radius - The radius of the rope
   */
  const updateRopeVisuals = (color: string, radius: number) => {
    setRopeColor(color)
    setRopeRadius(radius)
  }

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Environment />
      <SceneContent />
    </Suspense>
  )
}
