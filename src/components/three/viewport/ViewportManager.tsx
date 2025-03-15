'use client'

import React, { useEffect, Suspense } from 'react'
import { useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { ViewportContext, useViewport } from '@/components/three/hooks'
import { MOBILE_OFFSET, DESKTOP_OFFSET } from '../utils/constants'
import { TetheredCard } from '@/components/three/experiences/TetheredCard'
import { Environment } from '@/components/three/components'

// Helper function to calculate card position based on viewport and device type
const calculateCardPosition = (
  viewport: { width: number; height: number },
  isMobile: boolean,
): [number, number, number] => {
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2)
  return [xPosition, 2.5, 0]
}

// Wrapper component for the TetheredCard element
const TetheredCardWrapper = () => {
  const { viewport } = useThree()
  const { isMobile } = useViewport()
  const initialPosition = calculateCardPosition(viewport, isMobile)

  return <TetheredCard position={initialPosition} />
}

// Physics and visible content container
const SceneContent = () => {
  const { isVisible } = useViewport()

  if (!isVisible) return null

  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <TetheredCardWrapper />
    </Physics>
  )
}

export const ViewportManager = () => {
  const viewportState = useViewport()
  const { viewport } = useThree()
  const cardPosition = calculateCardPosition(viewport, viewportState.isMobile)

  return (
    <ViewportContext.Provider value={viewportState}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Environment cardPosition={cardPosition} />
        <SceneContent />
      </Suspense>
    </ViewportContext.Provider>
  )
}
