"use client";

import { Lightformer } from "@react-three/drei";

export interface LightformerConfigProps {
  intensity: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}

export const lightformerConfigs: LightformerConfigProps[] = [
  // Left side lightformers
  {
    intensity: 2,
    color: "white",
    position: [0, -1, 5],
    rotation: [0, 0, Math.PI / 3],
    scale: [100, 0.1, 1],
  },
  {
    intensity: 3,
    color: "white",
    position: [-1, -1, 1],
    rotation: [0, 0, Math.PI / 3],
    scale: [100, 0.1, 1],
  },
  {
    intensity: 3,
    color: "white",
    position: [1, 1, 1],
    rotation: [0, 0, Math.PI / 3],
    scale: [100, 0.1, 1],
  },
  {
    intensity: 10,
    color: "white",
    position: [-10, 0, 14],
    rotation: [0, Math.PI / 2, Math.PI / 3],
    scale: [100, 10, 1],
  },
  // Right side lightformers
  {
    intensity: 2,
    color: "white",
    position: [0, 1, 5],
    rotation: [0, 0, -Math.PI / 3],
    scale: [100, 0.1, 1],
  },
  {
    intensity: 3,
    color: "white",
    position: [1, 1, 1],
    rotation: [0, 0, -Math.PI / 3],
    scale: [100, 0.1, 1],
  },
  {
    intensity: 3,
    color: "white",
    position: [-1, -1, 1],
    rotation: [0, 0, -Math.PI / 3],
    scale: [100, 0.1, 1],
  },
  {
    intensity: 10,
    color: "white",
    position: [10, 0, 14],
    rotation: [0, -Math.PI / 2, -Math.PI / 3],
    scale: [100, 10, 1],
  },
];

export const ConfiguredLightformer = ({ config }: { config: LightformerConfigProps }) => (
  <Lightformer
    intensity={config.intensity}
    color={config.color || "white"}
    position={config.position}
    rotation={config.rotation}
    scale={config.scale || [100, 0.1, 1]}
  />
); 