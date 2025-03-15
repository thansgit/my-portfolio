'use client'

import React from 'react'
import { useLoading } from '@/components/three'

export const ThreeDLoadingIndicators: React.FC = () => {
  const { isLoaded, progress } = useLoading()

  // Don't render when content is loaded
  if (isLoaded) return null

  return (
    <>
      {/* Top indicator - shows position of 3D content in viewport */}
      <div
        className={`border-neu-bgLight/30 bg-neu-bgDark/70 absolute left-1/2 top-[200px] z-50 flex aspect-square h-16 w-16 -translate-x-1/2 flex-col items-center justify-center rounded-full border shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 md:left-[calc(25%-100px)] md:top-[20vh] md:translate-x-0`}
      >
        {/* Visual attention indicator */}
        <div className='bg-neu-accent mb-1 h-2.5 w-2.5 animate-pulse rounded-full shadow-[0_0_8px_rgba(231,190,69,0.4)]' />

        <div className='text-neu-text text-center text-xs font-medium'>3D</div>

        {/* Circular progress indicator */}
        <div className='absolute inset-1.5'>
          <svg className='h-full w-full -rotate-90' viewBox='0 0 100 100'>
            <circle cx='50' cy='50' r='42' fill='none' stroke='#3f3f4620' strokeWidth='2' />

            <circle
              cx='50'
              cy='50'
              r='42'
              fill='none'
              stroke='rgba(231,190,69,0.6)'
              strokeWidth='2'
              strokeDasharray='264'
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap='round'
              className='drop-shadow-[0_0_1px_rgba(231,190,69,0.5)] filter'
            />
          </svg>
        </div>
      </div>

      {/* Bottom indicator - ensures user is informed of loading progress */}
      <div
        className={`border-neu-bgLight/50 bg-neu-bgDark/90 text-neu-text fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm transition-opacity duration-300`}
      >
        <div className='bg-neu-accent h-2 w-2 animate-pulse rounded-full'></div>
        <span>Loading 3D Experience ({Math.round(progress)}%)</span>
      </div>
    </>
  )
}
