"use client";

import * as THREE from "three";
import { useEffect, useRef, useState, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody,
} from "@react-three/rapier";
import { useGLTF, Line, CatmullRomLine } from "@react-three/drei";
import { BandProps, ExtendedRigidBody } from "./types";

// Preload the 3D model to improve loading performance
useGLTF.preload('/cardtest.glb', true);

// Define the RopeMesh component props interface
interface RopeMeshProps {
  points: THREE.Vector3[];
  radius?: number;
  color?: string;
}

// RopeMesh component to create a tubular mesh around the rope points
const RopeMesh = ({ points, radius = 0.05, color = "black" }: RopeMeshProps) => {
  const curve = useMemo(() => {
    // Create a smooth curve through the points
    const curvePoints = [...points];
    return new THREE.CatmullRomCurve3(curvePoints);
  }, [points]);

  // Create a tubular geometry along the curve
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, radius, 8, false);
  }, [curve, radius]);

  return (
    <mesh>
      <primitive object={tubeGeometry} attach="geometry" />
      <meshStandardMaterial 
        color={color} 
        roughness={0.7} 
      />
    </mesh>
  );
};

export const Band = ({
  position = [0, 0, 0],
  maxSpeed = 50,
  minSpeed = 10,
}: BandProps = {}) => {
  
  // Configuration constants
  const ROPE_SEGMENT_LENGTH = 0.15;
  
  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    angularDamping: 2,
    linearDamping: 2,
  };
  
  const card = useRef<RapierRigidBody>(null);
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  // References for the band and the joints
  const fixed = useRef<RapierRigidBody>(null);
  const j2 = useRef<ExtendedRigidBody | null>(null);
  const j3 = useRef<RapierRigidBody | null>(null);
  const j4 = useRef<RapierRigidBody | null>(null);
  
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const { nodes } = useGLTF('/cardtest.glb');
  const [points, setPoints] = useState([
    new THREE.Vector3(position[0], position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH, position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH * 2, position[1], position[2]),
    new THREE.Vector3(position[0] + ROPE_SEGMENT_LENGTH * 3, position[1], position[2]),
  ]);

  // Prevent default touch behavior when dragging
  useEffect(() => {
    const preventTouchDefault = (e: TouchEvent) => {if (e.cancelable) e.preventDefault()};
    document.addEventListener('touchmove', preventTouchDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventTouchDefault);
  }, [dragged]);

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



  useFrame((state, delta) => {
    if (dragged) {
      //dragging behavior
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
      // Fix most of the jitter on the rope when over pulling the card
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

      // Tilt correction to make card face the camera
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
      
      {/* Replace the Line with our RopeMesh component */}
      <RopeMesh points={points} />
      
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
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())));

          }}
          onPointerUp={(e) => {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            drag(false);
          }}
        >
          <primitive object={nodes.Scene} />
        </group>
      </RigidBody>
    </>
  );
}


