'use client'

import React, { Suspense, lazy, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useLoading } from '@/components/three/context'

interface CanvasProviderProps {
  children: ReactNode
}

/**
 * Main Canvas Provider that sets up the Three.js rendering context
 */
export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const { isLoaded } = useLoading()

  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      className='absolute h-full w-full'
      resize={{ scroll: false }}
      dpr={[1, 2]}
      gl={{
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        alpha: true,
        antialias: true,
        precision: 'highp',
      }}
      style={{
        pointerEvents: 'auto',
        background: 'transparent',
        // Hide any rendering artifacts during loading
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      {process.env.NODE_ENV === 'development' && <Perf position='top-left' />}
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
