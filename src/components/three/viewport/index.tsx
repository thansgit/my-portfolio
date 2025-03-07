"use client";

import React, { useState, useEffect, Suspense, useContext, createContext } from 'react';
import { useThree } from '@react-three/fiber';
import { Physics } from "@react-three/rapier";
import { ViewportState } from '../types';
import { MOBILE_BREAKPOINT, RESIZE_DELAY, MOBILE_OFFSET, DESKTOP_OFFSET } from '../constants';
import { TetheredCard } from '../TetheredCard';
import { Background } from '../Background';

// Create context with default values
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
      // Hide content immediately
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

    return () => clearTimeout(timeoutId);
  }, [size.width]);

  return state;
};

// Wrapper component for the TetheredCard element that manages its position based on screen size
const TetheredCardWrapper = () => {
  const { viewport } = useThree();
  const { isMobile } = useContext(ViewportContext);

  // Select x-axis offset based on device type
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET;
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2);

  return <TetheredCard position={[xPosition, 2.5, 0]} />;
};

const SceneContent = () => {
  const { isVisible } = useContext(ViewportContext);

  if (!isVisible) return null;

  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <TetheredCardWrapper />
    </Physics>
  );
};

export const ViewportManager = () => {
  const viewportState = useViewport();
  const { viewport } = useThree();
  
  // Calculate card position the same way as in TetheredCardWrapper
  const isMobile = viewportState.isMobile;
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET;
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2);
  const cardPosition: [number, number, number] = [xPosition, 2.5, 0];

  return (
    <ViewportContext.Provider value={viewportState}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Background cardPosition={cardPosition} />
        <SceneContent />
      </Suspense>
    </ViewportContext.Provider>
  );
}; 