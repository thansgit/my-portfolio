import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useReflectiveMaterial } from '../hooks/useMaterials'
import { useDragHandlers, useHoverState } from '../hooks/useControls'
import { useRestingRotation } from '../hooks/usePhysics'
import { CARD_MODEL_SCALE, CARD_POSITION_OFFSET } from '@/components/three/utils/constants'
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
  const sceneRef = useRef<THREE.Object3D | null>(null)

  const { hovered, setHovered } = useHoverState(onHover, Boolean(dragged))
  const { handlePointerDown, handlePointerUp, handlePointerCancel } = useDragHandlers(nodeRef, onDrag)

  // Apply resting rotation to the card when it's not being dragged
  useRestingRotation(sceneRef, dragged)

  // Set the Scene from the model to the sceneRef
  useEffect(() => {
    if (!nodes || !nodes.Scene) return
    sceneRef.current = nodes.Scene
  }, [nodes])

  // Use the materials hook (now returns both front and back materials)
  // The actual material application happens inside the hook
  useReflectiveMaterial(sceneRef)

  return (
    <ModelWrapper>
      <group
        ref={groupRef}
        rotation={[Math.PI * 0.5, 0, 0]}
        position={CARD_POSITION_OFFSET}
        scale={CARD_MODEL_SCALE}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {nodes.Scene && <primitive object={nodes.Scene} />}
      </group>
    </ModelWrapper>
  )
}
