import * as THREE from 'three'

/**
 * Helper functions for Three.js operations
 */

/**
 * Convert degrees to radians
 */
export const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export const radToDeg = (radians: number) => {
  return radians * (180 / Math.PI)
}

/**
 * Linearly interpolate between two vectors
 */
export const lerpVectors = (v1: THREE.Vector3, v2: THREE.Vector3, alpha: number): THREE.Vector3 => {
  return v1.clone().lerp(v2, alpha)
}

/**
 * Create a basic THREE material with common properties
 */
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

/**
 * Calculate the distance between two Vector3 positions
 */
export const getDistance = (p1: THREE.Vector3, p2: THREE.Vector3): number => {
  return p1.distanceTo(p2)
}

/**
 * Map a value from one range to another
 */
export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
