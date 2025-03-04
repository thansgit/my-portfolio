"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { RapierRigidBody } from "@react-three/rapier";
import { TetheredCardProps, ExtendedRigidBody } from "./types";
import { Pinhead } from "./Pinhead";
import { RopeMesh, CardModel } from "@/components/three/TetheredCardVisuals";
import { setupJoints, usePhysicsUpdate } from "@/components/three/TetheredCardPhysics";
import { useTouchHandling } from "@/components/three/TetheredCardInteractions";
import { ROPE_SEGMENT_LENGTH, SEGMENT_PROPS } from "@/components/three/constants";

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
  const [j2Position, setJ2Position] = useState<[number, number, number]>([
    position[0] + ROPE_SEGMENT_LENGTH, 
    position[1], 
    position[2]
  ]);
  
  const [points, setPoints] = useState([
    new THREE.Vector3(position[0], position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH, position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH * 2, position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH * 3, position[1], position[2]),
  ]);

  // Setup joints between rigid bodies
  setupJoints(fixed, j2, j3, j4, card, ROPE_SEGMENT_LENGTH);

  // Handle touch events
  useTouchHandling(dragged, hovered);

  // Add this useEffect to set initial position and update on window resize
  useEffect(() => {
    // Function to update j2Position, this is the position of the pinhead
    const updatePosition = () => {
      setJ2Position([
        position[0] + ROPE_SEGMENT_LENGTH -0.14, 
        position[1]+0.12, 
        position[2]+0.17
      ]);
    };
    
    updatePosition();
    
    // Add event listener for window resize
    window.addEventListener('resize', updatePosition);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', updatePosition);
  }, [position]); // Dependency on position ensures correct values are used

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

  return (
    <>
      {physicsElements}
      {/* Add the visual rope mesh */}
      <RopeMesh points={points} />
      
      <Pinhead position={j2Position} color="red" size={0.1} />
    </>
  );
} 