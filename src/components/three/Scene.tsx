"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import Band from "./Band";
import Background from "./Background";

const BandWrapper = () => {
  const { viewport } = useThree();
  const xPosition = viewport.width * 0.3 - viewport.width / 2;
  return <Band position={[xPosition, 5, 0]} />;
};

const Scene = () => (
  <div className="w-full h-full">
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      className="w-full h-full"
      style={{ position: "absolute" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Background />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <BandWrapper />
        </Physics>
      </Suspense>
    </Canvas>
  </div>
);

export default Scene;
