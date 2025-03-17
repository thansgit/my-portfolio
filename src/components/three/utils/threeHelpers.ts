import { DESKTOP_OFFSET } from '@/components/three/utils/constants'
import { MOBILE_OFFSET } from '@/components/three/utils/constants'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

/**
 * Calculates the card position based on viewport dimensions and device type
 * @param viewport The current viewport dimensions
 * @param isMobile Whether the current device is mobile
 * @returns A tuple containing [x, y, z] coordinates
 */

/**
 * Returns the center point of the screen at the specified distance from camera
 */
export const useScreenCenter = (distance: number = 13): THREE.Vector3 => {
  const { camera } = useThree()

  // Direction vector pointing forward from the camera
  const direction = new THREE.Vector3(0, 0, -1)
  direction.applyQuaternion(camera.quaternion)

  // Calculate center point at specified distance
  const centerPoint = new THREE.Vector3()
  centerPoint.copy(camera.position)
  centerPoint.addScaledVector(direction, distance)

  return centerPoint
}

/**
 * Converts normalized screen coordinates to 3D world position
 */
export const useScreenToWorld = (x: number, y: number, distance: number = 13): THREE.Vector3 => {
  const { camera } = useThree()

  // Create and unproject direction vector
  const direction = new THREE.Vector3(x, y, 0.5)
  direction.unproject(camera)
  direction.sub(camera.position).normalize()

  // Calculate position at specified distance
  const point = new THREE.Vector3()
  point.copy(camera.position)
  point.addScaledVector(direction, distance)

  return point
}

export function createDisposableGeometry(createFn: () => THREE.BufferGeometry | null): {
  geometry: THREE.BufferGeometry | null
  dispose: () => void
} {
  let geometry: THREE.BufferGeometry | null = null

  const create = () => {
    dispose() // Clean up previous geometry
    geometry = createFn()
    return geometry
  }

  const dispose = () => {
    if (geometry) {
      geometry.dispose()
      geometry = null
    }
  }

  return {
    geometry: create(),
    dispose,
  }
}
