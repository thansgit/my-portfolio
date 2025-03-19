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
  const { isMobile, isResizing, setIsResizing } = useViewportContext()
  const { viewport } = useThree()
  const { setCardExperiencePosition } = useTetheredCardContext()
  const positionUpdateQueued = useRef(false)
  const physicsSettleTimer = useRef<NodeJS.Timeout | null>(null)

  // Enhanced position calculation with proper physics timing
  useEffect(() => {
    // First, set resizing state to true and clear any pending updates
    setIsResizing(true)
    positionUpdateQueued.current = true

    if (physicsSettleTimer.current) {
      clearTimeout(physicsSettleTimer.current)
    }

    // Stage 1: Initial delay to let the viewport update fully
    const stageOneDelay = setTimeout(() => {
      // Calculate position first time
      const [x, y, z] = calculateCardPosition(viewport, isMobile)
      setCardExperiencePosition(new THREE.Vector3(x, y, z))

      // Stage 2: Wait for physics to initialize (longer delay)
      physicsSettleTimer.current = setTimeout(() => {
        // Calculate position again after physics have settled
        const [finalX, finalY, finalZ] = calculateCardPosition(viewport, isMobile)
        setCardExperiencePosition(new THREE.Vector3(finalX, finalY, finalZ))

        // Mark physics as settled and clear resize state
        setIsResizing(false)
        positionUpdateQueued.current = false
      }, 300) // Physics needs more time to settle
    }, 100)

    return () => {
      clearTimeout(stageOneDelay)
      if (physicsSettleTimer.current) {
        clearTimeout(physicsSettleTimer.current)
      }
    }
  }, [isMobile, viewport, setCardExperiencePosition, setIsResizing])

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
