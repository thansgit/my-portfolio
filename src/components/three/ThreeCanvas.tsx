'use client'

import React, { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { ConfigProvider, EnvironmentProvider, SceneProvider, useLoading } from './context'
import { ViewportProvider } from './hooks'
import { CameraManager, SceneManager } from './core'
import { LoadingTracker } from './viewport/ThreeLoadingTracker'

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

      // Enable shadow maps
      gl.shadowMap.enabled = true
      gl.shadowMap.type = 2 // PCFSoftShadowMap
    }
  }, [gl])

  return null
}

/**
 * Main Scene component that sets up the Three.js environment
 * with all providers in the correct order
 */
export const Scene = () => {
  const { isLoaded } = useLoading()

  return (
    <div className='fixed inset-0 h-screen w-screen overflow-hidden'>
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
            pointerEvents: 'auto',
            background: 'transparent',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          {process.env.NODE_ENV === 'development' && <Perf position='top-left' />}
          <Suspense fallback={null}>
            <RendererSettings />
            <ConfigProvider>
              <EnvironmentProvider ambientLightIntensity={0.5}>
                <SceneProvider>
                  <ViewportProvider>
                    <CameraManager>
                      <SceneManager />
                    </CameraManager>
                  </ViewportProvider>
                </SceneProvider>
              </EnvironmentProvider>
            </ConfigProvider>
          </Suspense>
        </Canvas>
      </LoadingTracker>
    </div>
  )
}
