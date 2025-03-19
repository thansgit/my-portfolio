'use client'

import React, { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useViewportContext } from '@/components/three/context/ViewportContext'
import { MOBILE_BREAKPOINT, RESIZE_DELAY } from '@/components/three/utils/constants'

/**
 * ViewportManager handles viewport state management
 * (mobile detection and resize state)
 */
export const ViewportManager = () => {
  const { size } = useThree()
  const { isMobile, setIsMobile, setIsResizing } = useViewportContext()

  // Resize handling with refs for cleanup
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const finalResizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isResizingRef = useRef(false)

  // Handle resize events with proper physics timing
  useEffect(() => {
    const handleResize = () => {
      // Mark as resizing immediately
      isResizingRef.current = true
      setIsResizing(true)

      // Clear any existing timeouts
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      if (finalResizeTimeoutRef.current) {
        clearTimeout(finalResizeTimeoutRef.current)
      }

      // First stage: Update mobile state based on new dimensions
      resizeTimeoutRef.current = setTimeout(() => {
        setIsMobile(size.width < MOBILE_BREAKPOINT)

        // Second stage: Allow enough time for physics to settle
        finalResizeTimeoutRef.current = setTimeout(() => {
          setIsResizing(false)
          isResizingRef.current = false
        }, 300) // Physics settling time
      }, RESIZE_DELAY)
    }

    // Initial size check
    handleResize()

    // No need for window event listener as useThree's size changes trigger this effect

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      if (finalResizeTimeoutRef.current) {
        clearTimeout(finalResizeTimeoutRef.current)
      }
    }
  }, [size.width, setIsMobile, setIsResizing])

  // This component doesn't render anything - it just manages viewport state
  return null
}
