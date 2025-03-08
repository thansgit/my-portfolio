"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { RapierRigidBody } from "@react-three/rapier";
import { TetheredCardProps, ExtendedRigidBody } from "@/components/three/utils/types";
import { Pinhead, Particles } from "@/components/three";
import { RopeMesh, CardModel } from "./visuals";
import { setupJoints, usePhysicsUpdate } from "./physics";
import { useTouchHandling, useRotationTracker } from "./controls";
import { ROPE_SEGMENT_LENGTH, ROPE_INITIAL_RADIUS, ROPE_MIN_RADIUS, ROPE_COLOR_STRETCH_SPEED, ROPE_RADIUS_STRETCH_SPEED, SEGMENT_PROPS } from "@/components/three/utils/constants";

export const TetheredCard = ({
  position = [0, 0, 0],
  maxSpeed = 50,
  minSpeed = 10,
  onPinheadStateChange,
}: TetheredCardProps = {}) => {
  
  const card = useRef<RapierRigidBody>(null);
  
  // References for the tethered card and the joints
  const fixed = useRef<RapierRigidBody>(null);
  const j2 = useRef<ExtendedRigidBody | null>(null);
  const j3 = useRef<RapierRigidBody | null>(null);
  const j4 = useRef<RapierRigidBody | null>(null);
  
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  
  // State to track glowing effect
  const [isGlowing, setIsGlowing] = useState(false);
  const glowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Track last rotation values separately
  const lastClockwiseRef = useRef(0);
  const lastCounterClockwiseRef = useRef(0);
  
  // Add rotation counter for particle effects
  const [rotationCounter, setRotationCounter] = useState(0);
  
  const [points, setPoints] = useState([
    new THREE.Vector3(position[0], position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH, position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH * 2, position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH * 3, position[1], position[2]),
  ]);

  const [ropeColor, setRopeColor] = useState("#000000");
  const [ropeRadius, setRopeRadius] = useState(ROPE_INITIAL_RADIUS);

  // Use the rotation tracker with rotation detection callback
  const { clockwiseRotations, counterClockwiseRotations } = useRotationTracker({
    card,
    fixed,
    isDragging: dragged !== false,
  });
  
  // Watch for changes in rotations and trigger the glow effect
  useEffect(() => {
    // Detect if any new rotation has occurred
    const hasNewRotation = 
      clockwiseRotations > lastClockwiseRef.current || 
      counterClockwiseRotations > lastCounterClockwiseRef.current;
    
    // Update our references
    lastClockwiseRef.current = clockwiseRotations;
    lastCounterClockwiseRef.current = counterClockwiseRotations;
    
    // If a new rotation has occurred
    if (hasNewRotation) {
      // Always set to true on new rotation, regardless of current state
      setIsGlowing(true);
      
      // Increment rotation counter to trigger new particles
      setRotationCounter(prev => prev + 1);
      
      // Clear any existing timeout to restart the timer
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
      }
      
      // Set a new timeout
      glowTimeoutRef.current = setTimeout(() => {
        setIsGlowing(false);
      }, 1500);
    }
    
    // Clean up on unmount
    return () => {
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
      }
    };
  }, [clockwiseRotations, counterClockwiseRotations]);

  // Setup joints between rigid bodies
  setupJoints(fixed, j2, j3, j4, card, ROPE_SEGMENT_LENGTH);

  // Handle touch events
  useTouchHandling(dragged, hovered);

  const calculateRopeLength = (pts: THREE.Vector3[]): number => {
    let totalLength = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      totalLength += pts[i].distanceTo(pts[i + 1]);
    }
    return totalLength;
  };

  const restingLength = ROPE_SEGMENT_LENGTH * 5;

  useEffect(() => {
    const currentLength = calculateRopeLength(points);
    const stretchRatio = Math.max(1, currentLength / restingLength);
    
    if (stretchRatio > 1) {
      // Speed of color change  
      const colorStretch = Math.min((stretchRatio - 1) / ROPE_COLOR_STRETCH_SPEED, 1);
      // Speed of radius change
      const radiusStretch = Math.min((stretchRatio - 1) / ROPE_RADIUS_STRETCH_SPEED, 1);
      
      // Color change
      const grayValue = Math.floor(colorStretch * 180);
      setRopeColor(`rgb(${grayValue}, ${grayValue}, ${grayValue})`);
      
      const newRadius = ROPE_INITIAL_RADIUS - (radiusStretch * (ROPE_INITIAL_RADIUS - ROPE_MIN_RADIUS));
      setRopeRadius(newRadius);
    } else {
      // Lepotilassa palautetaan alkuarvot
      setRopeColor("#000000");
      setRopeRadius(ROPE_INITIAL_RADIUS);
    }
  }, [points]);

  // Create the card model element
  const cardModelElement = (
    <CardModel 
      nodeRef={card}
      dragged={dragged}
      onHover={hover}
      onDrag={drag}
    />
  );

  // Physics update and rendering
  const physicsElements = usePhysicsUpdate({
    position,
    ROPE_SEGMENT_LENGTH,
    segmentProps: SEGMENT_PROPS,
    fixed,
    j2,
    j3,
    j4,
    card,
    dragged,
    points,
    setPoints,
    maxSpeed,
    minSpeed,
    cardChildren: cardModelElement,
  });

  // Pin position offset relative to fixed position
  const pinOffset = 0.18;
  const pinheadPosition: [number, number, number] = [position[0], position[1] + pinOffset, position[2]];

  // Notify parent component when pinhead state changes
  useEffect(() => {
    if (onPinheadStateChange) {
      onPinheadStateChange(pinheadPosition, isGlowing);
    }
  }, [isGlowing, pinheadPosition, onPinheadStateChange]);

  return (
    <>
      {physicsElements}
      {/* Add the visual rope mesh */}
      <RopeMesh points={points} color={ropeColor} radius={ropeRadius} />
      
      <Pinhead 
        position={pinheadPosition} 
        color="red" 
        size={0.08} 
        isGlowing={isGlowing}
      />
      
      <Particles 
        triggerCount={rotationCounter}
        position={pinheadPosition}
        particleSize={0.075}
        particleCount={200}
        confetti={true}
      />
    </>
  );
}; 