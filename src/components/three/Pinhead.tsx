"use client";

import React, { useRef } from 'react';
import { Sphere, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, MeshStandardMaterial, PointLight } from 'three';
import { useSpring, animated } from '@react-spring/three';

interface PinheadProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  isGlowing?: boolean;
}

export const Pinhead: React.FC<PinheadProps> = ({
  position = [0, 0, 0],
  size = 0.05,
  color = '#c0c0c0', // Silver color
  metalness = 0.9,
  roughness = 0.1,
  isGlowing = false,
}) => {
  const pinRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const lightRef = useRef<PointLight>(null);
  
  // Animation properties for pulsating effect
  const { emissive, lightIntensity } = useSpring({
    scale: isGlowing ? 1.2 : 1,
    emissive: isGlowing ? '#ff3333' : '#000000',
    lightIntensity: isGlowing ? 2 : 0,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Pulsating animation for when glowing
  useFrame(({ clock }) => {
    if (isGlowing && pinRef.current && lightRef.current) {
      // Subtle size pulsation
      const pulse = Math.sin(clock.getElapsedTime() * 5) * 0.1 + 1.2;
      pinRef.current.scale.set(pulse, pulse, pulse);
      
      // Light intensity pulsation
      lightRef.current.intensity = Math.sin(clock.getElapsedTime() * 5) * 0.5 + 1.5;
    }
  });

  return (
    <group position={new Vector3(...position)}>
      {/* Use Billboard to ensure pinhead always faces the camera */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        {/* Container for the pinhead, allowing pulsating when glowing */}
        <group scale={isGlowing ? 1.2 : 1}>
          {/* Pin head (sphere) */}
          <Sphere ref={pinRef} args={[size, 32, 32]}>
            <animated.meshStandardMaterial
              ref={materialRef}
              color={color}
              emissive={emissive}
              emissiveIntensity={2}
              metalness={metalness}
              roughness={roughness}
              depthTest={true}
            />
          </Sphere>
        </group>
          
          {/* Pin stem coming out from the bottom of the head */}
          <mesh position={[0, -size * 1.2, 0]}>
            <cylinderGeometry args={[size * 0.15, size * 0.3, size * 2, 16]} />
            <meshStandardMaterial color="#D3D3D3" metalness={0.9} />
          </mesh>
      </Billboard>
      
      {/* Point light for glow effect */}
      <animated.pointLight
        ref={lightRef}
        intensity={lightIntensity}
        distance={1}
        color="#ff3333"
      />
    </group>
  );
}; 