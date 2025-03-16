'use client'

import React, { createContext, useContext, useState } from 'react'

interface ViewportContextState {
  isMobile: boolean
  isVisible: boolean
  setIsMobile: (value: boolean) => void
  setIsVisible: (value: boolean) => void
}

const defaultState: ViewportContextState = {
  isMobile: false,
  isVisible: true,
  setIsMobile: () => {},
  setIsVisible: () => {},
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
  initialIsMobile = false,
  initialIsVisible = true,
}) => {
  const [isMobile, setIsMobile] = useState(initialIsMobile)
  const [isVisible, setIsVisible] = useState(initialIsVisible)

  const contextValue: ViewportContextState = {
    isMobile,
    isVisible,
    setIsMobile,
    setIsVisible,
  }

  return <ViewportContext.Provider value={contextValue}>{children}</ViewportContext.Provider>
}
