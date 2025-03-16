import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import { RapierRigidBody } from '@react-three/rapier'
import { ThreeEvent } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'

export enum Quadrant {
  Q1 = 1, // (+X, +Y) - top right
  Q2 = 2, // (-X, +Y) - top left
  Q3 = 3, // (-X, -Y) - bottom left
  Q4 = 4, // (+X, -Y) - bottom right
}

export interface RotationTrackerProps {
  card: React.RefObject<RapierRigidBody>
  fixed: React.RefObject<RapierRigidBody>
  isDragging: boolean
}

export const useRotationTracker = ({ card, fixed, isDragging }: RotationTrackerProps) => {
  // Current quadrant and history
  const currentQuadrant = useRef<Quadrant | null>(null)
  const lastQuadrants = useRef<Quadrant[]>([])

  // Total rotation count
  const totalRotations = useRef<number>(0)

  // Track previous dragging state to detect changes
  const wasDragging = useRef<boolean>(false)

  // Animation frame reference
  const frameId = useRef<number | null>(null)

  // Whether we're actively tracking
  const isTracking = useRef<boolean>(false)

  // Last time a rotation was detected
  const lastRotationTime = useRef<number>(0)

  // Track if the card is moving
  const isMoving = useRef<boolean>(false)
  const lastPosition = useRef<THREE.Vector3 | null>(null)

  // Configuration parameters
  const MIN_ROTATION_INTERVAL = 250 // Minimum time between detected rotations (ms)
  const MIN_DISTANCE_FROM_CENTER = 0.05 // Minimum distance to consider quadrant changes valid
  const MIN_MOVEMENT_THRESHOLD = 0.001 // Minimum movement to consider the card moving

  // Reset rotation count when a new drag starts
  useEffect(() => {
    // If we weren't dragging before but now we are, reset the count
    if (isDragging && !wasDragging.current) {
      console.log('New drag detected - resetting rotation count')
      totalRotations.current = 0
      lastQuadrants.current = []
      currentQuadrant.current = null
    }

    // Update previous dragging state
    wasDragging.current = isDragging
  }, [isDragging])

  /**
   * Get the current quadrant from XY position
   */
  const getQuadrant = (x: number, y: number): Quadrant => {
    if (x >= 0 && y >= 0) return Quadrant.Q1 // Top right
    if (x < 0 && y >= 0) return Quadrant.Q2 // Top left
    if (x < 0 && y < 0) return Quadrant.Q3 // Bottom left
    return Quadrant.Q4 // Bottom right
  }

  /**
   * Process a new quadrant
   */
  const processQuadrant = (quadrant: Quadrant) => {
    // Skip if same as last quadrant
    if (lastQuadrants.current.length > 0 && lastQuadrants.current[lastQuadrants.current.length - 1] === quadrant) {
      return
    }

    // Add to history
    lastQuadrants.current.push(quadrant)

    // Keep history at a manageable size
    if (lastQuadrants.current.length > 6) {
      lastQuadrants.current.shift()
    }

    // Check for completed rotations
    checkForRotation()
  }

  /**
   * Check for rotation patterns in the history
   */
  const checkForRotation = () => {
    const now = performance.now()
    // Don't detect rotations too quickly
    if (now - lastRotationTime.current < MIN_ROTATION_INTERVAL) return

    const history = lastQuadrants.current
    if (history.length < 5) return

    const last5 = history.slice(-5)

    // Rotation patterns (both clockwise and counter-clockwise)
    const rotationPatterns = [
      // Clockwise patterns
      [Quadrant.Q1, Quadrant.Q2, Quadrant.Q3, Quadrant.Q4, Quadrant.Q1],
      [Quadrant.Q2, Quadrant.Q3, Quadrant.Q4, Quadrant.Q1, Quadrant.Q2],
      [Quadrant.Q3, Quadrant.Q4, Quadrant.Q1, Quadrant.Q2, Quadrant.Q3],
      [Quadrant.Q4, Quadrant.Q1, Quadrant.Q2, Quadrant.Q3, Quadrant.Q4],
      // Counter-clockwise patterns
      [Quadrant.Q1, Quadrant.Q4, Quadrant.Q3, Quadrant.Q2, Quadrant.Q1],
      [Quadrant.Q2, Quadrant.Q1, Quadrant.Q4, Quadrant.Q3, Quadrant.Q2],
      [Quadrant.Q3, Quadrant.Q2, Quadrant.Q1, Quadrant.Q4, Quadrant.Q3],
      [Quadrant.Q4, Quadrant.Q3, Quadrant.Q2, Quadrant.Q1, Quadrant.Q4],
    ]

    // Check for any rotation
    if (rotationPatterns.some((pattern) => checkSequence(last5, pattern))) {
      if (isMoving.current) {
        totalRotations.current++
        console.log(`Rotation detected! New total: ${totalRotations.current}, Quadrant sequence: ${last5.join(' → ')}`)
      }
      lastQuadrants.current = [last5[last5.length - 1]]
      lastRotationTime.current = now
    }
  }

  /**
   * Check if array contains a sequence
   */
  const checkSequence = (arr: Quadrant[], sequence: Quadrant[]): boolean => {
    if (arr.length < sequence.length) return false

    for (let i = 0; i <= arr.length - sequence.length; i++) {
      let match = true
      for (let j = 0; j < sequence.length; j++) {
        if (arr[i + j] !== sequence[j]) {
          match = false
          break
        }
      }
      if (match) return true
    }

    return false
  }

  /**
   * Check if the object is moving
   */
  const checkMovement = (currentPos: THREE.Vector3): void => {
    if (!lastPosition.current) {
      lastPosition.current = currentPos.clone()
      return
    }

    const distance = currentPos.distanceTo(lastPosition.current)
    lastPosition.current = currentPos.clone()

    // Update movement state
    isMoving.current = distance > MIN_MOVEMENT_THRESHOLD
  }

  /**
   * Main tracking function
   */
  const trackRotation = () => {
    if (!card.current || !fixed.current || !isTracking.current) {
      frameId.current = requestAnimationFrame(trackRotation)
      return
    }

    // Get positions
    const fixedPos = fixed.current.translation()
    const cardPos = card.current.translation()

    // Check movement
    const currentPos = new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z)
    checkMovement(currentPos)

    // Calculate relative position in XY plane
    const relX = cardPos.x - fixedPos.x
    const relY = cardPos.y - fixedPos.y

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY)

    // Only track quadrant changes if far enough from center
    if (distanceFromCenter >= MIN_DISTANCE_FROM_CENTER) {
      const quadrant = getQuadrant(relX, relY)

      // If quadrant changed, process it
      if (quadrant !== currentQuadrant.current) {
        currentQuadrant.current = quadrant
        processQuadrant(quadrant)
      }
    }

    frameId.current = requestAnimationFrame(trackRotation)
  }

  // Start and stop tracking based on component lifecycle
  useEffect(() => {
    isTracking.current = true

    // Start tracking
    frameId.current = requestAnimationFrame(trackRotation)

    return () => {
      // Stop tracking
      isTracking.current = false
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current)
      }
    }
  }, [])

  return {
    rotations: totalRotations.current,
  }
}

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

export const useDragHandlers = (
  nodeRef: React.RefObject<{ translation(): { x: number; y: number; z: number } }>,
  onDrag: (drag: THREE.Vector3 | false) => void,
) => {
  const vec = new THREE.Vector3()

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    if (nodeRef.current) {
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
