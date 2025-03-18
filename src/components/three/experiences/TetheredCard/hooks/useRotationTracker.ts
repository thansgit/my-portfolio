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
  const MIN_ROTATION_INTERVAL = 200 // Minimum time (ms) between detected rotations
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
   * Checks if there has been a rotation between the top quadrants
   */
  const hasRotatedBetweenTopQuadrants = (quadrants: Quadrant[]): boolean => {
    // Need at least two quadrants to check for a transition
    if (quadrants.length < 2) return false

    // Get the last two quadrants
    const last2 = quadrants.slice(-2)

    // Check for a transition between Q1 and Q2 in either direction
    return (
      (last2[0] === Quadrant.Q1 && last2[1] === Quadrant.Q2) || (last2[0] === Quadrant.Q2 && last2[1] === Quadrant.Q1)
    )
  }

  // Main tracking effect that updates every frame
  useEffect(() => {
    let frameId: number | null = null
    let isMounted = true

    const trackerRaf = () => {
      // Skip if component is unmounted
      if (!isMounted) return

      // Check if references exist
      if (!card.current || !fixed.current) {
        // If refs don't exist but we're still mounted, schedule next frame and wait
        frameId = requestAnimationFrame(trackerRaf)
        return
      }

      // Safely check if translation methods are available
      try {
        const cardTranslation = card.current.translation?.()
        const fixedTranslation = fixed.current.translation?.()

        // Exit if either translation is null
        if (!cardTranslation || !fixedTranslation) {
          frameId = requestAnimationFrame(trackerRaf)
          return
        }

        const cardPos = cardTranslation
        const fixedPos = fixedTranslation

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
                if (hasRotatedBetweenTopQuadrants(lastQuadrants.current)) {
                  // Increment rotation count
                  totalRotations.current = (totalRotations.current + 1) % 8

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

        // Schedule next frame
        frameId = requestAnimationFrame(trackerRaf)
      } catch (error) {
        // Safely handle any errors during tracking
      }
    }

    // Start the tracking loop
    frameId = requestAnimationFrame(trackerRaf)

    // Cleanup function
    return () => {
      isMounted = false
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [card, fixed, MIN_DISTANCE_FROM_CENTER, MIN_MOVEMENT_THRESHOLD, MIN_ROTATION_INTERVAL])

  // Return the current rotation count
  return {
    rotations: totalRotations.current,
  }
}
