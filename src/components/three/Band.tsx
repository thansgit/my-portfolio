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
  const j2 = useRef<ExtendedRigidBody | null>(null);
  const j3 = useRef<RapierRigidBody | null>(null);
  const j4 = useRef<RapierRigidBody | null>(null);

  // Configuration constants
  const ROPE_SEGMENT_LENGTH = 0.15;

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
  const touchMoveTimeout = useRef<NodeJS.Timeout | null>(null);
  const three = useThree();

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  
  const { nodes } = useGLTF('/cardtest.glb');

  const [points, setPoints] = useState([
    new THREE.Vector3(position[0], position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH, position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH * 2, position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH * 3, position[1], position[2]),
  ]);

  // Handle safe release of card
  const safeReleaseCard = () => {
    if (touchMoveTimeout.current) {
      clearTimeout(touchMoveTimeout.current);
      touchMoveTimeout.current = null;
    }

    if (dragged || touchActive) {
      // Reset states
      setTouchActive(false);
      drag(false);
      
      // Apply flick physics if we have velocity
      if (card.current && touchVelocity.current.length() > 0.1) {
        const distanceFromStart = lastTouchPosition.current.distanceTo(touchStartPosition.current);
        
        if (distanceFromStart > 10) { // Minimum distance to consider it a flick
          const flickStrength = Math.min(touchVelocity.current.length() * 0.2, 10);
          
          card.current.setBodyType(2, true); // 2 = dynamic
          card.current.applyImpulse({
            x: touchVelocity.current.x * flickStrength,
            y: 0,
            z: -touchVelocity.current.y * flickStrength
          }, true);
        } else {
          // Always ensure the card becomes dynamic even if it's not a flick
          card.current.setBodyType(2, true);
        }
      } else if (card.current) {
        // Always ensure the card becomes dynamic when released, even without velocity
        card.current.setBodyType(2, true);
        
        // Apply a tiny impulse to ensure physics takes over
        card.current.applyImpulse({ x: 0, y: 0.01, z: 0 }, true);
      }
      
      // Ensure all bodies are awake to respond to physics
      [card, j2, j3, j4, fixed].forEach((ref) => ref.current?.wakeUp());
      
      // Reset tracking
      touchVelocity.current.set(0, 0);
      lastTouchTime.current = 0;
    }
  };

  // Detect touch device on mount and prevent scrolling during touch interaction
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Only add touch-specific handlers if we're on a touch device
    if (!isTouchDevice.current) return;
    
    // Add global touch event handlers to prevent scrolling when interacting with the card
    const preventScroll = (e: TouchEvent) => {
      if (touchActive) {
        e.preventDefault();
      }
    };
    
    // Global touch end handler to ensure we always capture touch end
    const globalTouchEnd = () => {
      if (touchActive || dragged) {
        safeReleaseCard();
      }
    };

    // Global touch cancel handler for when the system cancels the touch
    const globalTouchCancel = () => {
      if (touchActive || dragged) {
        safeReleaseCard();
      }
    };
    
    // Global touch move handler to ensure we keep tracking even if the event doesn't reach our component
    const globalTouchMove = (e: TouchEvent) => {
      if (touchActive && dragged) {
        // Only prevent default if we're actively dragging
        e.preventDefault();
        
        // Ensure our component touch move handler gets the global events too
        if (e.touches && e.touches.length > 0) {
          const clientX = e.touches[0].clientX;
          const clientY = e.touches[0].clientY;
          const currentPosition = new THREE.Vector2(clientX, clientY);
          const currentTime = performance.now();
          
          // Update the card position from global events
          if (dragged) {
            vec.set(
              (clientX / window.innerWidth) * 2 - 1,
              -(clientY / window.innerHeight) * 2 + 1,
              0.5
            ).unproject(three.camera);
            dir.copy(vec).sub(three.camera.position).normalize();
            vec.add(dir.multiplyScalar(three.camera.position.length()));
            
            [card, j2, j3, j4, fixed].forEach((ref) => ref.current?.wakeUp());
            card.current!.setNextKinematicTranslation({
              x: vec.x - (dragged as THREE.Vector3).x,
              y: vec.y - (dragged as THREE.Vector3).y,
              z: vec.z - (dragged as THREE.Vector3).z,
            });
            
            // Calculate velocity
            if (lastTouchTime.current > 0) {
              const dt = Math.max(1, currentTime - lastTouchTime.current);
              const dx = currentPosition.x - lastTouchPosition.current.x;
              const dy = currentPosition.y - lastTouchPosition.current.y;
              
              touchVelocity.current.x = 0.7 * touchVelocity.current.x + 0.3 * (dx / dt) * 15;
              touchVelocity.current.y = 0.7 * touchVelocity.current.y + 0.3 * (dy / dt) * 15;
            }
            
            lastTouchPosition.current.copy(currentPosition);
            lastTouchTime.current = currentTime;
          }
        }
      }
    };
    
    // Add event listeners with passive: false to allow preventDefault
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventScroll, { passive: false });
    document.addEventListener('touchend', globalTouchEnd);
    document.addEventListener('touchcancel', globalTouchCancel);
    document.addEventListener('touchmove', globalTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchstart', preventScroll);
      document.removeEventListener('touchend', globalTouchEnd);
      document.removeEventListener('touchcancel', globalTouchCancel);
      document.removeEventListener('touchmove', globalTouchMove);
    };
  }, [touchActive, dragged]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useRopeJoint(fixed, j2, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j3, j4, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useSphericalJoint(j4, card, [[0, 0, 0], [0, 1.45, 0]]);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    angularDamping: 2,
    linearDamping: 2,
  };

  useFrame((state, delta) => {
    if (dragged && !touchActive && !isTouchDevice.current) {
      // Desktop dragging behavior - UNCHANGED from original implementation
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j2, j3, j4, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current!.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z,
      });
    }

    if (fixed.current) {
      // Fix most of the jitter when over pulling the card
      [j2].forEach((ref) => {
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
        new THREE.Vector3().copy(j2.current!.lerped!),
        new THREE.Vector3().copy(j3.current!.translation()),
        new THREE.Vector3().copy(j4.current!.translation()),
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
      
      // Anti-stuck mechanism: If the card is not being dragged and appears stuck at the top
      if (!dragged && card.current && !card.current.isSleeping()) {
        // Check if card is higher up than the fixed point (suggesting it might be stuck)
        const cardPos = card.current.translation();
        const fixedPos = fixed.current.translation();
        const cardVel = card.current.linvel();
        
        // If card is higher than fixed point and moving very slowly (almost stuck)
        const isHigherThanBase = cardPos.y > fixedPos.y + 0.5;
        const isAlmostStill = Math.abs(cardVel.x) < 0.1 && Math.abs(cardVel.y) < 0.1 && Math.abs(cardVel.z) < 0.1;
        
        if (isHigherThanBase && isAlmostStill) {
          // Apply a small downward force to overcome any physics anomaly
          card.current.applyImpulse({ x: 0, y: -0.05, z: 0 }, true);
          card.current.wakeUp();
        }
      }
    }
  });

  // Handle touch movement for tracking velocity - ONLY USED FOR MOBILE
  const handleTouchMove = (e: any) => {
    if (!touchActive || !isTouchDevice.current) return;
    
    // Clear any existing timeout and set a new one - make it longer to be less sensitive
    if (touchMoveTimeout.current) {
      clearTimeout(touchMoveTimeout.current);
    }
    
    // Set a safety timeout that will release the card if no touch events are received for 300ms
    // Increased from 100ms to make it less prone to accidental release
    touchMoveTimeout.current = setTimeout(() => {
      // If we haven't received a touch event in 300ms, we assume the finger has left the element
      safeReleaseCard();
    }, 300);
    
    // Get the current pointer position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX || e.point.x;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY || e.point.y;
    const currentPosition = new THREE.Vector2(clientX, clientY);
    const currentTime = performance.now();

    // Only perform distance check if we've been dragging for at least 100ms to avoid early release
    const dragDuration = currentTime - lastTouchTime.current;
    if (dragged && dragDuration > 100) {
      // Get the screen position of the card
      const cardScreenPos = new THREE.Vector3(
        vec.x - (dragged as THREE.Vector3).x,
        vec.y - (dragged as THREE.Vector3).y,
        vec.z - (dragged as THREE.Vector3).z
      );
      
      // Project the card position to screen coordinates
      cardScreenPos.project(three.camera);
      const cardX = (cardScreenPos.x * 0.5 + 0.5) * window.innerWidth;
      const cardY = (-cardScreenPos.y * 0.5 + 0.5) * window.innerHeight;
      
      // Calculate distance from touch to card center in screen pixels
      const distToCard = Math.sqrt(
        Math.pow(clientX - cardX, 2) + 
        Math.pow(clientY - cardY, 2)
      );
      
      // If the touch is too far from the card, release it
      // Increased threshold from 200px to 300px to be less sensitive
      if (distToCard > 300) {
        safeReleaseCard();
        return;
      }
    }
    
    // Update the card position
    if (dragged) {
      vec.set(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1,
        0.5
      ).unproject(three.camera);
      dir.copy(vec).sub(three.camera.position).normalize();
      vec.add(dir.multiplyScalar(three.camera.position.length()));
      
      [card, j2, j3, j4, fixed].forEach((ref) => ref.current?.wakeUp());
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

      // Only release the card if velocity is extremely high and we've been dragging for a while
      // Increased threshold from 40 to 60 to be less sensitive
      if (Math.abs(touchVelocity.current.length()) > 60 && dragDuration > 150) {
        safeReleaseCard();
        return;
      }
    }
    
    lastTouchPosition.current.copy(currentPosition);
    lastTouchTime.current = currentTime;
  };

  // Apply flick physics on touch end
  const handleTouchEnd = (e: any) => {
    if (isTouchDevice.current) {
      safeReleaseCard();
    } else {
      // Original desktop behavior
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      drag(false);
    }
  };

  // Handle touch start
  const handleTouchStart = (e: any) => {
    if (isTouchDevice.current) {
      // Mobile-specific logic
      // Prevent default to ensure the page doesn't scroll
      if (e.preventDefault) e.preventDefault();
      
      // Clear any existing timeout
      if (touchMoveTimeout.current) {
        clearTimeout(touchMoveTimeout.current);
        touchMoveTimeout.current = null;
      }
      
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
      // Ensure the card is kinematic during mobile drag
      card.current!.setBodyType(1, true); // 1 = kinematicPosition
    } else {
      // Original desktop behavior
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())));
      // Ensure the card is kinematic during desktop drag
      card.current!.setBodyType(1, true); // 1 = kinematicPosition
    }
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

  return (
    <>
      <RigidBody ref={fixed} position={position} {...segmentProps} type="fixed" />
      <RigidBody
        position={[position[0] + ROPE_SEGMENT_LENGTH, position[1], position[2]]}
        ref={j2}
        {...segmentProps}
      >
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        position={[position[0] + ROPE_SEGMENT_LENGTH * 2, position[1], position[2]]}
        ref={j3}
        {...segmentProps}
      >
        <BallCollider args={[0.05]} />
      </RigidBody>
      <RigidBody
        position={[position[0] + ROPE_SEGMENT_LENGTH * 3, position[1], position[2]]}
        ref={j4}
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
        position={[position[0] + ROPE_SEGMENT_LENGTH * 4, position[1], position[2]]}
      >
        <group
          scale={2}
          position={[0, 0.1, -0.03]}
          rotation={[Math.PI * 0.5, 0, 0]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onPointerDown={(e) => {
            if (isTouchDevice.current) {
              handleTouchStart(e);
            } else {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())));
              // Ensure the card is kinematic during desktop drag
              card.current!.setBodyType(1, true); // 1 = kinematicPosition
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


