"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody,
} from "@react-three/rapier";
import { useGLTF, Line } from "@react-three/drei";
import { BandProps, ExtendedRigidBody } from "./types";

// Preload the 3D model to improve loading performance
useGLTF.preload('/cardtest.glb', true);

export const Band = ({
  position = [0, 0, 0],
  maxSpeed = 50,
  minSpeed = 10,
}: BandProps = {}) => {
  // References for the band and the joints
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<ExtendedRigidBody | null>(null);
  const j2 = useRef<ExtendedRigidBody | null>(null);
  const j3 = useRef<RapierRigidBody | null>(null);

  const card = useRef<RapierRigidBody>(null);
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  // Touch tracking for mobile
  const isTouchDevice = useRef(false);
  const touchVelocity = useRef(new THREE.Vector2(0, 0));
  const lastTouchPosition = useRef(new THREE.Vector2(0, 0));
  const lastTouchTime = useRef(0);
  const touchStartPosition = useRef(new THREE.Vector2(0, 0));
  const [touchActive, setTouchActive] = useState(false);
  const three = useThree();

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  
  const { nodes } = useGLTF('/cardtest.glb');

  const [points, setPoints] = useState([
    new THREE.Vector3(position[0], position[1], position[2]),
    new THREE.Vector3(position[0] + 0.5, position[1], position[2]),
    new THREE.Vector3(position[0] + 1, position[1], position[2]),
    new THREE.Vector3(position[0] + 1.5, position[1], position[2]),
  ]);

  // Detect touch device on mount and prevent scrolling during touch interaction
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Add global touch event handlers to prevent scrolling when interacting with the card
    const preventScroll = (e: TouchEvent) => {
      if (touchActive) {
        e.preventDefault();
      }
    };
    
    // Add event listeners with passive: false to allow preventDefault
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchstart', preventScroll);
    };
  }, [touchActive]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.5]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.5]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.5]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    angularDamping: 2,
    linearDamping: 2,
  };

  // Handle touch movement for tracking velocity
  const handleTouchMove = (e: any) => {
    if (!touchActive) return;
    
    // R3F events don't have preventDefault, so we don't call it here
    
    // Get the current pointer position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX || e.point.x;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY || e.point.y;
    const currentPosition = new THREE.Vector2(clientX, clientY);
    const currentTime = performance.now();
    
    // Update the card position
    if (dragged) {
      vec.set(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1,
        0.5
      ).unproject(three.camera);
      dir.copy(vec).sub(three.camera.position).normalize();
      vec.add(dir.multiplyScalar(three.camera.position.length()));
      
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current!.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z,
      });
    }
    
    // Calculate velocity for flick physics
    if (lastTouchTime.current > 0) {
      const dt = Math.max(1, currentTime - lastTouchTime.current); // Avoid division by zero
      const dx = currentPosition.x - lastTouchPosition.current.x;
      const dy = currentPosition.y - lastTouchPosition.current.y;
      
      // Smooth velocity calculation with some damping
      touchVelocity.current.x = 0.7 * touchVelocity.current.x + 0.3 * (dx / dt) * 15;
      touchVelocity.current.y = 0.7 * touchVelocity.current.y + 0.3 * (dy / dt) * 15;
    }
    
    lastTouchPosition.current.copy(currentPosition);
    lastTouchTime.current = currentTime;
  };

  // Apply flick physics on touch end
  const handleTouchEnd = (e: any) => {
    if (!touchActive) return;
    
    // R3F events don't have preventDefault, so we don't call it here
    
    setTouchActive(false);
    drag(false);
    
    // Only apply flick if the card was being dragged
    if (card.current && touchVelocity.current.length() > 0.1) {
      // Calculate distance from start to determine if this was a flick or just a tap
      const distanceFromStart = lastTouchPosition.current.distanceTo(touchStartPosition.current);
      
      if (distanceFromStart > 10) { // Minimum distance to consider it a flick
        // Apply impulse based on final velocity
        const flickStrength = Math.min(touchVelocity.current.length() * 0.2, 10); // Cap the max strength
        
        card.current.setBodyType(2, true); // 2 = dynamic
        card.current.applyImpulse({
          x: touchVelocity.current.x * flickStrength,
          y: 0,
          z: -touchVelocity.current.y * flickStrength
        }, true);
      }
    }
    
    // Reset tracking
    touchVelocity.current.set(0, 0);
    lastTouchTime.current = 0;
  };

  // Handle touch start
  const handleTouchStart = (e: any) => {
    // R3F events don't have preventDefault, so we don't call it here
    
    // Get the current pointer position from R3F event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX || (e.point ? window.innerWidth * (e.point.x * 0.5 + 0.5) : 0);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY || (e.point ? window.innerHeight * (0.5 - e.point.y * 0.5) : 0);
    
    // Store the initial touch position
    touchStartPosition.current.set(clientX, clientY);
    lastTouchPosition.current.copy(touchStartPosition.current);
    lastTouchTime.current = performance.now();
    
    // Reset velocity
    touchVelocity.current.set(0, 0);
    
    setTouchActive(true);
    
    // Set up dragging
    vec.set(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
      0.5
    ).unproject(three.camera);
    dir.copy(vec).sub(three.camera.position).normalize();
    vec.add(dir.multiplyScalar(three.camera.position.length()));
    
    drag(new THREE.Vector3().copy(vec).sub(vec.copy(card.current!.translation())));
    card.current!.setBodyType(1, true); // 1 = kinematicPosition
  };

  // Add a touch overlay to prevent scrolling
  useEffect(() => {
    if (!isTouchDevice.current) return;
    
    // Create a transparent overlay div that captures touch events
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'none';
    overlay.style.touchAction = 'none'; // Disable all browser touch actions
    
    // Add the overlay to the DOM
    document.body.appendChild(overlay);
    
    // Show the overlay when touch is active
    const showOverlay = () => {
      if (touchActive) {
        overlay.style.display = 'block';
      } else {
        overlay.style.display = 'none';
      }
    };
    
    // Watch for touchActive changes
    const intervalId = setInterval(showOverlay, 100);
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      document.body.removeChild(overlay);
    };
  }, [touchActive]);

  useFrame((state, delta) => {
    if (dragged && !touchActive && !isTouchDevice.current) {
      // Desktop dragging behavior
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current!.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z,
      });
    }

    if (fixed.current) {
      // Fix most of the jitter when over pulling the card
      [j1, j2].forEach((ref) => {
        const current = ref.current!;
        if (!current.lerped) {
          current.lerped = new THREE.Vector3().copy(current.translation());
        }
        const clampedDistance = Math.max(0.1, Math.min(1, current.lerped!.distanceTo(current.translation())));
        current.lerped!.lerp(current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      // Update points from physics
      const newPoints = [
        new THREE.Vector3().copy(fixed.current.translation()),
        new THREE.Vector3().copy(j1.current!.lerped!),
        new THREE.Vector3().copy(j2.current!.lerped!),
        new THREE.Vector3().copy(j3.current!.translation()),
      ];
      setPoints(newPoints);

      // Tilt correction
      ang.copy(card.current!.angvel());
      rot.copy(card.current!.rotation());
      card.current!.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z
      }, true);
    }
  });

  return (
    <>
      <RigidBody ref={fixed} position={position} {...segmentProps} type="fixed" />
      <RigidBody
        position={[position[0] + 0.5, position[1], position[2]]}
        ref={j1}
        {...segmentProps}
      >
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        position={[position[0] + 1, position[1], position[2]]}
        ref={j2}
        {...segmentProps}
      >
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        position={[position[0] + 1.5, position[1], position[2]]}
        ref={j3}
        {...segmentProps}
      >
        <BallCollider args={[0.05]} />
      </RigidBody>
      <Line
        points={points}
        color="white"
        lineWidth={6}
        transparent={false}
        opacity={1}
        depthTest={true}
      />
      <RigidBody
        ref={card}
        {...segmentProps}
        type={dragged ? "kinematicPosition" : "dynamic"}
        position={[position[0] + 2, position[1], position[2]]}
      >
        <CuboidCollider args={[0.8, 1.125, 0.01]} />
        <group
          scale={2}
          position={[0, 0.1, -0.05]}
          rotation={[Math.PI * 0.5, 0, 0]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onPointerDown={(e) => {
            if (isTouchDevice.current) {
              handleTouchStart(e);
            } else {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())));
            }
          }}
          onPointerUp={(e) => {
            if (isTouchDevice.current) {
              handleTouchEnd(e);
            } else {
              (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              drag(false);
            }
          }}
          onPointerMove={(e) => {
            if (isTouchDevice.current && touchActive) {
              handleTouchMove(e);
            }
          }}
        >
          <primitive object={nodes.Scene} />
        </group>
      </RigidBody>
    </>
  );
}


