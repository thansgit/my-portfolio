'use client'

import React, { createContext, useContext, ReactNode, useState } from 'react'
import { CARD_DEFAULT_MAX_SPEED, CARD_DEFAULT_MIN_SPEED } from '../utils/constants'

// Only include values that need to be adjustable at runtime
type CardPhysicsConfig = {
  maxSpeed: number
  minSpeed: number
}

// Simplified context type that includes update functions
type ConfigContextType = {
  cardPhysics: CardPhysicsConfig
  updateCardPhysics: (physics: Partial<CardPhysicsConfig>) => void
}

// Create the context with default values and a no-op update function
export const ConfigContext = createContext<ConfigContextType>({
  cardPhysics: {
    maxSpeed: CARD_DEFAULT_MAX_SPEED,
    minSpeed: CARD_DEFAULT_MIN_SPEED,
  },
  updateCardPhysics: () => {},
})

interface ConfigProviderProps {
  children: ReactNode
  initialCardPhysics?: Partial<CardPhysicsConfig>
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children, initialCardPhysics }) => {
  // Initialize state with defaults or custom initial values
  const [cardPhysics, setCardPhysics] = useState<CardPhysicsConfig>({
    maxSpeed: CARD_DEFAULT_MAX_SPEED,
    minSpeed: CARD_DEFAULT_MIN_SPEED,
    ...initialCardPhysics,
  })

  // Function to update card physics at runtime
  const updateCardPhysics = (physics: Partial<CardPhysicsConfig>) => {
    setCardPhysics((prev) => ({ ...prev, ...physics }))
  }

  return (
    <ConfigContext.Provider
      value={{
        cardPhysics,
        updateCardPhysics,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

// Custom hook to use the config context
export const useConfigContext = () => {
  return useContext(ConfigContext)
}
