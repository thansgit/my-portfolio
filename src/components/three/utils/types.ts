import { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { RefObject } from 'react'

// TetheredCard types
export interface TetheredCardProps {
  position?: [number, number, number]
  maxSpeed?: number
  minSpeed?: number
  onPinheadStateChange?: (position: [number, number, number], isGlowing: boolean) => void
}

export interface ExtendedRigidBody extends RapierRigidBody {
  lerped?: THREE.Vector3
}

// Scene context state
export interface SceneContextState {
  // Visual settings
  cardPosition: THREE.Vector3
  pinheadPosition: THREE.Vector3

  // Card state
  isCardGlowing: boolean
  cardRotationCount: number

  // Theme settings
  ropeColor: string
  ropeRadius: number

  // Action handlers
  setCardPosition: (position: THREE.Vector3) => void
  setPinheadPosition: (position: THREE.Vector3) => void
  setCardGlowing: (isGlowing: boolean) => void
  incrementCardRotation: () => void
  updateRopeVisuals: (color: string, radius: number) => void
}

// Environment context state
export interface EnvironmentContextState {
  // Lighting
  ambientLightIntensity: number

  // Positions
  cardPosition?: [number, number, number]
  pinheadPosition?: [number, number, number]

  // States
  isPinheadGlowing: boolean

  // Handlers
  updatePinheadState: (position: [number, number, number], isGlowing: boolean) => void
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

  // Particle settings
  particleSettings: {
    size: number
    count: number
  }

  // Colors and themes
  colors: {
    pinhead: string
    ropeDefault: string
  }
}
