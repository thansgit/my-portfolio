"use client";

import React, { useState, useEffect, Suspense, useContext } from 'react';
import { useThree } from '@react-three/fiber';
import { Physics } from "@react-three/rapier";
import { ViewportContext, useViewport } from '@/components/three/hooks';
import { MOBILE_OFFSET, DESKTOP_OFFSET } from '../utils/constants';
import { TetheredCard } from '../objects/TetheredCard';
import { Environment } from '../environment/Environment';

// Wrapper component for the TetheredCard element that manages its position based on screen size
const TetheredCardWrapper = ({ onPinheadStateChange }: { onPinheadStateChange?: (position: [number, number, number], isGlowing: boolean) => void }) => {
  const { viewport } = useThree();
  const { isMobile } = useContext(ViewportContext);

  // Select x-axis offset based on device type
  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET;
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2);

  return <TetheredCard position={[xPosition, 2.5, 0]} onPinheadStateChange={onPinheadStateChange} />;
};

const SceneContent = ({ onPinheadStateChange }: { onPinheadStateChange?: (position: [number, number, number], isGlowing: boolean) => void }) => {
  const { isVisible } = useContext(ViewportContext);

  if (!isVisible) return null;

  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <TetheredCardWrapper onPinheadStateChange={onPinheadStateChange} />
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

  const [pinheadPosition, setPinheadPosition] = useState<[number, number, number] | undefined>(undefined);
  const [isPinheadGlowing, setIsPinheadGlowing] = useState<boolean>(false);

  const handlePinheadStateChange = (position: [number, number, number], isGlowing: boolean) => {
    setPinheadPosition(position);
    setIsPinheadGlowing(isGlowing);
  };
  
  // Turn off glowing when content becomes invisible
  useEffect(() => {
    if (!viewportState.isVisible && isPinheadGlowing) {
      setIsPinheadGlowing(false);
    }
  }, [viewportState.isVisible, isPinheadGlowing]);

  return (
    <ViewportContext.Provider value={viewportState}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Environment 
          cardPosition={cardPosition} 
          pinheadPosition={pinheadPosition}
          isPinheadGlowing={isPinheadGlowing}
          isMobile={viewportState.isMobile}
        />
        <SceneContent onPinheadStateChange={handlePinheadStateChange} />
      </Suspense>
    </ViewportContext.Provider>
  );
}; 