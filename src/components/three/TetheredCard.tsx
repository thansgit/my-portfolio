"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { RapierRigidBody } from "@react-three/rapier";
import { TetheredCardProps, ExtendedRigidBody } from "./types";
import { Pinhead } from "./Pinhead";
import { RopeMesh, CardModel } from "@/components/three/TetheredCardVisuals";
import { setupJoints, usePhysicsUpdate } from "@/components/three/TetheredCardPhysics";
import { useTouchHandling } from "@/components/three/TetheredCardInteractions";
import { useRotationTracker } from "@/components/three/TetheredCardRotationTracker";
import { ROPE_SEGMENT_LENGTH, ROPE_INITIAL_RADIUS, ROPE_MIN_RADIUS, ROPE_COLOR_STRETCH_SPEED, ROPE_RADIUS_STRETCH_SPEED, SEGMENT_PROPS } from "@/components/three/constants";

export const TetheredCard = ({
  position = [0, 0, 0],
  maxSpeed = 50,
  minSpeed = 10,
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
    const totalRotations = clockwiseRotations + counterClockwiseRotations;
    
    // If any rotation occurs, trigger the glow effect
    if (totalRotations > 0) {
      setIsGlowing(true);
      
      // Clear any existing timeout
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
      }
      
      // Turn off the glow effect after 1.5 seconds
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

  return (
    <>
      {physicsElements}
      {/* Add the visual rope mesh */}
      <RopeMesh points={points} color={ropeColor} radius={ropeRadius} />
      
      <Pinhead 
        position={[position[0], position[1] + pinOffset, position[2]]} 
        color="red" 
        size={0.08} 
        isGlowing={isGlowing}
      />
    </>
  );
}; 