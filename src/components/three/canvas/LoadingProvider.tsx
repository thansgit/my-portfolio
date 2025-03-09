"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

interface LoadingContextType {
  isLoaded: boolean;
  progress: number;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoaded: false,
  progress: 0
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { progress, loaded, active } = useProgress();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // When all Three.js resources are loaded, set isLoaded to true
  useEffect(() => {
    // If loaded is true or there are no active loadings, mark as loaded
    if (loaded || (progress > 0 && !active)) {
      // Small delay ensures everything is definitely ready
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loaded, progress, active]);
  
  // Timeout as a fallback, if loading doesn't complete for some reason
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