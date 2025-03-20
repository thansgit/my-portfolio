'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { CARD_DEFAULT_MAX_SPEED, CARD_DEFAULT_MIN_SPEED } from '../utils/constants'

// Types and Interfaces
type CardPhysicsConfig = {
  maxSpeed: number
  minSpeed: number
}

interface ConfigContextType {
  cardPhysics: CardPhysicsConfig
  updateCardPhysics: (physics: Partial<CardPhysicsConfig>) => void
}

// Default context values
const defaultState: ConfigContextType = {
  cardPhysics: {
    maxSpeed: CARD_DEFAULT_MAX_SPEED,
    minSpeed: CARD_DEFAULT_MIN_SPEED,
  },
  updateCardPhysics: () => {},
}

// Context creation
export const ConfigContext = createContext<ConfigContextType>(defaultState)

// Custom hook with error checking
export const useConfigContext = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider')
  }
  return context
}

// Provider props interface
interface ConfigProviderProps {
  children: React.ReactNode
  initialCardPhysics?: Partial<CardPhysicsConfig>
}

// Provider component
export const ConfigProvider: React.FC<ConfigProviderProps> = ({ 
  children, 
  initialCardPhysics 
}) => {
  // State declarations
  const [cardPhysics, setCardPhysics] = useState<CardPhysicsConfig>({
    maxSpeed: CARD_DEFAULT_MAX_SPEED,
    minSpeed: CARD_DEFAULT_MIN_SPEED,
    ...initialCardPhysics,
  })

  // Memoized callbacks
  const updateCardPhysics = useCallback((physics: Partial<CardPhysicsConfig>) => {
    setCardPhysics((prev) => ({ ...prev, ...physics }))
  }, [])

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      cardPhysics,
      updateCardPhysics,
    }),
    [cardPhysics, updateCardPhysics]
  )

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  )
}
