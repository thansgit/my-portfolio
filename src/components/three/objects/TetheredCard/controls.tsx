"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import { RapierRigidBody } from '@react-three/rapier';

/**
 * Handles touch and pointer interactions for the TetheredCard component
 * Manages browser-level touch event behavior and cursor styles
 */
export const useTouchHandling = (dragged: THREE.Vector3 | false, hovered: boolean) => {
  // Prevent default touch behavior when dragging
  useEffect(() => {
    const preventTouchDefault = (e: TouchEvent) => {
      // Only prevent default if we're actually dragging the object
      if (dragged && e.cancelable) {
        e.preventDefault();
      }
    };
    
    // Only add the event listener when dragging
    if (dragged) {
      document.addEventListener('touchmove', preventTouchDefault, { passive: false });
      return () => document.removeEventListener('touchmove', preventTouchDefault);
    }
    
    return undefined;
  }, [dragged]);

  // Add a separate effect to handle touch events on the canvas
  useEffect(() => {
    // Find the canvas element
    const canvas = document.querySelector('canvas');
    
    if (!canvas) return;
    
    // Function to handle touchstart on the canvas
    const handleCanvasTouchStart = (e: TouchEvent) => {
      // Don't prevent default here to allow scrolling when not interacting with the 3D object
    };
    
    // Function to handle touchmove on the canvas
    const handleCanvasTouchMove = (e: TouchEvent) => {
      // Only prevent default if we're dragging the object
      if (dragged && e.cancelable) {
        e.preventDefault();
      }
    };
    
    // Add event listeners to the canvas only
    canvas.addEventListener('touchstart', handleCanvasTouchStart);
    canvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
    
    // Clean up
    return () => {
      canvas.removeEventListener('touchstart', handleCanvasTouchStart);
      canvas.removeEventListener('touchmove', handleCanvasTouchMove);
    };
  }, [dragged]);

  // Update cursor based on hover state
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged]);
};

/**
 * Rotation tracking for the TetheredCard component
 * Detects clockwise and counter-clockwise rotations
 */
interface RotationTrackerProps {
  // Use the card instead of j4
  card: React.RefObject<RapierRigidBody>;
  fixed: React.RefObject<RapierRigidBody>;
  isDragging: boolean;
}

// Define quadrants in the XY plane (visible plane from the front view)
enum Quadrant {
  Q1 = 1, // (+X, +Y) - top right
  Q2 = 2, // (-X, +Y) - top left
  Q3 = 3, // (-X, -Y) - bottom left
  Q4 = 4, // (+X, -Y) - bottom right
}

export const useRotationTracker = ({ card, fixed, isDragging }: RotationTrackerProps) => {
  // Current quadrant and history
  const currentQuadrant = useRef<Quadrant | null>(null);
  const lastQuadrants = useRef<Quadrant[]>([]);
  
  // Rotation counts
  const clockwiseRotations = useRef<number>(0);
  const counterClockwiseRotations = useRef<number>(0);
  
  // Animation frame reference
  const frameId = useRef<number | null>(null);
  
  // Whether we're actively tracking
  const isTracking = useRef<boolean>(false);
  
  // Last time a rotation was detected
  const lastRotationTime = useRef<number>(0);
  
  // Track if the card is moving
  const isMoving = useRef<boolean>(false);
  const lastPosition = useRef<THREE.Vector3 | null>(null);
  
  // Configuration parameters - simplified but keeping the essential ones
  const MIN_ROTATION_INTERVAL = 250; // Minimum time between detected rotations (ms)
  const MIN_DISTANCE_FROM_CENTER = 0.05; // Minimum distance to consider quadrant changes valid
  const MIN_MOVEMENT_THRESHOLD = 0.001; // Minimum movement to consider the card moving

  // Get the current quadrant from XY position
  const getQuadrant = (x: number, y: number): Quadrant => {
    if (x >= 0 && y >= 0) return Quadrant.Q1;      // Top right
    if (x < 0 && y >= 0) return Quadrant.Q2;       // Top left
    if (x < 0 && y < 0) return Quadrant.Q3;        // Bottom left
    return Quadrant.Q4;                            // Bottom right
  };

  // Process a new quadrant
  const processQuadrant = (quadrant: Quadrant) => {
    // Skip if same as last quadrant
    if (lastQuadrants.current.length > 0 && 
        lastQuadrants.current[lastQuadrants.current.length - 1] === quadrant) {
      return;
    }
    
    // Add to history
    lastQuadrants.current.push(quadrant);
    
    // Keep history at a manageable size
    if (lastQuadrants.current.length > 6) {
      lastQuadrants.current.shift();
    }
    
    // Check for completed rotations
    checkForRotation();
  };

  // Check for rotation patterns in the history
  const checkForRotation = () => {
    const now = performance.now();
    // Don't detect rotations too quickly
    if (now - lastRotationTime.current < MIN_ROTATION_INTERVAL) return;
    
    const history = lastQuadrants.current;
    if (history.length < 5) return;
    
    const last5 = history.slice(-5);
    
    // Clockwise patterns (Q1→Q2→Q3→Q4→Q1, etc.)
    const clockwisePatterns = [
      [Quadrant.Q1, Quadrant.Q2, Quadrant.Q3, Quadrant.Q4, Quadrant.Q1],
      [Quadrant.Q2, Quadrant.Q3, Quadrant.Q4, Quadrant.Q1, Quadrant.Q2],
      [Quadrant.Q3, Quadrant.Q4, Quadrant.Q1, Quadrant.Q2, Quadrant.Q3],
      [Quadrant.Q4, Quadrant.Q1, Quadrant.Q2, Quadrant.Q3, Quadrant.Q4]
    ];
    
    // Counter-clockwise patterns (Q1→Q4→Q3→Q2→Q1, etc.)
    const counterClockwisePatterns = [
      [Quadrant.Q1, Quadrant.Q4, Quadrant.Q3, Quadrant.Q2, Quadrant.Q1],
      [Quadrant.Q2, Quadrant.Q1, Quadrant.Q4, Quadrant.Q3, Quadrant.Q2],
      [Quadrant.Q3, Quadrant.Q2, Quadrant.Q1, Quadrant.Q4, Quadrant.Q3],
      [Quadrant.Q4, Quadrant.Q3, Quadrant.Q2, Quadrant.Q1, Quadrant.Q4]
    ];
    
    // Check for clockwise rotation
    if (clockwisePatterns.some(pattern => checkSequence(last5, pattern))) {
      if (isMoving.current) {
        clockwiseRotations.current++;
      }
      lastQuadrants.current = [last5[last5.length - 1]];
      lastRotationTime.current = now;
    }
    // Check for counter-clockwise rotation
    else if (counterClockwisePatterns.some(pattern => checkSequence(last5, pattern))) {
      if (isMoving.current) {
        counterClockwiseRotations.current++;
      }
      lastQuadrants.current = [last5[last5.length - 1]];
      lastRotationTime.current = now;
    }
  };

  // Check if array contains a sequence
  const checkSequence = (arr: Quadrant[], sequence: Quadrant[]): boolean => {
    if (arr.length < sequence.length) return false;
    
    for (let i = 0; i <= arr.length - sequence.length; i++) {
      let match = true;
      for (let j = 0; j < sequence.length; j++) {
        if (arr[i + j] !== sequence[j]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
    
    return false;
  };

  // Simplified movement check
  const checkMovement = (currentPos: THREE.Vector3): void => {
    if (!lastPosition.current) {
      lastPosition.current = currentPos.clone();
      return;
    }
    
    const distance = currentPos.distanceTo(lastPosition.current);
    lastPosition.current = currentPos.clone();
    
    // Update movement state
    isMoving.current = distance > MIN_MOVEMENT_THRESHOLD;
  };

  // Main tracking loop
  const trackRotation = () => {
    if (!card.current || !fixed.current || !isTracking.current) {
      frameId.current = requestAnimationFrame(trackRotation);
      return;
    }
    
    // Get positions
    const fixedPos = fixed.current.translation();
    const cardPos = card.current.translation();
    
    // Check movement
    const currentPos = new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z);
    checkMovement(currentPos);
    
    // Calculate relative position in XY plane
    const relX = cardPos.x - fixedPos.x;
    const relY = cardPos.y - fixedPos.y;
    
    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
    
    // Only track quadrant changes if far enough from center
    if (distanceFromCenter >= MIN_DISTANCE_FROM_CENTER) {
      const quadrant = getQuadrant(relX, relY);
      
      // If quadrant changed, process it
      if (quadrant !== currentQuadrant.current) {
        currentQuadrant.current = quadrant;
        processQuadrant(quadrant);
      }
    }
    
    frameId.current = requestAnimationFrame(trackRotation);
  };

  // Handle drag state changes
  useEffect(() => {
    if (isDragging) {
      // Reset tracking when drag starts
      isTracking.current = false;
      currentQuadrant.current = null;
      lastQuadrants.current = [];
      lastPosition.current = null;
      
      // Reset counters
      clockwiseRotations.current = 0;
      counterClockwiseRotations.current = 0;
    } else {
      // Start tracking when drag ends
      isTracking.current = true;
      isMoving.current = true; // Consider it moving right after drag
      
      // Initialize tracking
      if (card.current && fixed.current) {
        const fixedPos = fixed.current.translation();
        const cardPos = card.current.translation();
        
        const relX = cardPos.x - fixedPos.x;
        const relY = cardPos.y - fixedPos.y;
        
        // Set initial position
        lastPosition.current = new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z);
        
        // Set initial quadrant if far enough from center
        const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
        if (distanceFromCenter >= MIN_DISTANCE_FROM_CENTER) {
          currentQuadrant.current = getQuadrant(relX, relY);
          lastQuadrants.current = [currentQuadrant.current];
        }
      }
    }
  }, [isDragging]);

  // Setup animation frame
  useEffect(() => {
    frameId.current = requestAnimationFrame(trackRotation);
    return () => {
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  return {
    clockwiseRotations: clockwiseRotations.current,
    counterClockwiseRotations: counterClockwiseRotations.current,
    resetRotations: () => {
      clockwiseRotations.current = 0;
      counterClockwiseRotations.current = 0;
    }
  };
}; 