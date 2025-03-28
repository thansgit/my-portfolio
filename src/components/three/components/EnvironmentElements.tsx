'use client'

import { Environment as DreiEnvironment, Lightformer } from '@react-three/drei'
import { useTetheredCardContext } from '@/components/three/context'
import { useEnvironment } from '@/components/three/context/EnvironmentContext'
import { BACKGROUND_MESH_POSITION, BACKGROUND_MESH_SIZE, BACKGROUND_COLOR } from '../utils/constants'

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

export const EnvironmentElements = () => {
  const { ambientLightIntensity } = useEnvironment()
  const { cardExperiencePosition } = useTetheredCardContext()

  // Convert Vector3 to array format
  const cardPositionArray: [number, number, number] = cardExperiencePosition
    ? [cardExperiencePosition.x, cardExperiencePosition.y, cardExperiencePosition.z]
    : [0, 0, 0]

  return (
    <>
      {/* <mesh position={BACKGROUND_MESH_POSITION} renderOrder={-30000}>
        <planeGeometry args={BACKGROUND_MESH_SIZE} />
        <meshBasicMaterial color={BACKGROUND_COLOR} depthWrite={false} />
      </mesh> */}

      {/* Environment for card reflections only */}
      <DreiEnvironment background={false} resolution={128} preset={undefined}>
        {/* These lightformers will only affect reflections */}
        <CardLightformer cardPosition={cardPositionArray} />
      </DreiEnvironment>
    </>
  )
}
