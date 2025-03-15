'use client'

import React, { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { EnvironmentProvider, ConfigProvider, SceneProvider } from '@/components/three/hooks'
import { LoadingProvider } from './LoadingProvider'

// Lazy load the ViewportManager component
const ViewportManager = lazy(() => import('./ViewportManager').then((mod) => ({ default: mod.ViewportManager })))

export const Scene = () => (
  <div className='fixed inset-0 h-screen w-screen overflow-hidden'>
    <LoadingProvider>
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
        }}
      >
        {process.env.NODE_ENV === 'development' && <Perf position='top-left' />}
        <Suspense fallback={null}>
          {/* Context hierarchy:
              1. Config (app-wide settings)
              2. Environment (environment state)
              3. Scene (shared visual state) 
              4. ViewportManager (handles viewport specifics)
          */}
          <ConfigProvider>
            <EnvironmentProvider ambientLightIntensity={0.5}>
              <SceneProvider>
                <ViewportManager />
              </SceneProvider>
            </EnvironmentProvider>
          </ConfigProvider>
        </Suspense>
      </Canvas>
    </LoadingProvider>
  </div>
)
