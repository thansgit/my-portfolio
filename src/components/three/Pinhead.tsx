"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Sphere, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, MeshStandardMaterial, PointLight, BufferGeometry, BufferAttribute, PointsMaterial, Color, Points } from 'three';
import { useSpring, animated } from '@react-spring/three';

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
  const pinRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const lightRef = useRef<PointLight>(null);
  const particlesRef = useRef<Points>(null);
  
  // Track previous rotation count to detect changes
  const prevRotationCountRef = useRef(0);

  // Reference for particle batches
  const [particleBatches, setParticleBatches] = useState<Array<{
    positions: Float32Array;
    velocities: Float32Array;
    colors: Float32Array;
    alphas: Float32Array;
    sizes: Float32Array;
  }>>([]);
  
  // Animation properties for pulsating effect
  const { emissive, lightIntensity } = useSpring({
    scale: isGlowing ? 1.2 : 1,
    emissive: isGlowing ? '#ff3333' : '#000000',
    lightIntensity: isGlowing ? 2 : 0,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Create particles when rotation count changes
  useEffect(() => {
    // Only trigger when rotation count increases
    if (rotationCount > prevRotationCountRef.current) {
      const newBatch = createParticleBatch();
      setParticleBatches(prev => [...prev, newBatch]);
      prevRotationCountRef.current = rotationCount;
    }
  }, [rotationCount]);
  
  // Create a new particle batch
  const createParticleBatch = () => {
    const count = 80; // Less particles per batch since we'll have multiple batches
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    // Initialize particles at center
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Start at center
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      // Random direction for velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      // Calculate velocity away from center
      const velocity = 0.02 + Math.random() * 0.04;
      velocities[i3] = Math.sin(phi) * Math.cos(theta) * velocity;
      velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * velocity;
      velocities[i3 + 2] = Math.cos(phi) * velocity;
      
      // Create a brighter color for better visibility
      const particleColor = new Color(color);
      particleColor.offsetHSL(0, 0, 0.2); // Brighten
      colors[i3] = particleColor.r;
      colors[i3 + 1] = particleColor.g;
      colors[i3 + 2] = particleColor.b;
      
      // Varied particle sizes
      sizes[i] = (0.03 + Math.random() * 0.05) * size * 4;
      
      // Set initial alpha
      alphas[i] = 1.0;
    }
    
    return { positions, colors, velocities, alphas, sizes };
  };
  
  // Prepare geometry with all particle batches combined
  const combinedGeometry = useMemo(() => {
    if (particleBatches.length === 0) return null;
    
    const totalParticles = particleBatches.reduce((sum, batch) => sum + batch.alphas.length, 0);
    const geometry = new BufferGeometry();
    
    const positions = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);
    const sizes = new Float32Array(totalParticles);
    
    let offset = 0;
    particleBatches.forEach(batch => {
      const count = batch.alphas.length;
      
      // Copy positions and colors
      positions.set(batch.positions, offset * 3);
      colors.set(batch.colors, offset * 3);
      sizes.set(batch.sizes, offset);
      
      offset += count;
    });
    
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    geometry.setAttribute('size', new BufferAttribute(sizes, 1));
    
    return geometry;
  }, [particleBatches]);
  
  // Particle material with larger size
  const particleMaterial = useMemo(() => {
    return new PointsMaterial({
      size: size * 0.5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
  }, [size]);
  
  // Animation for particles and glow
  useFrame(({ clock }) => {
    // Glow effect animation
    if (isGlowing && pinRef.current && lightRef.current) {
      // Subtle size pulsation
      const pulse = Math.sin(clock.getElapsedTime() * 5) * 0.1 + 1.2;
      pinRef.current.scale.set(pulse, pulse, pulse);
      
      // Light intensity pulsation
      lightRef.current.intensity = Math.sin(clock.getElapsedTime() * 5) * 0.5 + 1.5;
    }
    
    // Skip particle processing if no batches
    if (particleBatches.length === 0 || !particlesRef.current) return;
    
    let needsUpdate = false;
    let needsRebuild = false;
    
    // Update each batch
    const updatedBatches = particleBatches.map(batch => {
      const { positions, velocities, alphas } = batch;
      const count = alphas.length;
      let batchActive = false;
      
      // Update each particle in this batch
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Update positions based on velocities
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
        
        // Gradually decrease alpha
        alphas[i] -= 0.005;
        
        // Keep track if any particles in this batch are still active
        if (alphas[i] > 0) {
          batchActive = true;
        }
      }
      
      needsUpdate = true;
      // Return the batch if it has active particles
      return { ...batch, active: batchActive };
    });
    
    // Filter out inactive batches
    const activeBatches = updatedBatches.filter(batch => batch.active);
    
    // If we removed any batches, we need to rebuild the geometry
    if (activeBatches.length !== particleBatches.length) {
      setParticleBatches(activeBatches);
      needsRebuild = true;
    } else if (needsUpdate && particlesRef.current && combinedGeometry) {
      // If there are active batches and we don't need to rebuild, just update positions
      let offset = 0;
      activeBatches.forEach(batch => {
        const posAttr = particlesRef.current!.geometry.attributes.position.array as Float32Array;
        const count = batch.alphas.length;
        
        // Update positions in the combined geometry
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const targetIdx = (offset + i) * 3;
          
          posAttr[targetIdx] = batch.positions[i3];
          posAttr[targetIdx + 1] = batch.positions[i3 + 1];
          posAttr[targetIdx + 2] = batch.positions[i3 + 2];
        }
        
        offset += count;
      });
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Update opacity based on average of all alphas
      if (particlesRef.current.material instanceof PointsMaterial) {
        const allAlphas = activeBatches.flatMap(batch => Array.from(batch.alphas));
        const avgAlpha = allAlphas.reduce((sum, alpha) => sum + Math.max(0, alpha), 0) / allAlphas.length;
        particlesRef.current.material.opacity = avgAlpha;
      }
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
          <meshStandardMaterial 
            color="#c0c0c0" 
            metalness={1.0} 
            roughness={0.05} 
            emissive="#111111"
            emissiveIntensity={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
      </Billboard>
      
      {/* Particle system that persists independently */}
      {combinedGeometry && (
        <points ref={particlesRef} geometry={combinedGeometry} material={particleMaterial} />
      )}
      
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