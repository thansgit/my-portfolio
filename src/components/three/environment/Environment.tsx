'use client'

import { ShaderBackground } from '@/components/three/environment/ShaderBackground'
import { Environment as DreiEnvironment, Lightformer } from '@react-three/drei'

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

export const Environment = ({
  cardPosition,
  pinheadPosition,
  isPinheadGlowing,
  isMobile = false,
}: {
  cardPosition?: [number, number, number]
  pinheadPosition?: [number, number, number]
  isPinheadGlowing?: boolean
  isMobile?: boolean
}) => {
  return (
    <>
      {/* <ShaderBackground /> */}
      <mesh position={[0, 0, -20]} renderOrder={-30000}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color='#252730' depthWrite={false} />
      </mesh>

      {isPinheadGlowing && pinheadPosition && (
        <pointLight
          position={[pinheadPosition[0], pinheadPosition[1] + 0.2, pinheadPosition[2] + 1]}
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
