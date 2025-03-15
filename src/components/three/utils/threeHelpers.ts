import { DESKTOP_OFFSET } from '@/components/three/utils/constants'
import { MOBILE_OFFSET } from '@/components/three/utils/constants'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export const calculateCardPosition = (
  viewport: { width: number; height: number },
  isMobile: boolean,
): [number, number, number] => {
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2)
  return [xPosition, 2.5, 0]
}

export const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const radToDeg = (radians: number) => {
  return radians * (180 / Math.PI)
}

export const lerpVectors = (v1: THREE.Vector3, v2: THREE.Vector3, alpha: number): THREE.Vector3 => {
  return v1.clone().lerp(v2, alpha)
}

export const createBasicMaterial = (
  color: string | number = 0xffffff,
  options: Partial<THREE.MeshStandardMaterialParameters> = {},
): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.5,
    ...options,
  })
}

export const getDistance = (p1: THREE.Vector3, p2: THREE.Vector3): number => {
  return p1.distanceTo(p2)
}

export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
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
