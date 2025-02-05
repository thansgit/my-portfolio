import { createContext, useContext, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

// Constants
export const MOBILE_BREAKPOINT = 768;
export const RESIZE_DELAY = 500;
export const MOBILE_OFFSET = 0;
export const DESKTOP_OFFSET = 0.25;

// Types
export interface ViewportState {
  isMobile: boolean;
  isVisible: boolean;
}

// Context
export const ViewportContext = createContext<ViewportState>({
  isMobile: false,
  isVisible: true
});

// Hook
export const useViewport = () => {
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