'use client'

import React, { Suspense, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useViewportContext } from '@/components/three/context/ViewportContext'
import { useTetheredCardContext } from '@/components/three/context'
import { TetheredCard } from '@/components/three/experiences/TetheredCard'
import { Environment } from '@/components/three/components'
import * as THREE from 'three'
import { MOBILE_OFFSET } from '@/components/three/utils/constants'
import { DESKTOP_OFFSET } from '@/components/three/utils/constants'

// Wrapper component for the TetheredCard element
const TetheredCardWrapper = () => {
  const { cardExperiencePosition } = useTetheredCardContext()

  // Pass a test color to see the transparent areas colored
  return (
    <TetheredCard
      position={[cardExperiencePosition.x, cardExperiencePosition.y, cardExperiencePosition.z]}
      transparentColor='#D35400'
    />
  )
}

// Physics and visible content container
const SceneContent = () => {
  const { isVisible, isResizing } = useViewportContext()

  if (!isVisible || isResizing) {
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
  const { isMobile, setIsResizing } = useViewportContext()
  const { viewport } = useThree()
  const { setCardExperiencePosition } = useTetheredCardContext()

  //Wait for resize to happen to get the physics ready, otherwise the position is not correctly calculated
  useEffect(() => {
    setIsResizing(true)

    const timer = setTimeout(() => {
      const [x, y, z] = calculateCardPosition(viewport, isMobile)
      setCardExperiencePosition(new THREE.Vector3(x, y, z))
      setIsResizing(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [isMobile, setCardExperiencePosition, setIsResizing])

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Environment />
      <SceneContent />
    </Suspense>
  )
}

export const calculateCardPosition = (
  viewport: { width: number; height: number },
  isMobile: boolean,
): [number, number, number] => {
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2)
  return [xPosition, 2.5, 0]
}
