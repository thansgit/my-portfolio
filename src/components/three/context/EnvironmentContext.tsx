'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { EnvironmentContextState } from '../utils/types'

// Create context with default values
export const EnvironmentContext = createContext<EnvironmentContextState | null>(null)

interface EnvironmentProviderProps {
  children: ReactNode
  initialCardPosition?: [number, number, number]
  ambientLightIntensity?: number
}

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({
  children,
  initialCardPosition,
  ambientLightIntensity = 0.5,
}) => {
  // Environment state
  const [cardPosition, setCardPosition] = useState<[number, number, number] | undefined>(initialCardPosition)

  const contextValue: EnvironmentContextState = {
    // Lighting
    ambientLightIntensity,

    // Positions
    cardPosition,
  }

  return <EnvironmentContext.Provider value={contextValue}>{children}</EnvironmentContext.Provider>
}

// Custom hook to use the environment context
export const useEnvironment = () => {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider')
  }
  return context
}
