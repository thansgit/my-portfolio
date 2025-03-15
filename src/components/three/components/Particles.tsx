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

  // Use state to track the current trigger count internally
  const [currentTriggerCount, setCurrentTriggerCount] = useState(triggerCount)
  const [isActive, setIsActive] = useState(false)
  const [velocities, setVelocities] = useState<Vector3[]>([])
  const [positions, setPositions] = useState<number[]>([])
  const [lifetimes, setLifetimes] = useState<number[]>([])
  const [rotations, setRotations] = useState<[number, number, number][]>([])
  const [scales, setScales] = useState<Vector3[]>([])
  const [colors, setColors] = useState<Color[]>([])

  // Initialize with zero active particles
  const [activeParticleCount, setActiveParticleCount] = useState(0)

  // Create effects when triggerCount changes
  useEffect(() => {
    if (triggerCount > currentTriggerCount) {
      setCurrentTriggerCount(triggerCount)
      createParticleBatch()
      setIsActive(true)
      setActiveParticleCount(particleCount) // Set active particles only when triggered
    }
  }, [triggerCount, currentTriggerCount, particleCount])

  // Create the geometry for particles
  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    // Pre-populate with positions far away from camera view
    // This prevents the white pixel at center during initialization
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      particlePositions[i3] = 1000 // Far away X
      particlePositions[i3 + 1] = 1000 // Far away Y
      particlePositions[i3 + 2] = 1000 // Far away Z

      particleColors[i3] = 0 // Set color alpha to 0
      particleColors[i3 + 1] = 0 // to make particles invisible
      particleColors[i3 + 2] = 0 // until they're activated
    }

    geo.setAttribute('position', new BufferAttribute(particlePositions, 3))
    geo.setAttribute('color', new BufferAttribute(particleColors, 3))
    return geo
  }, [particleCount])

  // Create the material for particles
  const material = useMemo(() => {
    return new PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: 2,
      map: useTexture ? particleTexture : undefined,
    })
  }, [particleSize, useTexture, particleTexture])

  // Create a new batch of particles
  const createParticleBatch = () => {
    const newVelocities: Vector3[] = []
    const newPositions: number[] = []
    const newLifetimes: number[] = []
    const newRotations: [number, number, number][] = []
    const newScales: Vector3[] = []
    const newColors: Color[] = []

    // Create emitter configuration
    const colorObj = new Color(color)
    const [x, y, z] = position

    for (let i = 0; i < particleCount; i++) {
      // Initial position (small random offset)
      newPositions.push(
        x + (Math.random() - 0.5) * 0.05,
        y + (Math.random() - 0.5) * 0.05,
        z + (Math.random() - 0.5) * 0.05,
      )

      // Velocity - different patterns based on mode
      if (confetti) {
        // Confetti pattern - more spread out, random spin
        newVelocities.push(
          new Vector3(
            (Math.random() - 0.5) * 0.25,
            Math.random() * 0.2 + 0.15, // Mostly upward
            (Math.random() - 0.5) * 0.25,
          ),
        )

        // Random colors for confetti
        const hue = Math.random() * 360
        const partColor = new Color(`hsl(${hue}, 100%, 75%)`)
        newColors.push(partColor)

        // Random rotation for confetti
        newRotations.push([
          Math.random() * Math.PI * 2, // Random initial rotation
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
        ])

        // Flatter scale for confetti
        const scale = Math.random() * 0.8 + 0.6
        newScales.push(new Vector3(scale * 0.3, scale, scale * 0.3))
      } else {
        // Standard particle effect - more focused
        newVelocities.push(
          new Vector3((Math.random() - 0.5) * 0.12, Math.random() * 0.15 + 0.05, (Math.random() - 0.5) * 0.12),
        )

        // Base color with slight variation
        const partColor = new Color(colorObj)
        partColor.r += (Math.random() - 0.5) * 0.1
        partColor.g += (Math.random() - 0.5) * 0.1
        partColor.b += (Math.random() - 0.5) * 0.1
        newColors.push(partColor)

        // No specific rotation for particles
        newRotations.push([0, 0, 0])

        // Uniform scale
        newScales.push(new Vector3(1, 1, 1))
      }

      // Randomize lifetime
      newLifetimes.push(Math.random() * 0.5 + 0.5) // 0.5-1 second lifetime
    }

    setVelocities(newVelocities)
    setPositions(newPositions)
    setLifetimes(newLifetimes)
    setRotations(newRotations)
    setScales(newScales)
    setColors(newColors)
  }

  // Update particles on each frame
  useFrame((_, delta) => {
    if (!isActive || !particlesRef.current || activeParticleCount === 0) return

    // Get buffer attributes
    const posAttr = particlesRef.current.geometry.getAttribute('position')
    const colorAttr = particlesRef.current.geometry.getAttribute('color')

    let allDead = true

    for (let i = 0; i < activeParticleCount; i++) {
      // Skip if no data for this particle yet
      if (i >= lifetimes.length) continue

      // Update lifetime
      lifetimes[i] -= delta
      if (lifetimes[i] > 0) {
        allDead = false
        const i3 = i * 3

        // Update position based on velocity
        positions[i3] += velocities[i].x * delta
        positions[i3 + 1] += velocities[i].y * delta
        positions[i3 + 2] += velocities[i].z * delta

        // Simulate gravity
        velocities[i].y -= delta * 0.4

        // Update position in buffer
        posAttr.setXYZ(i, positions[i3], positions[i3 + 1], positions[i3 + 2])

        // Fade out color based on lifetime
        const fadeScale = lifetimes[i] > 0.7 ? 1 : lifetimes[i] / 0.7
        colorAttr.setXYZ(i, colors[i].r * fadeScale, colors[i].g * fadeScale, colors[i].b * fadeScale)
      } else {
        // Hide dead particles by moving them far away
        posAttr.setXYZ(i, 1000, 1000, 1000)
      }
    }

    // Update buffers
    posAttr.needsUpdate = true
    colorAttr.needsUpdate = true

    // All particles are dead, deactivate system
    if (allDead) {
      setIsActive(false)
      setActiveParticleCount(0) // Reset active particle count when all are dead
    }
  })

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Dispose of geometry and material when component unmounts
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose()
        if (Array.isArray(particlesRef.current.material)) {
          particlesRef.current.material.forEach((m) => m.dispose())
        } else if (particlesRef.current.material) {
          particlesRef.current.material.dispose()
        }
      }

      // Clear all state
      setVelocities([])
      setPositions([])
      setLifetimes([])
      setRotations([])
      setScales([])
      setColors([])
      setIsActive(false)
      setActiveParticleCount(0)
    }
  }, [])

  // Render the particle system
  return <points ref={particlesRef} geometry={geometry} material={material} frustumCulled={false} />
}
