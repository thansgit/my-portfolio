"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { Physics } from "@react-three/rapier";
import Band from "./Band";
import Background from "./Background";

const BandWrapper = () => {
  const { viewport } = useThree();
  const [isMobile, setIsMobile] = useState(viewport.width < 7.68);

  // Update isMobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // For mobile: no offset, just center it (0)
  // For desktop: keep the -0.35 offset
  const xOffset = isMobile ? 0 : 0.2;
  
  // For mobile: don't subtract half width to keep it centered
  // For desktop: keep subtracting half width
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2);

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
