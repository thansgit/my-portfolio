'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import * as THREE from 'three'
import { SceneContextState } from '../utils/types'

// Create the context
export const SceneContext = createContext<SceneContextState | null>(null)

interface SceneProviderProps {
  children: ReactNode
  initialCardPosition?: [number, number, number]
}

export const SceneProvider: React.FC<SceneProviderProps> = ({ children, initialCardPosition = [0, 0, 0] }) => {
  // Card position and state
  const [cardPosition, setCardPosition] = useState<THREE.Vector3>(new THREE.Vector3(...initialCardPosition))
  const [pinheadPosition, setPinheadPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(initialCardPosition[0], initialCardPosition[1] + 0.18, initialCardPosition[2]),
  )
  const [isCardGlowing, setCardGlowing] = useState(false)
  const [cardRotationCount, setCardRotationCount] = useState(0)

  // Rope visuals
  const [ropeColor, setRopeColor] = useState('#000000')
  const [ropeRadius, setRopeRadius] = useState(0.04) // Default from constants

  // Update handlers
  const incrementCardRotation = () => {
    setCardRotationCount((prev) => prev + 1)
  }

  const updateRopeVisuals = (color: string, radius: number) => {
    setRopeColor(color)
    setRopeRadius(radius)
  }

  const contextValue: SceneContextState = {
    // State
    cardPosition,
    pinheadPosition,
    isCardGlowing,
    cardRotationCount,
    ropeColor,
    ropeRadius,

    // Handlers
    setCardPosition,
    setPinheadPosition,
    setCardGlowing,
    incrementCardRotation,
    updateRopeVisuals,
  }

  return <SceneContext.Provider value={contextValue}>{children}</SceneContext.Provider>
}

// Custom hook to use the scene context
export const useSceneContext = () => {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error('useSceneContext must be used within a SceneProvider')
  }
  return context
}
