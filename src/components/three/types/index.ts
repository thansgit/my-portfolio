import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

// Viewport types
export interface ViewportState {
  isMobile: boolean;
  isVisible: boolean;
}

// TetheredCard types
export interface TetheredCardProps {
  position?: [number, number, number];
  maxSpeed?: number;
  minSpeed?: number;
}

export interface ExtendedRigidBody extends RapierRigidBody {
  lerped?: THREE.Vector3;
} 