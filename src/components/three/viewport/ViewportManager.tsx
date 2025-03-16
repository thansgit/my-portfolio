'use client'

import React, { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useViewportContext } from '@/components/three/context/ViewportContext'
import { MOBILE_BREAKPOINT, RESIZE_DELAY } from '@/components/three/utils/constants'

/**
 * ViewportManager handles viewport state management
 * (mobile detection, visibility, etc.) and updates the ViewportContext.
 */
export const ViewportManager = () => {
  const { size } = useThree()
  const { isMobile, isVisible, setIsMobile, setIsVisible } = useViewportContext()
  const isResizing = useRef(false)

  // Handle viewport state (mobile detection, visibility)
  // ===================================================

  // Handle resize events
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const updateViewport = () => {
      console.log('ViewportManager: Setting isVisible to false during resize')
      isResizing.current = true
      setIsVisible(false)

      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        console.log('ViewportManager: Resize complete, setting isVisible to true')
        setIsMobile(size.width < MOBILE_BREAKPOINT)
        setIsVisible(true)

        // Add a small delay before allowing scroll handler to run again
        setTimeout(() => {
          isResizing.current = false
        }, 100)
      }, RESIZE_DELAY)
    }

    updateViewport()

    return () => {
      clearTimeout(timeoutId)
      isResizing.current = false
    }
  }, [size.width, setIsMobile, setIsVisible])

  // Handle scroll events for mobile view
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      // Skip scroll handling during resize operations
      if (isResizing.current) return

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const scrollThreshold = viewportHeight * 0.5

      const shouldBeVisible = scrollY < scrollThreshold
      if (isVisible !== shouldBeVisible) {
        console.log('ViewportManager: Scroll changed visibility to', shouldBeVisible)
        setIsVisible(shouldBeVisible)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, isVisible, setIsVisible])

  // This component doesn't render anything - it just manages viewport state
  return null
}
