'use client'

import { Sphere, Billboard } from '@react-three/drei'
import { Vector3 } from 'three'

interface PinheadProps {
  position?: [number, number, number]
  size?: number
  color?: string
  metalness?: number
  roughness?: number
}

export const Pinhead: React.FC<PinheadProps> = ({
  position = [0, 0, 0],
  size = 0.05,
  color = '#c0c0c0', // Silver color
  metalness = 0.9,
  roughness = 0.1,
}) => {
  return (
    <group position={new Vector3(...position)}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <group>
          {/* Spherical pin head with metallic material */}
          <Sphere args={[size, 8, 8]}>
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} depthTest={true} />
          </Sphere>
        </group>

        {/* Pin stem - cylindrical shape attached to the bottom of the spherical head */}
        <mesh position={[0, -size * 1.2, 0]}>
          <cylinderGeometry args={[size * 0.35, size * 0.3, size * 2, 3]} />
          <meshBasicMaterial color='#c0c0c0' />
        </mesh>
      </Billboard>
    </group>
  )
}
