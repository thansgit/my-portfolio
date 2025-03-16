'use client'

import React, { Suspense } from 'react'
import { useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useViewportContext } from '@/components/three/context/ViewportContext'
import { TetheredCard } from '@/components/three/experiences/TetheredCard'
import { Environment } from '@/components/three/components'
import { calculateCardPosition } from '@/components/three/utils/threeHelpers'

const TetheredCardWrapper = () => {
  const { viewport } = useThree()
  const { isMobile } = useViewportContext()
  const initialPosition = calculateCardPosition(viewport, isMobile)

  return <TetheredCard position={initialPosition} />
}

// Physics and visible content container
const SceneContent = () => {
  const { isVisible } = useViewportContext()

  if (!isVisible) return null

  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <TetheredCardWrapper />
    </Physics>
  )
}

export const ViewportManager = () => {
  const { isMobile } = useViewportContext()
  const { viewport } = useThree()
  const cardPosition = calculateCardPosition(viewport, isMobile)

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Environment cardPosition={cardPosition} />
      <SceneContent />
    </Suspense>
  )
}
