'use client'

import React, { useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { useLoading } from '@/components/three/context'

export const LoadingTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { progress, loaded, active } = useProgress()
  const { setLoaded, setProgress } = useLoading()

  // Update progress in real-time
  useEffect(() => {
    setProgress(progress)
  }, [progress, setProgress])

  // Update loaded state when appropriate
  useEffect(() => {
    if (loaded || (progress >= 100 && !active)) {
      // Small delay ensures everything is definitely ready
      const timer = setTimeout(() => {
        console.log('3D content loaded via drei progress!')
        setLoaded(true)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [loaded, progress, active, setLoaded])

  // Fallback timeout in case loading gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('3D content loaded via fallback timeout!')
      setLoaded(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [setLoaded])

  return <>{children}</>
}
