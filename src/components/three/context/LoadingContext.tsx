'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

/**
 * Context for tracking loading state of 3D assets
 */
export interface LoadingContextType {
  isLoaded: boolean
  progress: number
  setLoaded: (isLoaded: boolean) => void
  setProgress: (progress: number) => void
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoaded: false,
  progress: 0,
  setLoaded: () => {},
  setProgress: () => {},
})

interface LoadingProviderProps {
  children: ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  return (
    <LoadingContext.Provider value={{ isLoaded, progress, setLoaded, setProgress }}>{children}</LoadingContext.Provider>
  )
}

/**
 * Hook for accessing the loading state of 3D assets
 * @returns LoadingContextType object with isLoaded and progress properties
 */
export const useLoading = () => useContext(LoadingContext)
