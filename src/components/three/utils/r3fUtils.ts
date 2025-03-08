import { Vector3 } from "three";
import { useThree } from "@react-three/fiber";

/**
 * Hook that returns the center point of the screen in 3D space
 * @param distance The distance from the camera to calculate the center point (default: 13)
 * @returns A Vector3 representing the center point in 3D space
 */
export const useScreenCenter = (distance: number = 13): Vector3 => {
  const { camera } = useThree();
  
  // Create a direction vector pointing forward from the camera
  const direction = new Vector3(0, 0, -1);
  direction.applyQuaternion(camera.quaternion);
  
  // Calculate the center point by starting at the camera position
  // and moving in the direction the camera is facing by the specified distance
  const centerPoint = new Vector3();
  centerPoint.copy(camera.position);
  centerPoint.addScaledVector(direction, distance);
  
  return centerPoint;
};

/**
 * Utility function to convert screen coordinates to world coordinates
 * @param x Screen X coordinate (normalized -1 to 1)
 * @param y Screen Y coordinate (normalized -1 to 1)
 * @param distance Distance from camera
 * @returns Vector3 position in 3D world space
 */
export const screenToWorld = (x: number, y: number, distance: number = 13): Vector3 => {
  const { camera } = useThree();
  
  // Create a direction vector for this screen position
  const direction = new Vector3(x, y, 0.5);
  direction.unproject(camera);
  direction.sub(camera.position).normalize();
  
  // Calculate the point at the given distance
  const point = new Vector3();
  point.copy(camera.position);
  point.addScaledVector(direction, distance);
  
  return point;
}; 