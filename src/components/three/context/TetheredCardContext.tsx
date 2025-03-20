'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useViewportContext } from './ViewportContext'
import { MOBILE_OFFSET, DESKTOP_OFFSET, MOBILE_BREAKPOINT } from '../utils/constants'

// Types and Interfaces
export interface TetheredCardContextState {
  cardExperiencePosition: THREE.Vector3
  currentTextureIndex: number
  ropeColor: string
  ropeRadius: number
  isVisible: boolean

  setCardExperiencePosition: (position: THREE.Vector3) => void
  setCurrentTextureIndex: (index: number) => void
  setRopeColor: (color: string) => void
  setRopeRadius: (radius: number) => void
  setIsVisible: (value: boolean) => void
}

// Helper function to calculate card position
export const calculateCardPosition = (viewport: { width: number; height: number }): [number, number, number] => {
  // Directly determine if mobile based on current window width
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT
  console.log(`[calculateCardPosition] Using device type: ${isMobile ? 'mobile' : 'desktop'}`)

  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2)
  return [xPosition, 2.5, 0]
}

// Default context values
const defaultState: TetheredCardContextState = {
  cardExperiencePosition: new THREE.Vector3(0, 0, 0),
  currentTextureIndex: 0,
  ropeColor: '#000000',
  ropeRadius: 0.04,
  isVisible: false,

  setCardExperiencePosition: () => {},
  setCurrentTextureIndex: () => {},
  setRopeColor: () => {},
  setRopeRadius: () => {},
  setIsVisible: () => {},
}

export const TetheredCardContext = createContext<TetheredCardContextState>(defaultState)

export const useTetheredCardContext = () => {
  const context = useContext(TetheredCardContext)
  if (!context) {
    throw new Error('useTetheredCardContext must be used within a TetheredCardProvider')
  }
  return context
}

interface TetheredCardProviderProps {
  children: React.ReactNode
  initialCardPosition?: [number, number, number]
  initialIsVisible?: boolean
}

export const TetheredCardProvider: React.FC<TetheredCardProviderProps> = ({
  children,
  initialCardPosition = [0, 0, 0],
  initialIsVisible = false,
}) => {
  const { isMobile, isResizing } = useViewportContext()
  const { viewport } = useThree()

  const [cardExperiencePosition, setCardExperiencePosition] = useState<THREE.Vector3>(
    new THREE.Vector3(...initialCardPosition),
  )
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(initialIsVisible)
  const [ropeColor, setRopeColor] = useState('#000000')
  const [ropeRadius, setRopeRadius] = useState(0.04) // Default from constants

  // Memoized callbacks
  const setCardExperiencePositionMemo = useCallback((position: THREE.Vector3) => {
    setCardExperiencePosition(position)
  }, [])

  const setCurrentTextureIndexMemo = useCallback((index: number) => {
    setCurrentTextureIndex(index)
  }, [])

  const setIsVisibleMemo = useCallback((value: boolean) => {
    setIsVisible(value)
  }, [])

  const setRopeColorMemo = useCallback((color: string) => {
    setRopeColor(color)
  }, [])

  const setRopeRadiusMemo = useCallback((radius: number) => {
    setRopeRadius(radius)
  }, [])

  // Create or ensure observer target element exists
  // Handle visibility based on device type and state
  useEffect(() => {
    // Always hide during resize
    if (isResizing) {
      setIsVisible(false)
      return
    }

    if (!isMobile) {
      return
    }

    // Mobile: Handle scroll-based visibility
    const updateVisibility = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const scrollThreshold = viewportHeight * 0.5
      const shouldBeVisible = scrollY < scrollThreshold
      setIsVisible(shouldBeVisible)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
    }
  }, [isMobile, isResizing, setIsVisible])

  // Calculate card position when viewport changes
  useEffect(() => {
    // Skip position updates during resize
    if (isResizing) return

    // Wait for physics to settle after resize ends, then calculate position
    const physicsSettleTimer = setTimeout(() => {
      const [x, y, z] = calculateCardPosition(viewport)
      setCardExperiencePosition(new THREE.Vector3(x, y, z))
      setIsVisible(true)
    }, 250) // Wait for physics to settle

    return () => clearTimeout(physicsSettleTimer)
  }, [viewport, isMobile, isResizing])

  // Memoize context value
  const contextValue = useMemo<TetheredCardContextState>(
    () => ({
      // State
      cardExperiencePosition,
      currentTextureIndex,
      ropeColor,
      ropeRadius,
      isVisible,

      // Handlers
      setCardExperiencePosition: setCardExperiencePositionMemo,
      setCurrentTextureIndex: setCurrentTextureIndexMemo,
      setRopeColor: setRopeColorMemo,
      setRopeRadius: setRopeRadiusMemo,
      setIsVisible: setIsVisibleMemo,
    }),
    [
      cardExperiencePosition,
      currentTextureIndex,
      ropeColor,
      ropeRadius,
      isVisible,
      setCardExperiencePositionMemo,
      setCurrentTextureIndexMemo,
      setRopeColorMemo,
      setRopeRadiusMemo,
      setIsVisibleMemo,
    ],
  )

  return <TetheredCardContext.Provider value={contextValue}>{children}</TetheredCardContext.Provider>
}
