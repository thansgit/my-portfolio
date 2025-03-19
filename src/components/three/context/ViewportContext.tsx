'use client'

import { MOBILE_BREAKPOINT } from '@/components/three/utils/constants'
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

interface ViewportContextState {
  isMobile: boolean
  isVisible: boolean
  isResizing: boolean
  setIsMobile: (value: boolean) => void
  setIsVisible: (value: boolean) => void
  setIsResizing: (value: boolean) => void
}

const defaultState: ViewportContextState = {
  isMobile: false,
  isVisible: true,
  isResizing: false,
  setIsMobile: () => {},
  setIsVisible: () => {},
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
  initialIsVisible?: boolean
}

export const ViewportProvider: React.FC<ViewportProviderProps> = ({
  children,
  initialIsMobile = typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  initialIsVisible = true,
}) => {
  const [isMobile, setIsMobile] = useState(initialIsMobile)
  const [isVisible, setIsVisible] = useState(initialIsVisible)
  const [isResizing, setIsResizing] = useState(false)

  // Memoize setter functions to prevent unnecessary rerenders
  const setIsMobileMemo = useCallback((value: boolean) => {
    setIsMobile(value)
  }, [])

  const setIsVisibleMemo = useCallback((value: boolean) => {
    setIsVisible(value)
  }, [])

  const setIsResizingMemo = useCallback((value: boolean) => {
    setIsResizing(value)
  }, [])

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      isMobile,
      isVisible,
      isResizing,
      setIsMobile: setIsMobileMemo,
      setIsVisible: setIsVisibleMemo,
      setIsResizing: setIsResizingMemo,
    }),
    [isMobile, isVisible, isResizing, setIsMobileMemo, setIsVisibleMemo, setIsResizingMemo],
  )

  return <ViewportContext.Provider value={contextValue}>{children}</ViewportContext.Provider>
}
