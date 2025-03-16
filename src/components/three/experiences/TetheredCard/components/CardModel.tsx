import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useReflectiveMaterial } from '../utils/materials'
import { useDragHandlers, useHoverState } from '../hooks/useControls'
import {
  CARD_MODEL_SCALE,
  CARD_POSITION_OFFSET,
  CARD_SWING_AMPLITUDE,
  CARD_SWING_FREQUENCY,
  CARD_ROTATION_DAMPING,
} from '@/components/three/utils/constants'
import { ModelWrapper } from '@/components/three/components'

// Model path
const MODEL_PATH = '/assets/models/testcard1.glb'

// Preload the model for better performance
useGLTF.preload(MODEL_PATH, true)

// Type definitions for the GLTF model
type GLTFResult = GLTF & {
  nodes: {
    Scene: THREE.Group & {
      traverse: (callback: (object: THREE.Object3D) => void) => void
    }
  }
  materials: Record<string, THREE.Material>
}

interface CardModelProps {
  nodeRef: React.RefObject<{ translation(): { x: number; y: number; z: number } }>
  dragged: THREE.Vector3 | false
  onHover: (state: boolean) => void
  onDrag: (drag: THREE.Vector3 | false) => void
}

export const CardModel = ({ nodeRef, dragged, onHover, onDrag }: CardModelProps) => {
  const { nodes } = useGLTF(MODEL_PATH) as GLTFResult
  const groupRef = useRef<THREE.Group>(null)
  const initialRotation = useRef(Math.random() * Math.PI * 2)
  const sceneRef = useRef<THREE.Object3D | null>(null)

  const { hovered, setHovered } = useHoverState(onHover, Boolean(dragged))
  const { handlePointerDown, handlePointerUp, handlePointerCancel } = useDragHandlers(nodeRef, onDrag)
  const reflectiveMaterial = useReflectiveMaterial()

  // Add gentle swinging motion when card is at rest
  useFrame((state) => {
    if (!sceneRef.current) return

    if (dragged === false) {
      const time = state.clock.getElapsedTime()
      const swingAngle = Math.sin(time * CARD_SWING_FREQUENCY + initialRotation.current) * CARD_SWING_AMPLITUDE
      sceneRef.current.rotation.z = swingAngle
    } else {
      // Smoothly dampen rotation when card is dragged
      sceneRef.current.rotation.z *= CARD_ROTATION_DAMPING
    }
  })

  // Apply materials to the model meshes
  useEffect(() => {
    if (!reflectiveMaterial || !nodes || !nodes.Scene) return

    nodes.Scene.renderOrder = 10
    sceneRef.current = nodes.Scene

    nodes.Scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      // Store original material for cleanup
      if (!child.userData.originalMaterial) {
        child.userData.originalMaterial = child.material
      }

      const materialName = child.material?.name || ''

      if (materialName.toLowerCase().includes('back')) {
        // Hide back material
        child.visible = false
        child.position.z += 1000
        child.renderOrder = -1
      } else if (materialName.toLowerCase().includes('front')) {
        // Apply reflective material to front
        child.material = reflectiveMaterial
        child.renderOrder = 100
      }
    })

    // Cleanup on unmount
    return () => {
      if (reflectiveMaterial) {
        reflectiveMaterial.dispose()
      }

      nodes.Scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh) || !child.userData.originalMaterial) return
        child.material = child.userData.originalMaterial
      })
    }
  }, [reflectiveMaterial, nodes])

  return (
    <ModelWrapper>
      <group
        ref={groupRef}
        scale={CARD_MODEL_SCALE}
        position={CARD_POSITION_OFFSET}
        rotation={[Math.PI * 0.5, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <primitive object={nodes.Scene} />
      </group>
    </ModelWrapper>
  )
}
