"use client";

import React, { useState, useEffect, Suspense, useContext, createContext } from 'react';
import { useThree } from '@react-three/fiber';
import { Physics } from "@react-three/rapier";
import { ViewportState } from '../utils/types';
import { MOBILE_BREAKPOINT, RESIZE_DELAY, MOBILE_OFFSET, DESKTOP_OFFSET } from '../utils/constants';
import { TetheredCard } from '../objects/TetheredCard';
import { Environment } from '../environment/Environment';

const ViewportContext = createContext<ViewportState>({
  isMobile: false,
  isVisible: true
});

const useViewport = () => {
  const { size } = useThree();
  const [state, setState] = useState<ViewportState>({
    isMobile: size.width < MOBILE_BREAKPOINT,
    isVisible: true
  });

  // Handle resize events
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

  useEffect(() => {
    if (!state.isMobile) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollThreshold = viewportHeight * 0.2; // 50% of viewport height

      
      setState(prev => {
        const shouldBeVisible = scrollY < scrollThreshold;
        if (prev.isVisible !== shouldBeVisible) {
          return { ...prev, isVisible: shouldBeVisible };
        }
        return prev;
      });
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [state.isMobile]);
  
  return state;
};

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

  // State for pinhead position and glowing status
  const [pinheadPosition, setPinheadPosition] = useState<[number, number, number] | undefined>(undefined);
  const [isPinheadGlowing, setIsPinheadGlowing] = useState<boolean>(false);

  // Handler for pinhead state changes
  const handlePinheadStateChange = (position: [number, number, number], isGlowing: boolean) => {
    setPinheadPosition(position);
    setIsPinheadGlowing(isGlowing);
  };

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