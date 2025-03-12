import { createContext, useContext } from 'react'

/**
 * Context for tracking loading state of 3D assets
 */
export interface LoadingContextType {
  isLoaded: boolean
  progress: number
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoaded: false,
  progress: 0,
})

/**
 * Hook for accessing the loading state of 3D assets
 * @returns LoadingContextType object with isLoaded and progress properties
 */
export const useLoading = () => useContext(LoadingContext)
