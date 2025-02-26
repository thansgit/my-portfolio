"use client";

import { Canvas } from "@react-three/fiber";
import { ViewportManager } from './viewport/index';
// import { Perf } from 'r3f-perf';

export const Scene = () => (
  <div className="fixed inset-0 w-screen h-screen overflow-hidden">
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      className="absolute w-full h-full"
      resize={{ scroll: false }}
    >
      {/* {process.env.NODE_ENV === 'development' && <Perf position="top-left" />} */}
      <ViewportManager />
    </Canvas>
  </div>
);
