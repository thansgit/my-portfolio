import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'

/**
 * Manages browser touch events and cursor styles for interactive 3D objects
 */
export const useTouchHandling = (dragged: THREE.Vector3 | false, hovered: boolean) => {
  useEffect(() => {
    // Find the canvas element
    const canvas = document.querySelector('canvas')

    // Function to handle touchmove events
    const handleTouchMove = (e: TouchEvent) => {
      // Only prevent default if we're dragging the object
      if (dragged && e.cancelable) {
        e.preventDefault()
      }
    }

    // Function for touchstart (empty but kept for potential future use)
    const handleTouchStart = (e: TouchEvent) => {
      // Don't prevent default here to allow scrolling when not interacting
    }

    // Add event listeners
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart)
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    }

    // Add document-level listener only when dragging
    if (dragged) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
    }

    // Clean up
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart)
        canvas.removeEventListener('touchmove', handleTouchMove)
      }
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [dragged])

  // Update cursor based on hover state
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])
}

export const useDragHandlersWithFaceDetection = (
  nodeRef: React.RefObject<{ translation(): { x: number; y: number; z: number } }>,
  onDrag: (drag: THREE.Vector3 | false) => void,
  checkFacing: () => boolean,
  onFacingChange?: (isFrontFacing: boolean) => void,
) => {
  const vec = new THREE.Vector3()

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    if (nodeRef.current) {
      // Check which face is showing when drag starts
      const isFrontFacing = checkFacing()
      // Call the callback if provided
      if (onFacingChange) {
        onFacingChange(isFrontFacing)
      }
      console.log(`Drag started with ${isFrontFacing ? 'front' : 'back'} side facing the camera`)

      // Standard drag handling
      const pos = nodeRef.current.translation()
      vec.set(pos.x, pos.y, pos.z)
      onDrag(new THREE.Vector3().copy(e.point).sub(vec))
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    onDrag(false)
  }

  const handlePointerCancel = () => {
    onDrag(false)
  }

  return { handlePointerDown, handlePointerUp, handlePointerCancel }
}

export const useHoverState = (onHover: (state: boolean) => void, dragged: boolean) => {
  const [hovered, setHovered] = useState(false)

  useCursor(hovered, dragged ? 'grabbing' : 'grab')

  useEffect(() => {
    onHover(hovered)
  }, [hovered, onHover])

  return { hovered, setHovered }
}
