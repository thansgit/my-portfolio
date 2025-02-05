"use client";

import { Canvas } from "@react-three/fiber";
import { ViewportManager } from './viewport/index';

const Scene = () => (
  <div 
    className="w-full h-full fixed inset-0"
    style={{
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}
  >
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      style={{ 
        position: "absolute",
        width: '100%',
        height: '100%'
      }}
      resize={{ scroll: false }}
    >
      <ViewportManager />
    </Canvas>
  </div>
);

export default Scene;
