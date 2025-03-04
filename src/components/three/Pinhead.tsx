"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Vector3, Mesh, MeshStandardMaterial } from 'three';

interface PinheadProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
}

export const Pinhead: React.FC<PinheadProps> = ({
  position = [0, 0, 0],
  size = 0.1,
  color = '#c0c0c0', // Silver color
  metalness = 0.9,
  roughness = 0.1,
}) => {
  const pinRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);


  return (
    <group position={new Vector3(...position)}>
      {/* Pin stem (small cylinder) */}
      <mesh position={[0, -size * 1., 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <cylinderGeometry args={[size * 0.15, size * 0.15, size * 2, 16]} />
        <meshStandardMaterial   color="#D3D3D3" metalness={0.9} />
      </mesh>
      {/* Pin head (sphere) */}
      <Sphere ref={pinRef} args={[size, 32, 32]}>
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          metalness={metalness}
          roughness={roughness}
          depthTest={false}
        />
      </Sphere>
      
    </group>
  );
}; 