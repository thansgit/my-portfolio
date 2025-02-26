"use client";

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { useThree } from '@react-three/fiber';
import { Physics } from "@react-three/rapier";
import { ViewportState } from '../types';
import { MOBILE_BREAKPOINT, RESIZE_DELAY, MOBILE_OFFSET, DESKTOP_OFFSET } from '../constants/viewport';
import { Band } from '../Band';
import { Background } from '../Background';

// Context
const ViewportContext = createContext<ViewportState>({
  isMobile: false,
  isVisible: true
});

// Hook
const useViewport = () => {
  const { size } = useThree();
  const [state, setState] = useState<ViewportState>({
    isMobile: size.width < MOBILE_BREAKPOINT,
    isVisible: true
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateViewport = () => {
      // Hide content immediately on any dimension change
      setState(prev => ({ ...prev, isVisible: false }));

      // Show content and update mobile state after delay
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setState({
          isMobile: size.width < MOBILE_BREAKPOINT,
          isVisible: true
        });
      }, RESIZE_DELAY);
    };

    updateViewport();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [size.width, size.height]); // Watch both dimensions

  return state;
};

// Components
const BandWrapper = () => {
  const { viewport } = useThree();
  const { isMobile } = useContext(ViewportContext);

  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET;
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2);

  return <Band position={[xPosition, 4, 0]} />;
};

const SceneContent = () => {
  const { isVisible } = useContext(ViewportContext);

  if (!isVisible) return null;

  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <BandWrapper />
    </Physics>
  );
};

export const ViewportManager = () => {
  const viewportState = useViewport();

  return (
    <ViewportContext.Provider value={viewportState}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Background />
        <SceneContent />
      </Suspense>
    </ViewportContext.Provider>
  );
}; 