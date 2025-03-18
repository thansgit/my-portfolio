import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useReflectiveMaterial } from '../hooks/useMaterials'
import { useRestingRotation } from '../hooks/usePhysics'
import { CARD_MODEL_SCALE, CARD_POSITION_OFFSET } from '@/components/three/utils/constants'
import { ModelWrapper } from '@/components/three/components'
import { useTetheredCardContext } from '@/components/three/context'

const MODEL_PATH = '/assets/models/card.glb'

useGLTF.preload(MODEL_PATH, true)

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
  transparentColor?: string
}

export const CardModel = ({ nodeRef, dragged, transparentColor }: CardModelProps) => {
  const { nodes } = useGLTF(MODEL_PATH) as GLTFResult
  const groupRef = useRef<THREE.Group>(null)
  const sceneRef = useRef<THREE.Object3D | null>(null)
  
  // Get rotation count from context
  const { cardRotationCount } = useTetheredCardContext()

  useRestingRotation(sceneRef, dragged)

  useEffect(() => {
    if (!nodes || !nodes.Scene) return
    sceneRef.current = nodes.Scene
  }, [nodes])

  // Pass rotation count to material hook
  useReflectiveMaterial(sceneRef, { 
    transparentColor,
    rotationCount: cardRotationCount 
  })

  // Log when rotation count changes to debug material updates
  useEffect(() => {
    console.log(`CardModel received rotation count: ${cardRotationCount}`)
  }, [cardRotationCount])

  return (
    <ModelWrapper>
      <group ref={groupRef} rotation={[Math.PI * 0.5, 0, 0]} position={CARD_POSITION_OFFSET} scale={CARD_MODEL_SCALE}>
        {nodes.Scene && <primitive object={nodes.Scene} />}
      </group>
    </ModelWrapper>
  )
}
