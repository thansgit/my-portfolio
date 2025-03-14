import { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// TetheredCard types
export interface TetheredCardProps {
  position?: [number, number, number]
  maxSpeed?: number
  minSpeed?: number
  onPinheadStateChange?: (position: [number, number, number], isGlowing: boolean) => void
  debug?: boolean
  glassColor?: string
  distortionStrength?: number
  refractionRatio?: number
}

export interface ExtendedRigidBody extends RapierRigidBody {
  lerped?: THREE.Vector3
}
