'use client'

import React from 'react'
import { useThree } from '@react-three/fiber'
import { createContext, useContext, useEffect, useState } from 'react'
import { MOBILE_BREAKPOINT, RESIZE_DELAY } from '../utils/constants'

interface ViewportContextState {
  isMobile: boolean
  isVisible: boolean
}

export const ViewportContext = createContext<ViewportContextState>({
  isMobile: false,
  isVisible: true,
})

export const useViewportContext = () => {
  const context = useContext(ViewportContext)
  if (!context) {
    throw new Error('useViewportContext must be used within a ViewportProvider')
  }
  return context
}

interface ViewportProviderProps {
  children: React.ReactNode
}

export const ViewportProvider: React.FC<ViewportProviderProps> = ({ children }) => {
  const { size } = useThree()
  const [state, setState] = useState<ViewportContextState>({
    isMobile: size.width < MOBILE_BREAKPOINT,
    isVisible: true,
  })

  // Handle resize events
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const updateViewport = () => {
      setState((prev) => ({ ...prev, isVisible: false }))

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
      const scrollThreshold = viewportHeight * 0.5

      setState((prev) => {
        const shouldBeVisible = scrollY < scrollThreshold
        if (prev.isVisible !== shouldBeVisible) {
          return { ...prev, isVisible: shouldBeVisible }
        }
        return prev
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [state.isMobile])

  return <ViewportContext.Provider value={state}>{children}</ViewportContext.Provider>
}
