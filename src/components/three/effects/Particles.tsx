'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { BufferGeometry, BufferAttribute, PointsMaterial, Color, Points, Vector3, TextureLoader } from 'three'

interface ParticlesProps {
  triggerCount: number // Increases to trigger new particles
  position?: [number, number, number]
  particleSize?: number
  particleCount?: number
  color?: string
  texture?: string // URL to texture image (optional)
  confetti?: boolean // Option to make it look like confetti
}

export const Particles: React.FC<ParticlesProps> = ({
  triggerCount = 0,
  position = [0, 0, 0],
  particleSize = 0.025,
  color = '#c0c0c0',
  particleCount = 80,
  texture,
  confetti = false,
}) => {
  const particlesRef = useRef<Points>(null)

  // Load texture only if provided and confetti mode is off
  const useTexture = texture && !confetti
  const particleTexture = useTexture ? useLoader(TextureLoader, texture) : null

  // Track previous trigger count to detect changes
  const prevTriggerCountRef = useRef(0)

  // Store particle batches - each batch is created when triggerCount increases
  const [particleBatches, setParticleBatches] = useState<
    Array<{
      positions: Float32Array
      velocities: Float32Array
      colors: Float32Array
      alphas: Float32Array
      sizes: Float32Array
    }>
  >([])

  // Create new particle effects when trigger count changes
  useEffect(() => {
    // Only trigger particle creation when trigger count increases
    if (triggerCount > prevTriggerCountRef.current) {
      const newBatch = createParticleBatch()

      // Limit the number of active batches to prevent memory issues
      const MAX_BATCHES = 3 // Adjust this number based on your performance needs

      setParticleBatches((prev) => {
        // If we already have the maximum number of batches, remove the oldest one
        if (prev.length >= MAX_BATCHES) {
          return [...prev.slice(1), newBatch]
        }
        // Otherwise, just add the new batch
        return [...prev, newBatch]
      })

      prevTriggerCountRef.current = triggerCount
    }
  }, [triggerCount])

  // Create a new particle batch
  const createParticleBatch = () => {
    const count = particleCount

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const alphas = new Float32Array(count)
    const sizes = new Float32Array(count)

    // Initialize particles at center
    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Start at center
      positions[i3] = 0
      positions[i3 + 1] = 0
      positions[i3 + 2] = 0

      // Random direction for velocity
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      // Calculate velocity away from center
      const velocity = 0.02 + Math.random() * 0.04
      velocities[i3] = Math.sin(phi) * Math.cos(theta) * velocity
      velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * velocity
      velocities[i3 + 2] = Math.cos(phi) * velocity

      if (confetti) {
        // For confetti, use vibrant random colors
        const confettiColors = [
          new Color(1, 0.3, 0.3), // Red
          new Color(0.3, 1, 0.3), // Green
          new Color(0.3, 0.3, 1), // Blue
          new Color(1, 1, 0.3), // Yellow
          new Color(1, 0.3, 1), // Pink
          new Color(0.3, 1, 1), // Cyan
        ]

        // Select a random confetti color
        const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]

        colors[i3] = randomColor.r
        colors[i3 + 1] = randomColor.g
        colors[i3 + 2] = randomColor.b
      } else {
        // Default color behavior
        const particleColor = new Color(color)
        particleColor.offsetHSL(0, 0, 0.2) // Brighten
        colors[i3] = particleColor.r
        colors[i3 + 1] = particleColor.g
        colors[i3 + 2] = particleColor.b
      }

      // Varied particle sizes
      sizes[i] = (0.6 + Math.random()) * particleSize

      // Set initial alpha
      alphas[i] = 1.0
    }

    return { positions, colors, velocities, alphas, sizes }
  }

  // Prepare geometry with all particle batches combined
  const combinedGeometry = useMemo(() => {
    if (particleBatches.length === 0) return null

    const totalParticles = particleBatches.reduce((sum, batch) => sum + batch.alphas.length, 0)
    const geometry = new BufferGeometry()

    const positions = new Float32Array(totalParticles * 3)
    const colors = new Float32Array(totalParticles * 3)
    const sizes = new Float32Array(totalParticles)

    let offset = 0
    particleBatches.forEach((batch) => {
      const count = batch.alphas.length

      // Copy positions and colors
      positions.set(batch.positions, offset * 3)
      colors.set(batch.colors, offset * 3)
      sizes.set(batch.sizes, offset)

      offset += count
    })

    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('color', new BufferAttribute(colors, 3))
    geometry.setAttribute('size', new BufferAttribute(sizes, 1))

    return geometry
  }, [particleBatches])

  // Cleanup geometry when component unmounts or when geometry changes
  useEffect(() => {
    // Store reference to current geometry for cleanup
    const currentGeometry = combinedGeometry

    // Return cleanup function
    return () => {
      if (currentGeometry) {
        currentGeometry.dispose()
      }
    }
  }, [combinedGeometry])

  // Particle material setup
  const particleMaterial = useMemo(() => {
    const material = new PointsMaterial({
      size: particleSize,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    })

    // Apply texture if available and not in confetti mode
    if (particleTexture) {
      material.map = particleTexture
      material.alphaTest = 0.1
      material.alphaMap = particleTexture
    }

    return material
  }, [particleSize, particleTexture])

  // Cleanup material when component unmounts or when material changes
  useEffect(() => {
    // Store reference to current material for cleanup
    const currentMaterial = particleMaterial

    // Return cleanup function
    return () => {
      if (currentMaterial) {
        currentMaterial.dispose()
      }
    }
  }, [particleMaterial])

  // Animation for particles
  useFrame(() => {
    // Skip particle processing if no batches
    if (particleBatches.length === 0 || !particlesRef.current) return

    let needsUpdate = false
    let needsRebuild = false

    // Update each batch
    const updatedBatches = particleBatches.map((batch) => {
      const { positions, velocities, alphas } = batch
      const count = alphas.length
      let batchActive = false

      // Update each particle in this batch
      for (let i = 0; i < count; i++) {
        const i3 = i * 3

        // Update positions based on velocities
        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]

        // Gradually decrease alpha
        alphas[i] -= 0.005

        // Keep track if any particles in this batch are still active
        if (alphas[i] > 0) {
          batchActive = true
        }
      }

      needsUpdate = true
      // Return the batch if it has active particles
      return { ...batch, active: batchActive }
    })

    // Filter out inactive batches
    const activeBatches = updatedBatches.filter((batch) => batch.active)

    // If we removed any batches, we need to rebuild the geometry
    if (activeBatches.length !== particleBatches.length) {
      setParticleBatches(activeBatches)
      needsRebuild = true
    } else if (needsUpdate && particlesRef.current && combinedGeometry) {
      // If there are active batches and we don't need to rebuild, just update positions
      let offset = 0
      activeBatches.forEach((batch) => {
        const posAttr = particlesRef.current!.geometry.attributes.position.array as Float32Array
        const count = batch.alphas.length

        // Update positions in the combined geometry
        for (let i = 0; i < count; i++) {
          const i3 = i * 3
          const targetIdx = (offset + i) * 3

          posAttr[targetIdx] = batch.positions[i3]
          posAttr[targetIdx + 1] = batch.positions[i3 + 1]
          posAttr[targetIdx + 2] = batch.positions[i3 + 2]
        }

        offset += count
      })

      particlesRef.current.geometry.attributes.position.needsUpdate = true

      // Update opacity based on average of all alphas
      if (particlesRef.current.material instanceof PointsMaterial) {
        const allAlphas = activeBatches.flatMap((batch) => Array.from(batch.alphas))
        const avgAlpha = allAlphas.reduce((sum, alpha) => sum + Math.max(0, alpha), 0) / allAlphas.length
        particlesRef.current.material.opacity = avgAlpha
      }
    }
  })

  return (
    <group position={new Vector3(...position)}>
      {/* Particle system - renders all active particle batches as a single instanced mesh */}
      {combinedGeometry && <points ref={particlesRef} geometry={combinedGeometry} material={particleMaterial} />}
    </group>
  )
}
