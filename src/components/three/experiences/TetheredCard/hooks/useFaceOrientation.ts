import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody } from '@react-three/rapier'
import { useRef, useState } from 'react'

interface UseCardFaceOrientationProps {
  cardRef: React.RefObject<RapierRigidBody>
  isDragging: boolean
  isFrontFacing: boolean
}

/**
 * Hook that handles rotating the card to face the camera on the z-axis while dragging
 */
export const useFaceOrientation = ({ cardRef, isDragging, isFrontFacing }: UseCardFaceOrientationProps) => {
  const [targetRotation, setTargetRotation] = useState<THREE.Quaternion | null>(null)
  const rotationSpeed = useRef(8) // Adjust speed as needed

  // Use frame to smoothly rotate the card
  useFrame((_, delta) => {
    if (!isDragging || !cardRef.current) return

    // Only apply rotation when dragging
    if (isDragging && cardRef.current) {
      // Get current rotation
      const currentRotation = cardRef.current.rotation()
      const currentQuaternion = new THREE.Quaternion(
        currentRotation.x,
        currentRotation.y,
        currentRotation.z,
        currentRotation.w,
      )

      // Calculate target rotation based on which face is showing
      if (targetRotation === null) {
        // Create a quaternion for the target rotation
        const targetQuaternion = new THREE.Quaternion()

        // If back facing, rotate 180 degrees around Y axis to bring that face forward
        if (!isFrontFacing) {
          // Using Euler to create the rotation around Y axis (0, π, 0)
          const euler = new THREE.Euler(0, Math.PI, 0)
          targetQuaternion.setFromEuler(euler)
        }

        setTargetRotation(targetQuaternion)
      }

      // If we have a target rotation, smoothly interpolate towards it
      if (targetRotation) {
        const newQuaternion = currentQuaternion.clone()
        newQuaternion.slerp(targetRotation, Math.min(delta * rotationSpeed.current, 1))

        // Apply the rotation to the rigid body
        cardRef.current.setRotation(
          { x: newQuaternion.x, y: newQuaternion.y, z: newQuaternion.z, w: newQuaternion.w },
          true,
        )
      }
    }
  })

  // Function to reset the target rotation when drag ends
  const resetRotation = () => {
    setTargetRotation(null)
  }

  return { resetRotation }
}
