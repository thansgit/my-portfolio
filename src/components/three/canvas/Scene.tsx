"use client";

import React, { Suspense, lazy } from 'react';
import { Canvas } from "@react-three/fiber";
import { Perf } from 'r3f-perf';

// Lazy load the ViewportManager component
const ViewportManager = lazy(() => import('./ViewportManager').then(mod => ({ default: mod.ViewportManager })));

export const Scene = () => (
  <div className="fixed inset-0 w-screen h-screen overflow-hidden">
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      className="absolute w-full h-full"
      resize={{ scroll: false }}
      dpr={[1, 2]} // Limit pixel ratio for better performance
    >
     {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
      <Suspense fallback={null}>
        <ViewportManager />
      </Suspense>
    </Canvas>
  </div>
); 