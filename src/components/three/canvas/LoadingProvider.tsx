"use client";

import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { LoadingContext } from '@/components/three/hooks';

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { progress, loaded, active } = useProgress();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (loaded || (progress > 0 && !active)) {
      // Small delay ensures everything is definitely ready
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loaded, progress, active]);
  
  // Fallback timeout in case loading gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 5000); 
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <LoadingContext.Provider value={{ isLoaded, progress }}>
      {children}
    </LoadingContext.Provider>
  );
}; 