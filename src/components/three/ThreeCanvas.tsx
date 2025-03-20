'use client'

import React, { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { ConfigProvider, EnvironmentProvider, TetheredCardProvider, useLoading } from './context'
import { ViewportProvider } from './context/ViewportContext'
import { CameraManager, TetheredCardManager } from './core'
import { LoadingTracker } from './core/LoadingTracker'

/**
 * Renderer configuration component
 */
const RendererSettings = () => {
  const { gl } = useThree()

  // Apply renderer optimizations
  useEffect(() => {
    if (gl) {
      // Optimize renderer
      gl.setClearColor(0x000000, 0) // Transparent background
      gl.setPixelRatio(window.devicePixelRatio)
    }
  }, [gl])

  return null
}

/**
 * Main Three.js canvas component
 */
export const ThreeCanvas = () => {
  const { isLoaded } = useLoading()

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <LoadingTracker>
        <Canvas
          camera={{ position: [0, 0, 13], fov: 25 }}
          className='absolute h-full w-full'
          resize={{ scroll: false }}
          dpr={[1, 2]}
          gl={{
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            antialias: true,
            precision: 'highp',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            background: 'transparent',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          {process.env.NODE_ENV === 'development' && <Perf position='top-left' />}
          <Suspense fallback={null}>
            <RendererSettings />
            <ConfigProvider>
              <EnvironmentProvider ambientLightIntensity={0.5}>
                <ViewportProvider>
                  <TetheredCardProvider>
                    <CameraManager>
                      <TetheredCardManager />
                    </CameraManager>
                  </TetheredCardProvider>
                </ViewportProvider>
              </EnvironmentProvider>
            </ConfigProvider>
          </Suspense>
        </Canvas>
      </LoadingTracker>
    </div>
  )
}
