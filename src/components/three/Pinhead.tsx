"use client";

import React, { useRef } from 'react';
import { Sphere, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, MeshStandardMaterial, PointLight } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { ParticleSystem } from './ParticleSystem';

interface PinheadProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  isGlowing?: boolean;
  rotationCount?: number;
}

export const Pinhead: React.FC<PinheadProps> = ({
  position = [0, 0, 0],
  size = 0.05,
  color = '#c0c0c0', // Silver color
  metalness = 0.9,
  roughness = 0.1,
  isGlowing = false,
  rotationCount = 0,
}) => {
  // References to Three.js objects for direct manipulation in animations
  const pinRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  
  // Spring animations for smooth transitions between glowing/non-glowing states
  const { emissive, lightIntensity, baseScale } = useSpring({
    baseScale: isGlowing ? 1.1 : 1.0, // Base scale controlled by spring physics
    emissive: isGlowing ? '#ff3333' : '#000000', // Red glow when active
    lightIntensity: isGlowing ? 2 : 0, // Light turns on when glowing
    config: { mass: 1, tension: 180, friction: 60 } // Spring physics configuration
  });

  // Animation for pulsating effect on top of the base scale
  useFrame(({ clock }) => {
    if (isGlowing && pinRef.current) {
      const currentBaseScale = baseScale.get();
      const pulseFactor = Math.sin(clock.getElapsedTime() * 3) * 0.1 + 1.0;
      
      const finalScale = currentBaseScale * pulseFactor;
      pinRef.current.scale.set(finalScale, finalScale, finalScale);
      
    }
  });

  return (
    <group position={new Vector3(...position)}>
      {/* Billboard ensures the pinhead always faces the camera regardless of camera angle */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        {/* Container group for the pin head */}
        <group>
          {/* Spherical pin head with metallic material - scale handled in useFrame */}
          <Sphere ref={pinRef} args={[size, 32, 32]}>
            <animated.meshStandardMaterial
              ref={materialRef}
              color={color}
              emissive={emissive} // Controlled by spring animation
              emissiveIntensity={2}
              metalness={metalness}
              roughness={roughness}
              depthTest={true}
            />
          </Sphere>
        </group>
          
        {/* Pin stem - cylindrical shape attached to the bottom of the spherical head */}
        <mesh position={[0, -size * 1.2, 0]}>
          <cylinderGeometry args={[size * 0.15, size * 0.3, size * 2, 16]} />
          <meshStandardMaterial 
            color="#c0c0c0" 
            metalness={1.0} 
            roughness={0.05} 
          />
        </mesh>
      </Billboard>
      
      {/* Use the separated ParticleSystem component with independent size control */}
      <ParticleSystem 
        triggerCount={rotationCount} 
        position={[0, 0, 0]} 
        particleSize={0.075} 
        particleCount={200}
        color="white"
      />
      
    </group>
  );
}; 