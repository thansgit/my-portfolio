"use client";

import { Environment, Lightformer } from "@react-three/drei";

// Types
export interface LightformerConfigProps {
  intensity: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}

// Light configurations
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

// Individual lightformer component
export const ConfiguredLightformer = ({ config }: { config: LightformerConfigProps }) => (
  <Lightformer
    intensity={config.intensity}
    position={config.position}
    rotation={config.rotation}
    scale={config.scale || [1, 1, 1]}
    color={config.color || "white"}
  />
);

// Main background component
export const Background = () => (
  <Environment background blur={0.75}>
    <color attach="background" args={["black"]} />
    {lightformerConfigs.map((config, index) => (
      <ConfiguredLightformer key={index} config={config} />
    ))}
  </Environment>
);
