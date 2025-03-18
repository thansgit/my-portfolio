import { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export interface TetheredCardProps {
  position?: [number, number, number]
  maxSpeed?: number
  minSpeed?: number
  transparentColor?: string
}

export interface ExtendedRigidBody extends RapierRigidBody {
  lerped?: THREE.Vector3
}

export interface TetheredCardContextState {
  // Experience position (for viewport layout)
  cardExperiencePosition: THREE.Vector3

  // Card state - texture index instead of rotation count
  currentTextureIndex: number

  // Theme settings
  ropeColor: string
  ropeRadius: number

  setCardExperiencePosition: (position: THREE.Vector3) => void
  setCurrentTextureIndex: (index: number) => void
  setRopeColor: (color: string) => void
  setRopeRadius: (radius: number) => void
}

export interface EnvironmentContextState {
  ambientLightIntensity: number
  cardPosition?: [number, number, number]
}
