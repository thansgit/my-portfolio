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

//TODO: move to viewport manager if not used anywhere else
export const calculateCardPosition = (
  viewport: { width: number; height: number },
  isMobile: boolean,
): [number, number, number] => {
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2)
  return [xPosition, 2.5, 0]
}

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

//TODO: move to pinhead if not used anywhere else
export function createStandardMaterial(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.7,
    metalness: 0.1,
  })
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
