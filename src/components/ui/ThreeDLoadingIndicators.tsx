"use client";

import React from 'react';
import { useLoading } from '@/components/three';

export const ThreeDLoadingIndicators: React.FC = () => {
  const { isLoaded, progress } = useLoading();
  
  // Don't render when content is loaded
  if (isLoaded) return null;
  
  return (
    <>
      {/* Side/Top indicator - circular design */}
      <div 
        className={`
          absolute z-50 transition-all duration-300 ease-out
          top-[200px] md:top-[20vh]
          left-1/2 md:left-[calc(25%-100px)] -translate-x-1/2 md:translate-x-0
          bg-zinc-800/70 backdrop-blur-md rounded-full
          shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-zinc-600/30
          flex flex-col items-center justify-center
          h-16 w-16 aspect-square
          hover:scale-105
        `}
      >
        {/* Pulsing dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90 animate-pulse mb-1 shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
        
        {/* 3D text */}
        <div className="text-xs font-medium text-center text-zinc-100/90">3D</div>
        
        {/* Circular progress indicator */}
        <div className="absolute inset-1.5">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="#3f3f4620" 
              strokeWidth="2" 
            />
            
            {/* Progress */}
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="rgba(251,191,36,0.6)" 
              strokeWidth="2" 
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_1px_rgba(251,191,36,0.5)]"
            />
          </svg>
        </div>
      </div>
      
      {/* Bottom right indicator - simple pill with percentage */}
      <div 
        className={`
          fixed z-50 bottom-4 right-4 transition-opacity duration-300
          bg-zinc-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full
          shadow-lg border border-zinc-700/50 text-zinc-200
          flex items-center gap-1.5 text-xs
        `}
      >
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
        <span>Loading 3D Experience ({Math.round(progress)}%)</span>
      </div>
    </>
  );
}; 