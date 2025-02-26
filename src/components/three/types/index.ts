import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

// Viewport types
export interface ViewportState {
  isMobile: boolean;
  isVisible: boolean;
}

// Band types
export interface BandProps {
  position?: [number, number, number];
  maxSpeed?: number;
  minSpeed?: number;
}

export interface ExtendedRigidBody extends RapierRigidBody {
  lerped?: THREE.Vector3;
} 