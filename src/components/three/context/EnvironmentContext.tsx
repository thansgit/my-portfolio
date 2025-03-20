'use client'

import React, { createContext, useContext, useState, useMemo } from 'react'
import { EnvironmentContextState } from '../utils/types'

// Types and Interfaces
// Note: Main interface is imported from utils/types

// Default context values
const defaultState: EnvironmentContextState = {
  ambientLightIntensity: 0.5,
  cardPosition: undefined,
}

// Context creation
export const EnvironmentContext = createContext<EnvironmentContextState>(defaultState)

// Custom hook with error checking
export const useEnvironment = () => {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider')
  }
  return context
}

// Provider props interface
interface EnvironmentProviderProps {
  children: React.ReactNode
  initialCardPosition?: [number, number, number]
  ambientLightIntensity?: number
}

// Provider component
export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({
  children,
  initialCardPosition,
  ambientLightIntensity = 0.5,
}) => {
  // State declarations
  const [cardPosition, setCardPosition] = useState<[number, number, number] | undefined>(initialCardPosition)

  // Memoized context value
  const contextValue = useMemo<EnvironmentContextState>(
    () => ({
      // Lighting
      ambientLightIntensity,

      // Positions
      cardPosition,
    }),
    [ambientLightIntensity, cardPosition]
  )

  return <EnvironmentContext.Provider value={contextValue}>{children}</EnvironmentContext.Provider>
}
