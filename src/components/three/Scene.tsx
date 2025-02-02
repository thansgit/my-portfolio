'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Background from './Background'

const Scene = () => {
  return (
<Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Background />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
