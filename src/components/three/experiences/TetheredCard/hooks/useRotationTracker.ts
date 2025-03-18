import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { RapierRigidBody } from '@react-three/rapier'

/**
 * Represents the quadrant of the card relative to a fixed point
 */
export enum Quadrant {
  Q1 = 'Q1', // Top right
  Q2 = 'Q2', // Top left
  Q3 = 'Q3', // Bottom left
  Q4 = 'Q4', // Bottom right
}

export interface RotationTrackerProps {
  card: React.RefObject<RapierRigidBody>
  fixed: React.RefObject<RapierRigidBody>
  isDragging: boolean
}

/**
 * Hook that tracks rotations of a card around a fixed point.
 * Detects when the card completes a full rotation by monitoring its position
 * relative to the fixed point and tracking quadrant changes.
 */
export const useRotationTracker = ({ card, fixed, isDragging }: RotationTrackerProps) => {
  // Persistent state across renders
  const totalRotations = useRef<number>(0)
  const currentQuadrant = useRef<Quadrant | null>(null)
  const lastQuadrants = useRef<Quadrant[]>([])
  const hasValidPosition = useRef<boolean>(false)
  const wasDragging = useRef<boolean>(false)
  const lastRotationTime = useRef<number>(0)
  const isMoving = useRef<boolean>(false)
  const lastPosition = useRef<THREE.Vector3 | null>(null)

  // Configuration constants
  const MIN_ROTATION_INTERVAL = 250 // Minimum time (ms) between detected rotations
  const MIN_DISTANCE_FROM_CENTER = 0.05 // Minimum distance to consider quadrant changes valid
  const MIN_MOVEMENT_THRESHOLD = 0.001 // Minimum movement to consider the card moving

  // Update tracking state when drag state changes
  useEffect(() => {
    // When drag starts, reset quadrant tracking but preserve rotation count
    if (isDragging && !wasDragging.current) {
      lastQuadrants.current = []
      currentQuadrant.current = null
    }
    
    // Update previous dragging state
    wasDragging.current = isDragging
  }, [isDragging])

  /**
   * Determines which quadrant a point is in relative to the origin
   */
  const getQuadrant = (x: number, y: number): Quadrant => {
    if (x >= 0 && y >= 0) return Quadrant.Q1 // Top right
    if (x < 0 && y >= 0) return Quadrant.Q2 // Top left
    if (x < 0 && y < 0) return Quadrant.Q3 // Bottom left
    return Quadrant.Q4 // Bottom right
  }

  /**
   * Checks if two quadrants are adjacent to each other
   */
  const isAdjacentQuadrant = (q1: Quadrant, q2: Quadrant): boolean => {
    const quadrantOrder = [Quadrant.Q1, Quadrant.Q2, Quadrant.Q3, Quadrant.Q4]
    const idx1 = quadrantOrder.indexOf(q1)
    const idx2 = quadrantOrder.indexOf(q2)

    // Adjacent quadrants have indexes that differ by 1 or 3 (wrapping around)
    return Math.abs(idx1 - idx2) === 1 || Math.abs(idx1 - idx2) === 3
  }

  /**
   * Checks if the quadrant sequence indicates a clockwise rotation
   */
  const isClockwiseRotation = (quadrants: Quadrant[]): boolean => {
    // Need at least four quadrants to check for a complete rotation
    if (quadrants.length < 4) return false

    // Check the last 4 quadrants for a clockwise pattern
    const last4 = quadrants.slice(-4)
    
    // Clockwise pattern: Q1 -> Q4 -> Q3 -> Q2 -> Q1
    return (
      last4[0] === Quadrant.Q1 &&
      last4[1] === Quadrant.Q4 &&
      last4[2] === Quadrant.Q3 &&
      last4[3] === Quadrant.Q2
    )
  }

  /**
   * Checks if the quadrant sequence indicates a counter-clockwise rotation
   */
  const isCounterClockwiseRotation = (quadrants: Quadrant[]): boolean => {
    // Need at least four quadrants to check for a complete rotation
    if (quadrants.length < 4) return false

    // Check the last 4 quadrants for a counter-clockwise pattern
    const last4 = quadrants.slice(-4)
    
    // Counter-clockwise pattern: Q1 -> Q2 -> Q3 -> Q4 -> Q1
    return (
      last4[0] === Quadrant.Q1 &&
      last4[1] === Quadrant.Q2 &&
      last4[2] === Quadrant.Q3 &&
      last4[3] === Quadrant.Q4
    )
  }

  // Main tracking effect that updates every frame
  useEffect(() => {
    const trackerRaf = () => {
      if (!card.current || !fixed.current) return

      // Get positions of card and fixed point
      const cardPos = card.current.translation()
      const fixedPos = fixed.current.translation()

      // Calculate position relative to fixed point
      const relativeX = cardPos.x - fixedPos.x
      const relativeY = cardPos.y - fixedPos.y
      const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY)

      // Check if card is moving
      const currentPosition = new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z)
      if (lastPosition.current) {
        const movement = lastPosition.current.distanceTo(currentPosition)
        isMoving.current = movement > MIN_MOVEMENT_THRESHOLD
      }
      lastPosition.current = currentPosition

      // Only track quadrants if we're far enough from center
      if (distance >= MIN_DISTANCE_FROM_CENTER) {
        // Get current quadrant
        const newQuadrant = getQuadrant(relativeX, relativeY)

        // Process quadrant change if it occurred and the card is moving
        if (newQuadrant !== currentQuadrant.current && isMoving.current) {
          const isFirstQuadrant = currentQuadrant.current === null
          const isValidMove = isFirstQuadrant || isAdjacentQuadrant(newQuadrant, currentQuadrant.current!)
          
          if (isValidMove) {
            // Update quadrant and add to history
            currentQuadrant.current = newQuadrant
            lastQuadrants.current.push(newQuadrant)

            // Limit history to last 10 entries
            if (lastQuadrants.current.length > 10) {
              lastQuadrants.current.shift()
            }

            // Check for complete rotations
            const now = Date.now()
            const timeSinceLastRotation = now - lastRotationTime.current

            // Only count a rotation if enough time has passed since the last one
            if (timeSinceLastRotation > MIN_ROTATION_INTERVAL) {
              if (isClockwiseRotation(lastQuadrants.current) || 
                  isCounterClockwiseRotation(lastQuadrants.current)) {
                // Increment rotation count (mod 2 to alternate between 0 and 1)
                totalRotations.current = (totalRotations.current + 1) % 2
                
                // Reset tracking state for next rotation
                lastRotationTime.current = now
                lastQuadrants.current = []
              }
            }
          } else {
            // Invalid move (skipped quadrant), reset history
            lastQuadrants.current = [newQuadrant]
            currentQuadrant.current = newQuadrant
          }
        }

        // Mark that we have received valid positions
        if (!hasValidPosition.current) {
          hasValidPosition.current = true
        }
      }

      // Request next frame
      requestAnimationFrame(trackerRaf)
    }

    // Start the tracking animation
    const rafId = requestAnimationFrame(trackerRaf)

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [card, fixed, MIN_DISTANCE_FROM_CENTER, MIN_MOVEMENT_THRESHOLD, MIN_ROTATION_INTERVAL])

  // Return the current rotation count
  return {
    rotations: totalRotations.current,
  }
}
