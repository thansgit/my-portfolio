'use client'

import React from 'react'
import { useThree } from '@react-three/fiber'
import { createContext, useContext, useEffect, useState } from 'react'
import { MOBILE_BREAKPOINT, RESIZE_DELAY } from '../utils/constants'

export interface ViewportState {
  isMobile: boolean
  isVisible: boolean
}

export const ViewportContext = createContext<ViewportState>({
  isMobile: false,
  isVisible: true,
})

/**
 * Hook for accessing viewport state context
 */
export const useViewport = () => {
  return useContext(ViewportContext)
}

/**
 * Provider component for viewport state
 */
export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { size } = useThree()
  const [state, setState] = useState<ViewportState>({
    isMobile: size.width < MOBILE_BREAKPOINT,
    isVisible: true,
  })

  // Handle resize events
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const updateViewport = () => {
      // Hide content immediately
      setState((prev) => ({ ...prev, isVisible: false }))

      // Show content and update mobile state after delay
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setState({
          isMobile: size.width < MOBILE_BREAKPOINT,
          isVisible: true,
        })
      }, RESIZE_DELAY)
    }

    updateViewport()

    return () => clearTimeout(timeoutId)
  }, [size.width])

  // Handle scroll events for mobile view
  useEffect(() => {
    if (!state.isMobile) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const scrollThreshold = viewportHeight * 0.5 // 50% of viewport height

      setState((prev) => {
        const shouldBeVisible = scrollY < scrollThreshold
        if (prev.isVisible !== shouldBeVisible) {
          return { ...prev, isVisible: shouldBeVisible }
        }
        return prev
      })
    }

    // Initial check
    handleScroll()

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [state.isMobile])

  return <ViewportContext.Provider value={state}>{children}</ViewportContext.Provider>
}
