import { Vector3 } from 'three'
import { useThree } from '@react-three/fiber'

/**
 * Returns the center point of the screen at the specified distance from camera
 */
export const useScreenCenter = (distance: number = 13): Vector3 => {
  const { camera } = useThree()

  // Direction vector pointing forward from the camera
  const direction = new Vector3(0, 0, -1)
  direction.applyQuaternion(camera.quaternion)

  // Calculate center point at specified distance
  const centerPoint = new Vector3()
  centerPoint.copy(camera.position)
  centerPoint.addScaledVector(direction, distance)

  return centerPoint
}

/**
 * Converts normalized screen coordinates to 3D world position
 */
export const useScreenToWorld = (x: number, y: number, distance: number = 13): Vector3 => {
  const { camera } = useThree()

  // Create and unproject direction vector
  const direction = new Vector3(x, y, 0.5)
  direction.unproject(camera)
  direction.sub(camera.position).normalize()

  // Calculate position at specified distance
  const point = new Vector3()
  point.copy(camera.position)
  point.addScaledVector(direction, distance)

  return point
}
