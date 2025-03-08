"use client";

import { Environment as DreiEnvironment, Lightformer } from "@react-three/drei";
import { useScreenCenter } from "../utils/r3fUtils";
import { useThree } from "@react-three/fiber";

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

export const ConfiguredLightformer = ({ config }: { config: LightformerConfigProps }) => (
  <Lightformer
    intensity={config.intensity}
    position={config.position}
    rotation={config.rotation}
    scale={config.scale || [1, 1, 1]}
    color={config.color || "white"}
  />
);

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
      <Lightformer
        intensity={2.5}
        position={[cardPosition[0] - 5, cardPosition[1] + 2.5, cardPosition[2] + 2]}
        target={[cardPosition[0] + 2, cardPosition[1] - 2, cardPosition[2] - 0.5]}
        form="rect"
        scale={[10, 12, 1]}
        color="#ffffff"
      />
      
      <Lightformer
        intensity={2.5}
        position={[cardPosition[0] + 4, cardPosition[1] - 2.5, cardPosition[2] + 2]}
        target={[cardPosition[0] - 2, cardPosition[1] + 1, cardPosition[2] - 0.5]}
        form="rect"
        scale={[10, 12, 1]}
        color="#f0f8ff"
      />
      
    </>
  );
};

// Main environment component (renamed from Background)
export const Environment = ({ 
  cardPosition,
  pinheadPosition,
  isPinheadGlowing,
  isMobile = false
}: { 
  cardPosition?: [number, number, number];
  pinheadPosition?: [number, number, number];
  isPinheadGlowing?: boolean;
  isMobile?: boolean;
}) => {
  const { viewport } = useThree();
  const centerPoint = useScreenCenter();
  
  // Adjust lightformer position based on viewport
  const getLightformerPosition = (): [number, number, number] => {
    console.log("pinheadPosition", pinheadPosition);
    if (!pinheadPosition) return [0, 0, 0];
    
    // For desktop view, we need to adjust the position to account for the viewport offset
    if (!isMobile) {
      // On desktop, use the screen center utility to position the lightformer
      // This ensures it's always centered regardless of the card position
      return [
        centerPoint.x, // Use the screen center X position
        pinheadPosition[1], // Keep the Y position from the pinhead
        pinheadPosition[2] + 0.5 // Keep the Z position from the pinhead with a small offset
      ];
    }
    // For mobile, use the pinhead position directly
    return [
      pinheadPosition[0], 
      pinheadPosition[1], 
      pinheadPosition[2] + 0.5
    ];
  };
  
  return (
    <>
      {/* Environment with black background */}
      <DreiEnvironment background blur={0.75}>
        <color attach="background" args={["black"]} />
        
        {isPinheadGlowing && pinheadPosition && (
          <Lightformer
            intensity={5}
            position={getLightformerPosition()}
            scale={[3, 3, 1]}
            color="#ff5555"
            form="circle"
          />
        )}
      </DreiEnvironment>
      
      {/* Separate lighting environment that doesn't affect the background */}
      <DreiEnvironment preset={undefined} resolution={256} background={false}>
        {cardPosition && <CardLightformer cardPosition={cardPosition} />}
      </DreiEnvironment>
    </>
  );
}; 