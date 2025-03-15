'use client'

import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useViewport } from '@/components/three/hooks'

interface CameraManagerProps {
  initialPosition?: [number, number, number]
  fov?: number
  children?: React.ReactNode
}

/**
 * Manages camera settings and transformations
 */
export const CameraManager: React.FC<CameraManagerProps> = ({ initialPosition = [0, 0, 13], fov = 25, children }) => {
  const { camera, size } = useThree()
  const { isMobile } = useViewport()
  const cameraRef = useRef<THREE.PerspectiveCamera>()

  // Set initial camera position and properties
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(...initialPosition)
      camera.fov = fov
      camera.updateProjectionMatrix()
      cameraRef.current = camera
    }
  }, [camera, initialPosition, fov])

  // Adjust camera for viewport changes
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      // Add any responsive camera adjustments here
      if (isMobile) {
        // Mobile-specific camera adjustments
      } else {
        // Desktop-specific camera adjustments
      }
      camera.updateProjectionMatrix()
    }
  }, [camera, isMobile, size])

  return <>{children}</>
}
