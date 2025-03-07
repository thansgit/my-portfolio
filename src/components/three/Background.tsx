"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useScreenCenter } from "../../utils/screenUtils";
import { Vector3 } from "three";

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
    intensity: 10,
    color: "white",
    position: [-10, 0, 5],
    rotation: [0, Math.PI / 2, Math.PI / 3],
    scale: [100, 10, 1],
  },
  // Right side lightformers
  {
    intensity: 10,
    color: "white",
    position: [10, 0, 5],
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

// Center lightformer component that uses the screen center
export const CenterLightformer = () => {
  const centerPoint = useScreenCenter();
  
  return (
    <Lightformer
      intensity={0}
      position={[centerPoint.x + 2, centerPoint.y, centerPoint.z + 3]}
      rotation={[0, Math.PI / 3, 0]}
      scale={[10, 10, 1]}
      color="white"
    />
  );
};

// Card-focused lightformer that points at the card
export const CardLightformer = ({ cardPosition = [0, 0, 0] }: { cardPosition?: [number, number, number] }) => {
  return (
    <>
      {/* Top left light with target aimed toward bottom right */}
      <Lightformer
        intensity={2.5}
        position={[cardPosition[0] - 5, cardPosition[1] + 2.5, cardPosition[2] + 2]}
        target={[cardPosition[0] + 2, cardPosition[1] - 2, cardPosition[2] - 0.5]}
        form="rect"
        scale={[10, 12, 1]}
        color="#ffffff"
      />
      
      {/* Bottom right light with target aimed to enhance the diagonal flow */}
      <Lightformer
        intensity={2.5}
        position={[cardPosition[0] + 4, cardPosition[1] - 2.5, cardPosition[2] + 2]}
        target={[cardPosition[0] - 2, cardPosition[1] + 1, cardPosition[2] - 0.5]}
        form="rect"
        scale={[10, 12, 1]}
        color="#f0f8ff" /* Slightly blue-tinted light */
      />
      
    </>
  );
};

// Main background component
export const Background = ({ cardPosition }: { cardPosition?: [number, number, number] }) => (
  <>
    {/* Environment with black background and no lighting contribution */}
    <Environment background blur={0.75}>
      <color attach="background" args={["black"]} />
    </Environment>
    
    {/* Separate lighting environment that doesn't affect the background */}
    <Environment preset={undefined} resolution={256} background={false}>
      {cardPosition && <CardLightformer cardPosition={cardPosition} />}
    </Environment>
  </>
);
