import { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export interface TetheredCardProps {
  position?: [number, number, number]
  maxSpeed?: number
  minSpeed?: number
}

export interface ExtendedRigidBody extends RapierRigidBody {
  lerped?: THREE.Vector3
}

export interface SceneContextState {
  cardPosition: THREE.Vector3

  // Card state
  cardRotationCount: number

  // Theme settings
  ropeColor: string
  ropeRadius: number

  setCardPosition: (position: THREE.Vector3) => void
  incrementCardRotation: () => void
  updateRopeVisuals: (color: string, radius: number) => void
}

export interface EnvironmentContextState {
  ambientLightIntensity: number
  cardPosition?: [number, number, number]
}

// Configuration context state
export interface ConfigContextState {
  // Physics settings
  cardPhysics: {
    maxSpeed: number
    minSpeed: number
  }

  // Visual settings
  ropeStyling: {
    initialRadius: number
    minRadius: number
    colorStretchSpeed: number
    radiusStretchSpeed: number
  }

  // Colors and themes
  colors: {
    pinhead: string
    ropeDefault: string
  }
}
