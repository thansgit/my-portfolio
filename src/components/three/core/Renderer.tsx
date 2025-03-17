'use client'

import React, { ReactNode } from 'react'
import { useThree } from '@react-three/fiber'

interface RendererProps {
  children: ReactNode
}

/**
 * Configures the renderer settings
 */
export const Renderer: React.FC<RendererProps> = ({ children }) => {
  const { gl } = useThree()

  // Apply renderer optimizations
  React.useEffect(() => {
    if (gl) {
      // Optimize renderer
      gl.setClearColor(0x000000, 0) // Transparent background
      gl.setPixelRatio(window.devicePixelRatio)

      // Enable shadow maps
      gl.shadowMap.enabled = true
      gl.shadowMap.type = 2 // PCFSoftShadowMap

      // Add any other renderer configurations here
    }
  }, [gl])

  return <>{children}</>
}
