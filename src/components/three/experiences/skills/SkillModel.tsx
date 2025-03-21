'use client'

import React, { useRef, useMemo, Suspense, useState, useCallback, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Map of skill names to actual model names in the glTF
const SKILL_TO_MODEL_NAME: Record<string, string> = {
  typescript: 'typescript',
  react: 'react',
  nextjs: 'nextjs',
  'three.js': 'three',
  threejs: 'three',
  tailwind: 'tailwind',
}

// Model-specific adjustments
const MODEL_ADJUSTMENTS: Record<
  string,
  {
    scale: number
    rotation: [number, number, number]
    position: [number, number, number]
  }
> = {
  typescript: { scale: 1, rotation: [0, 0, 0], position: [0, 0, 0] },
  react: { scale: 1, rotation: [0, 0, 0], position: [0, 0, 0] },
  nextjs: { scale: 1, rotation: [0, 0, 0], position: [0, 0, 0] },
  three: { scale: 1, rotation: [0, 0, 0], position: [0, 0, 0] },
  tailwind: { scale: 0.8, rotation: [0, 0, 0], position: [0, 0, 0] },
}

// Default adjustments for models without specific settings
const DEFAULT_ADJUSTMENTS = {
  scale: 1,
  rotation: [0, 0, 0] as [number, number, number],
  position: [0, 0, 0] as [number, number, number],
}

// Create a red metallic material
const createRedMetallicMaterial = () => {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c9243f'), // Deep red
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.5, // Increased for better reflections
  })
  return material
}

// Type for GLTF result
interface GLTFResult extends THREE.Object3D {
  nodes: { [key: string]: THREE.Mesh }
  scene: THREE.Group
}

// Create a context to share rotation speed
const RotationContext = React.createContext<React.MutableRefObject<number>>({
  current: 0.5,
})

// Component for the actual 3D model with rotation animation
function Model({ skillName = 'typescript', scale = 1 }: { skillName: string; scale?: number }) {
  const rotationRef = useRef<THREE.Group>(null)
  const modelRef = useRef<THREE.Group>(null)
  const { scene, nodes } = useGLTF('/assets/models/logos.glb') as unknown as GLTFResult
  const rotationSpeedRef = useContext(RotationContext)

  // Get the model name by mapping skill name to model name
  const modelName = SKILL_TO_MODEL_NAME[skillName.toLowerCase()] || skillName.toLowerCase()

  // Get model-specific adjustments or use defaults
  const adjustments = MODEL_ADJUSTMENTS[modelName] || DEFAULT_ADJUSTMENTS

  // Create a single mesh for this specific model
  const modelMesh = useMemo(() => {
    // Find the model node for this skill
    let modelNode = nodes[modelName]

    // Debug info
    console.log(`Model: ${skillName} -> Looking for node: ${modelName}`)
    console.log('Available nodes:', Object.keys(nodes))

    // If the model isn't found with the default naming, try alternative names
    if (!modelNode) {
      // If looking for 'three' but it doesn't exist, try both 'threejs' and 'three.js'
      if (modelName === 'three') {
        modelNode = nodes['threejs'] || nodes['three.js']
      }
      // Try a direct lookup with the skill name (without mapping)
      if (!modelNode) {
        modelNode = nodes[skillName.toLowerCase()]
      }
    }

    // Debug after trying alternative names
    console.log('Found node:', modelNode ? modelNode.name : 'not found')

    if (!modelNode) {
      console.warn(`No model found for ${skillName} (mapped to ${modelName})`)
      // Create a fallback cube if model not found
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = createRedMetallicMaterial()
      return new THREE.Mesh(geometry, material)
    }

    // Clone just this one mesh
    const clonedMesh = modelNode.clone()

    // Apply model-specific adjustments
    clonedMesh.position.set(...adjustments.position)
    clonedMesh.rotation.set(...adjustments.rotation)

    const s = adjustments.scale
    clonedMesh.scale.set(s, s, s)

    // Apply red metallic material
    clonedMesh.material = createRedMetallicMaterial()

    return clonedMesh
  }, [nodes, skillName, modelName, adjustments])

  // Apply rotation animation to the rotation group based on hover position
  useFrame((_, delta) => {
    if (rotationRef.current && rotationSpeedRef.current !== undefined) {
      rotationRef.current.rotation.y += rotationSpeedRef.current * delta
    }
  })

  return (
    <group ref={modelRef} scale={scale} position={[0, 0, 0]}>
      <group ref={rotationRef}>
        <primitive object={modelMesh} />
      </group>
    </group>
  )
}

// Main component to render the 3D skill model
export function SkillModel({ skillName, className = '' }: { skillName: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rotationSpeedRef = useRef<number>(0.5)

  // Handle mouse movement over the container
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    // Get the container dimensions
    const rect = containerRef.current.getBoundingClientRect()
    const containerWidth = rect.width

    // Calculate mouse position relative to center (normalized from -1 to 1)
    const centerX = rect.left + containerWidth / 2
    const mouseX = e.clientX
    const relativeX = (mouseX - centerX) / (containerWidth / 2)

    // Set rotation speed based on mouse position
    // Center = 0 speed, Edges = max speed in corresponding direction
    rotationSpeedRef.current = -relativeX * 1.5

    // If we're close to center, stop rotation
    if (Math.abs(relativeX) < 0.2) {
      rotationSpeedRef.current = 0
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    rotationSpeedRef.current = 0.5 // Reset to default speed
  }, [])

  return (
    <div
      className={`h-full w-full ${className}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <RotationContext.Provider value={rotationSpeedRef}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: 'transparent' }}>
          <Suspense fallback={null}>
            {/* Minimal ambient light - just enough to prevent complete darkness */}
            <ambientLight intensity={0.2} />

            {/* Main directional light from the front */}
            <directionalLight position={[0, 0, 10]} intensity={5} color='#ffffff' />

            {/* Environment map for realistic reflections */}
            <Environment preset='sunset' background={false} />

            {/* Center the model */}
            <Center position={[0, 0, 0]}>
              <Model skillName={skillName} scale={2.5} />
            </Center>
          </Suspense>
        </Canvas>
      </RotationContext.Provider>
    </div>
  )
}
