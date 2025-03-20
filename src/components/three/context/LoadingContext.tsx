'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'

// Types and Interfaces
/**
 * Context for tracking loading state of 3D assets
 */
export interface LoadingContextType {
  isLoaded: boolean
  progress: number
  setLoaded: (isLoaded: boolean) => void
  setProgress: (progress: number) => void
}

// Default context values
const defaultState: LoadingContextType = {
  isLoaded: false,
  progress: 0,
  setLoaded: () => {},
  setProgress: () => {},
}

// Context creation
export const LoadingContext = createContext<LoadingContextType>(defaultState)

// Custom hook with error checking
/**
 * Hook for accessing the loading state of 3D assets
 * @returns LoadingContextType object with isLoaded and progress properties
 */
export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

// Provider props interface
interface LoadingProviderProps {
  children: ReactNode
}

// Provider component
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  // State declarations
  const [isLoaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  // Memoized callbacks
  const setLoadedMemo = useCallback((value: boolean) => {
    setLoaded(value)
  }, [])

  const setProgressMemo = useCallback((value: number) => {
    setProgress(value)
  }, [])

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      isLoaded,
      progress,
      setLoaded: setLoadedMemo,
      setProgress: setProgressMemo,
    }),
    [isLoaded, progress, setLoadedMemo, setProgressMemo]
  )

  return (
    <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>
  )
}
