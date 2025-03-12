'use client'

import React from 'react'
import { useLoading } from '@/components/three'

export const ThreeDLoadingIndicators: React.FC = () => {
  const { isLoaded, progress } = useLoading()

  // Don't render when content is loaded
  if (isLoaded) return null

  return (
    <>
      {/* Side/Top indicator - circular design */}
      <div
        className={`absolute left-1/2 top-[200px] z-50 flex aspect-square h-16 w-16 -translate-x-1/2 flex-col items-center justify-center rounded-full border border-zinc-600/30 bg-zinc-800/70 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 md:left-[calc(25%-100px)] md:top-[20vh] md:translate-x-0`}
      >
        {/* Pulsing dot */}
        <div className='mb-1 h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400/90 shadow-[0_0_8px_rgba(251,191,36,0.4)]' />

        {/* 3D text */}
        <div className='text-center text-xs font-medium text-zinc-100/90'>3D</div>

        {/* Circular progress indicator */}
        <div className='absolute inset-1.5'>
          <svg className='h-full w-full -rotate-90' viewBox='0 0 100 100'>
            {/* Track */}
            <circle cx='50' cy='50' r='42' fill='none' stroke='#3f3f4620' strokeWidth='2' />

            {/* Progress */}
            <circle
              cx='50'
              cy='50'
              r='42'
              fill='none'
              stroke='rgba(251,191,36,0.6)'
              strokeWidth='2'
              strokeDasharray='264'
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap='round'
              className='drop-shadow-[0_0_1px_rgba(251,191,36,0.5)] filter'
            />
          </svg>
        </div>
      </div>

      {/* Bottom right indicator - simple pill with percentage */}
      <div
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-800/90 px-3 py-1.5 text-xs text-zinc-200 shadow-lg backdrop-blur-sm transition-opacity duration-300`}
      >
        <div className='h-2 w-2 animate-pulse rounded-full bg-yellow-500'></div>
        <span>Loading 3D Experience ({Math.round(progress)}%)</span>
      </div>
    </>
  )
}
