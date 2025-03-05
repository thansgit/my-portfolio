"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, BufferAttribute, PointsMaterial, Color, Points, Vector3 } from 'three';

interface ParticleSystemProps {
  triggerCount: number;  // Increases to trigger new particles
  position?: [number, number, number];
  particleSize?: number;
  particleCount?: number;
  color?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  triggerCount = 0,
  position = [0, 0, 0],
  particleSize = 0.025, // New independent particle size control (default half the reference size)
  color = '#c0c0c0',
  particleCount = 80,
}) => {
  const particlesRef = useRef<Points>(null);
  
  // Track previous trigger count to detect changes
  const prevTriggerCountRef = useRef(0);

  // Store particle batches - each batch is created when triggerCount increases
  // Each batch contains position, velocity, color, alpha and size data for particles
  const [particleBatches, setParticleBatches] = useState<Array<{
    positions: Float32Array; // XYZ positions of each particle
    velocities: Float32Array; // Movement direction and speed
    colors: Float32Array; // RGB colors
    alphas: Float32Array; // Opacity/transparency values
    sizes: Float32Array; // Size of each particle
  }>>([]);
  
  // Create new particle effects when trigger count changes
  useEffect(() => {
    // Only trigger particle creation when trigger count increases
    if (triggerCount > prevTriggerCountRef.current) {
      const newBatch = createParticleBatch();
      setParticleBatches(prev => [...prev, newBatch]);
      prevTriggerCountRef.current = triggerCount;
    }
  }, [triggerCount]);
  
  // Create a new particle batch
  const createParticleBatch = () => {
    const count = particleCount; // Less particles per batch since we'll have multiple batches
    
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
      
      // Varied particle sizes - now using particleSize instead of referenceSize
      sizes[i] = (0.6 + Math.random()) * particleSize;
      
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
  
  // Particle material with size based on particleSize
  const particleMaterial = useMemo(() => {
    return new PointsMaterial({
      size: particleSize, // Now using the dedicated particleSize
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
  }, [particleSize]); // Dependency updated to particleSize
  
  // Animation for particles
  useFrame(() => {
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
      {/* Particle system - renders all active particle batches as a single instanced mesh */}
      {combinedGeometry && (
        <points ref={particlesRef} geometry={combinedGeometry} material={particleMaterial} />
      )}
    </group>
  );
}; 