'use client'

import React, { Suspense } from 'react'
import { Physics } from '@react-three/rapier'
import { useTetheredCardContext } from '@/components/three/context'
import { TetheredCard } from '@/components/three/experiences/TetheredCard'
import { Environment } from '@/components/three/components'

// Physics and visible content container
const SceneContent = () => {
  const { isVisible, cardExperiencePosition } = useTetheredCardContext()

  if (!isVisible) {
    return null
  }

  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <TetheredCard
        position={[cardExperiencePosition.x, cardExperiencePosition.y, cardExperiencePosition.z]}
        transparentColor='#D35400'
      />
    </Physics>
  )
}

/**
 * TetheredCardManager is a presentation component that renders the tethered card experience.
 * All state management and positioning logic has been moved to TetheredCardContext.
 */
export const TetheredCardManager: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Environment />
      <SceneContent />
    </Suspense>
  )
}
