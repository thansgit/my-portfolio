'use client'

import React, { useEffect, useState } from 'react'
import { useLoading } from '@/components/three'

export const SplashScreen: React.FC = () => {
  const { isLoaded, progress } = useLoading()
  const [fadeOut, setFadeOut] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      setFadeOut(true)

      // Remove splash screen completely from DOM after fade-out animation
      const timer = setTimeout(() => {
        setRemoved(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  // Timeout as a fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setRemoved(true), 500)
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  if (removed) return null

  return (
    <div
      className={`/* [Splash Container] Full-screen splash overlay with animation */ fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 transition-opacity duration-300 fade-out ${fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'} `}
    >
      <div className='text-center'>
        <h1 className='mb-4 text-4xl font-bold text-white'>Timo Hanski</h1>
        <p className='mb-6 text-zinc-400'>Portfolio</p>

        {/* Loading progress bar */}
        <div className='mx-auto h-1 w-48 overflow-hidden rounded-full bg-zinc-800'>
          <div
            className={`/* [Progress Bar] Animated loading progress indicator */ h-full bg-yellow-500 transition-all duration-300 ease-out`}
            style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
          />
        </div>
      </div>
    </div>
  )
}
