'use client'

import * as THREE from 'three'
import { Environment as DreiEnvironment, Lightformer } from '@react-three/drei'
import { useSceneContext } from '@/components/three/hooks'
import { BACKGROUND_MESH_POSITION, BACKGROUND_MESH_SIZE, BACKGROUND_COLOR } from '../utils/constants'

// Card-focused lightformers that points at the card
export const CardLightformer = ({ cardPosition = [0, 0, 0] }: { cardPosition?: [number, number, number] }) => {
  return (
    <>
      <Lightformer
        intensity={3}
        position={[cardPosition[0] - 5, cardPosition[1] + 2.5, cardPosition[2] + 2]}
        target={[cardPosition[0] + 2, cardPosition[1] - 2, cardPosition[2] - 0.5]}
        form='rect'
        scale={[10, 12, 1]}
        color='white'
      />

      <Lightformer
        intensity={3}
        position={[cardPosition[0] + 4, cardPosition[1] - 2.5, cardPosition[2] + 2]}
        target={[cardPosition[0] - 2, cardPosition[1] + 1, cardPosition[2] - 0.5]}
        form='rect'
        scale={[10, 12, 1]}
        color='white'
      />
    </>
  )
}

export const Environment = ({ cardPosition }: { cardPosition?: [number, number, number] }) => {
  // Get state from context
  const { isCardGlowing, cardRotationCount, pinheadPosition } = useSceneContext()

  // Determine glow state - card is glowing if it has rotations
  const shouldGlow = isCardGlowing || cardRotationCount > 0

  // Convert Vector3 to array if needed
  const pinheadPos = pinheadPosition
    ? ([pinheadPosition.x, pinheadPosition.y, pinheadPosition.z] as [number, number, number])
    : ([0, 0, 0] as [number, number, number])

  return (
    <>
      <mesh position={BACKGROUND_MESH_POSITION} renderOrder={-30000}>
        <planeGeometry args={BACKGROUND_MESH_SIZE} />
        <meshBasicMaterial color={BACKGROUND_COLOR} depthWrite={false} />
      </mesh>

      {shouldGlow && pinheadPosition && (
        <pointLight
          position={[pinheadPos[0], pinheadPos[1] + 0.2, pinheadPos[2] + 1]}
          intensity={50}
          color='#ff5555'
          distance={50}
          decay={2}
        />
      )}

      {/* Environment for card reflections only */}
      <DreiEnvironment background={false} resolution={128} preset={undefined}>
        {/* These lightformers will only affect reflections */}
        {cardPosition && <CardLightformer cardPosition={cardPosition} />}
      </DreiEnvironment>
    </>
  )
}
