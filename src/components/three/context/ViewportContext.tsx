'use client'

import { MOBILE_BREAKPOINT } from '@/components/three/utils/constants'
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react'

// Context interface
interface ViewportContextState {
  isMobile: boolean
  isResizing: boolean
  width: number
  height: number
  setIsMobile: (value: boolean) => void
  setIsResizing: (value: boolean) => void
}

const defaultState: ViewportContextState = {
  isMobile: false,
  isResizing: false,
  width: 0,
  height: 0,
  setIsMobile: () => {},
  setIsResizing: () => {},
}

export const ViewportContext = createContext<ViewportContextState>(defaultState)

export const useViewportContext = () => {
  const context = useContext(ViewportContext)
  if (!context) {
    throw new Error('useViewportContext must be used within a ViewportProvider')
  }
  return context
}

interface ViewportProviderProps {
  children: React.ReactNode
  initialIsMobile?: boolean
}

export const ViewportProvider: React.FC<ViewportProviderProps> = ({
  children,
  initialIsMobile = typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
}) => {
  // State
  const [isMobile, setIsMobile] = useState(initialIsMobile)
  const [isResizing, setIsResizing] = useState(false)
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  // Use refs to track state between renders
  const prevWidth = useRef(typeof window !== 'undefined' ? window.innerWidth : 0)
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Use ref for resize state tracking to avoid effect dependencies
  const resizeStateRef = useRef({
    isResizing: false,
    resizeTimeout: null as NodeJS.Timeout | null,
  })

  // Memoize setter functions
  const setIsMobileMemo = useCallback((value: boolean) => {
    setIsMobile(value)
  }, [])

  const setIsResizingMemo = useCallback((value: boolean) => {
    console.log(`[ViewportContext] setIsResizing: ${value}`)
    setIsResizing(value)
  }, [])

  // Handle resize event
  const handleResizeEvent = useCallback(() => {
    // Get current dimensions
    const width = window.innerWidth
    const height = window.innerHeight

    setIsResizing(true)
    resizeStateRef.current.isResizing = true

    // Update dimensions
    setDimensions({ width, height })

    // Check for mobile breakpoint crossing
    if (width <= MOBILE_BREAKPOINT && prevWidth.current > MOBILE_BREAKPOINT) {
      setIsMobile(true)
    } else if (width > MOBILE_BREAKPOINT && prevWidth.current <= MOBILE_BREAKPOINT) {
      setIsMobile(false)
    }

    // Update previous width reference
    prevWidth.current = width

    // Clear any existing timer
    if (resizeTimerRef.current) {
      clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = null
    }
  }, [])

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    // Only end resize state if currently resizing
    if (resizeStateRef.current.isResizing) {
      setIsResizing(false)
      resizeStateRef.current.isResizing = false
    }
  }, [])

  // Setup VisualViewport resize handler
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) {
      console.warn('[ViewportContext] VisualViewport API not available')
      return
    }

    // Handle resize event
    const handleViewportResize = () => {
      // Start resize state if not already resizing
      if (!resizeStateRef.current.isResizing) {
        handleResizeEvent()
      }

      // Clear any existing timer
      if (resizeStateRef.current.resizeTimeout) {
        clearTimeout(resizeStateRef.current.resizeTimeout)
      }

      // Set a new timer to end the resize state
      resizeStateRef.current.resizeTimeout = setTimeout(() => {
        handleResizeEnd()
      }, 200)
    }

    // Also listen to window resize to ensure we catch all resize events
    window.addEventListener('resize', handleViewportResize)

    // Clean up function
    return () => {
      window.removeEventListener('resize', handleViewportResize)

      if (resizeStateRef.current.resizeTimeout) {
        clearTimeout(resizeStateRef.current.resizeTimeout)
      }
    }
  }, [handleResizeEvent, handleResizeEnd])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isMobile,
      isResizing,
      width: dimensions.width,
      height: dimensions.height,
      setIsMobile: setIsMobileMemo,
      setIsResizing: setIsResizingMemo,
    }),
    [isMobile, isResizing, dimensions.width, dimensions.height, setIsMobileMemo, setIsResizingMemo],
  )

  return <ViewportContext.Provider value={contextValue}>{children}</ViewportContext.Provider>
}
