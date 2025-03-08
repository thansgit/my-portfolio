"use client";

import * as THREE from "three";
import { RefObject, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody,
} from "@react-three/rapier";
import { ExtendedRigidBody } from "@/components/three/utils/types";

interface PhysicsProps {
  position: [number, number, number];
  ROPE_SEGMENT_LENGTH: number;
  segmentProps: any;
  fixed: RefObject<RapierRigidBody>;
  j2: RefObject<ExtendedRigidBody>;
  j3: RefObject<RapierRigidBody>;
  j4: RefObject<RapierRigidBody>;
  card: RefObject<RapierRigidBody>;
  dragged: THREE.Vector3 | false;
  points: THREE.Vector3[];
  setPoints: (points: THREE.Vector3[]) => void;
  maxSpeed: number;
  minSpeed: number;
  cardChildren?: ReactNode;
}

export const setupJoints = (
  fixed: RefObject<RapierRigidBody>,
  j2: RefObject<ExtendedRigidBody>,
  j3: RefObject<RapierRigidBody>,
  j4: RefObject<RapierRigidBody>,
  card: RefObject<RapierRigidBody>,
  ROPE_SEGMENT_LENGTH: number
) => {
  useRopeJoint(fixed, j2, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useRopeJoint(j3, j4, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH]);
  useSphericalJoint(j4, card, [[0, 0, 0], [0, 1.45, 0]]);
};

export const usePhysicsUpdate = ({
  position,
  ROPE_SEGMENT_LENGTH,
  segmentProps,
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
  cardChildren,
}: PhysicsProps) => {
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
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
      <RigidBody
        ref={card}
        {...segmentProps}
        type={dragged ? "kinematicPosition" : "dynamic"}
        position={[position[0] + ROPE_SEGMENT_LENGTH * 4, position[1], position[2]]}
      >
        {cardChildren}
      </RigidBody>
    </>
  );
}; 