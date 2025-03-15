'use client'

import React, { useEffect, Suspense } from 'react'
import { useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import { ViewportContext, useViewport, useEnvironment, useSceneContext } from '@/components/three/hooks'
import { MOBILE_OFFSET, DESKTOP_OFFSET } from '../utils/constants'
import { TetheredCard } from '@/components/three/experiences/TetheredCard'
import { Environment } from '@/components/three/shared'

// Wrapper component for the TetheredCard element
const TetheredCardWrapper = () => {
  const { viewport } = useThree()
  const { isMobile } = useViewport()
  const { updatePinheadState } = useEnvironment()
  const { setCardPosition, setPinheadPosition, setCardGlowing } = useSceneContext()

  // Calculate position based on device type
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2)
  const initialPosition: [number, number, number] = [xPosition, 2.5, 0]

  // Handle pinhead state changes from the card
  const handlePinheadStateChange = (position: [number, number, number], isGlowing: boolean) => {
    // Update environment context (for lighting)
    updatePinheadState(position, isGlowing)

    // Update scene context (for shared state)
    setPinheadPosition(new THREE.Vector3().fromArray(position))
    setCardGlowing(isGlowing)
  }

  return <TetheredCard position={initialPosition} onPinheadStateChange={handlePinheadStateChange} />
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
  const { updatePinheadState } = useEnvironment()

  // Calculate card position for environment lighting
  const isMobile = viewportState.isMobile
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2)
  const cardPosition: [number, number, number] = [xPosition, 2.5, 0]

  // Turn off glowing when content becomes invisible
  useEffect(() => {
    if (!viewportState.isVisible) {
      updatePinheadState([0, 0, 0], false)
    }
  }, [viewportState.isVisible, updatePinheadState])

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
