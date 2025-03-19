'use client'

import { MOBILE_BREAKPOINT } from '@/components/three/utils/constants'
import React, { createContext, useContext, useState } from 'react'

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
  initialIsMobile = window.innerWidth < MOBILE_BREAKPOINT,
  initialIsVisible = true,
}) => {
  const [isMobile, setIsMobile] = useState(initialIsMobile)
  const [isVisible, setIsVisible] = useState(initialIsVisible)
  const [isResizing, setIsResizing] = useState(false)

  const contextValue: ViewportContextState = {
    isMobile,
    isVisible,
    isResizing,
    setIsMobile,
    setIsVisible,
    setIsResizing,
  }

  return <ViewportContext.Provider value={contextValue}>{children}</ViewportContext.Provider>
}
