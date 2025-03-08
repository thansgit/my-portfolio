"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

// Preload the 3D model to improve loading performance
useGLTF.preload('/assets/models/card.glb', true);

// Define the RopeMesh component props interface
interface RopeMeshProps {
  points: THREE.Vector3[];
  radius?: number;
  color?: string;
}

// RopeMesh component to create a tubular mesh around the rope points
export const RopeMesh = ({ points, radius = 0.04, color = "black" }: RopeMeshProps) => {
  const curve = useMemo(() => {
    // Create a smooth curve through the points
    const curvePoints = [...points];
    return new THREE.CatmullRomCurve3(curvePoints);
  }, [points]);

  // Create a tubular geometry along the curve
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, radius, 8, false);
  }, [curve, radius]);

  // Get the start and end points for cap spheres
  const startPoint = useMemo(() => points[0], [points]);
  const endPoint = useMemo(() => points[points.length - 1], [points]);

  return (
    <group>
      {/* Main tube */}
      <mesh>
        <primitive object={tubeGeometry} attach="geometry" />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7} 
        />
      </mesh>
      
      {/* Cap at the start point */}
      <mesh position={startPoint}>
        <sphereGeometry args={[radius, 4 , 4]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7} 
        />
      </mesh>
      
      {/* Cap at the end point */}
      <mesh position={endPoint}>
        <sphereGeometry args={[radius, 4, 4]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7} 
        />
      </mesh>
    </group>
  );
};

// Card component
interface CardModelProps {
  nodeRef: React.MutableRefObject<any>;
  dragged: THREE.Vector3 | false;
  onHover: (state: boolean) => void;
  onDrag: (drag: THREE.Vector3 | false) => void;
}

export const CardModel = ({ nodeRef, dragged, onHover, onDrag }: CardModelProps) => {
  const { nodes } = useGLTF('/assets/models/card.glb');
  const vec = new THREE.Vector3();

  return (
    <group
      scale={2}
      position={[0, 0.08, -0.03]}
      rotation={[Math.PI * 0.5, 0, 0]}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        onDrag(new THREE.Vector3().copy(e.point).sub(vec.copy(nodeRef.current!.translation())));
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        onDrag(false);
      }}
      // Use pointer events instead of touch events for better compatibility
      onPointerCancel={() => {
        onDrag(false);
      }}
    >
      <primitive object={nodes.Scene} />
    </group>
  );
}; 