import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useState, useRef } from 'react'
import { RapierRigidBody } from '@react-three/rapier'

interface CardFaceTrackingProps {
  cardRef: React.RefObject<RapierRigidBody>
}

/**
 * Hook that provides a function to check which side of the card is facing the camera
 * using the dot product between the card's normal vector and the camera direction
 */
export const useCardFaceTracking = ({ cardRef }: CardFaceTrackingProps) => {
  const { camera } = useThree()
  const [isFrontFacing, setIsFrontFacing] = useState(true)

  /**
   * Check which side of the card is facing the camera
   * Returns true if front facing, false if back facing
   */
  const checkFacing = () => {
    if (!cardRef.current) return isFrontFacing

    // Get card's world rotation
    const cardRigidBody = cardRef.current
    const cardRotation = cardRigidBody.rotation()

    // Create a normal vector for the front face
    // Assuming Z+ is the front face normal in the card's local space
    const cardNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(
      new THREE.Quaternion(cardRotation.x, cardRotation.y, cardRotation.z, cardRotation.w),
    )

    // Get direction from card to camera
    const cardPosition = cardRigidBody.translation()
    const cardPos = new THREE.Vector3(cardPosition.x, cardPosition.y, cardPosition.z)

    const cameraDirection = new THREE.Vector3().subVectors(camera.position, cardPos).normalize()

    // Calculate dot product
    // If positive, the front is facing the camera
    const dotProduct = cardNormal.dot(cameraDirection)

    const newIsFrontFacing = dotProduct > 0

    // Update state only if it changed
    if (newIsFrontFacing !== isFrontFacing) {
      setIsFrontFacing(newIsFrontFacing)
    }

    return newIsFrontFacing
  }

  return { isFrontFacing, checkFacing }
}
