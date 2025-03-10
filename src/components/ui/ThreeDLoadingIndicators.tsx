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
          fixed z-50 transition-all duration-300 ease-out
          top-[400px] md:top-[20vh]
          left-1/2 md:left-[calc(25%-100px)] -translate-x-1/2 md:translate-x-0
          bg-zinc-800/90 backdrop-blur-sm rounded-full
          shadow-lg border border-zinc-700/50 text-zinc-200
          flex flex-col items-center justify-center
          h-20 w-20 aspect-square
        `}
      >
        {/* Pulsing dot */}
        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse mb-1.5" />
        
        {/* 3D text */}
        <div className="text-xs font-medium text-center">3D</div>
        
        {/* Circular progress indicator */}
        <div className="absolute inset-1.5">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="#3f3f46" 
              strokeWidth="3" 
            />
            
            {/* Progress */}
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="#eab308" 
              strokeWidth="3" 
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap="round"
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