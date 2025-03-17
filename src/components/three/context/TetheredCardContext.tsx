'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import * as THREE from 'three'
import { TetheredCardContextState } from '../utils/types'

// Create the context
export const TetheredCardContext = createContext<TetheredCardContextState | null>(null)

interface TetheredCardProviderProps {
  children: ReactNode
  initialCardPosition?: [number, number, number]
}

export const TetheredCardProvider: React.FC<TetheredCardProviderProps> = ({
  children,
  initialCardPosition = [0, 0, 0],
}) => {
  // Experience position (for viewport layout)
  const [cardExperiencePosition, setCardExperiencePosition] = useState<THREE.Vector3>(
    new THREE.Vector3(...initialCardPosition),
  )

  const [cardRotationCount, setCardRotationCount] = useState(0)

  // Rope visuals
  const [ropeColor, setRopeColor] = useState('#000000')
  const [ropeRadius, setRopeRadius] = useState(0.04) // Default from constants

  const contextValue: TetheredCardContextState = {
    // State
    cardExperiencePosition,
    cardRotationCount,
    ropeColor,
    ropeRadius,

    // Handlers
    setCardExperiencePosition,
    setCardRotationCount,
    setRopeColor,
    setRopeRadius,
  }

  return <TetheredCardContext.Provider value={contextValue}>{children}</TetheredCardContext.Provider>
}

// Custom hook to use the context
export const useTetheredCardContext = () => {
  const context = useContext(TetheredCardContext)
  if (!context) {
    throw new Error('useTetheredCardContext must be used within a TetheredCardProvider')
  }
  return context
}
