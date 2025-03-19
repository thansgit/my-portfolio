'use client'

import React, { Suspense, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useViewportContext } from '@/components/three/context/ViewportContext'
import { useTetheredCardContext } from '@/components/three/context'
import { TetheredCard } from '@/components/three/experiences/TetheredCard'
import { Environment } from '@/components/three/components'
import * as THREE from 'three'
import { MOBILE_OFFSET, DESKTOP_OFFSET } from '@/components/three/utils/constants'

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
 * TetheredCardManager handles the tethered card experience,
 * including positioning, physics, lighting, environment setup, and visibility
 */
export const TetheredCardManager: React.FC = () => {
  const { isMobile, isResizing } = useViewportContext()
  const { viewport } = useThree()
  const { setCardExperiencePosition, setIsVisible } = useTetheredCardContext()

  // Handle visibility based on device type and state
  useEffect(() => {
    // Always hide during resize
    if (isResizing) {
      setIsVisible(false)
      return
    }

    if (!isMobile) {
      return
    }

    // Mobile: Handle scroll-based visibility
    const updateVisibility = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const scrollThreshold = viewportHeight * 0.5
      const shouldBeVisible = scrollY < scrollThreshold
      setIsVisible(shouldBeVisible)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
    }
  }, [isMobile, isResizing, setIsVisible])

  // Calculate card position when viewport changes
  useEffect(() => {
    // Skip position updates during resize
    if (isResizing) return

    // Wait for physics to settle after resize ends, then calculate position
    const physicsSettleTimer = setTimeout(() => {
      const [x, y, z] = calculateCardPosition(viewport, isMobile)
      setCardExperiencePosition(new THREE.Vector3(x, y, z))
      setIsVisible(true)
    }, 250) // Wait for physics to settle

    return () => clearTimeout(physicsSettleTimer)
  }, [viewport, isMobile, isResizing])

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
