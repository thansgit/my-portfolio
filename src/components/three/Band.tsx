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
import { useTexture, useGLTF, Line } from "@react-three/drei";
import { CatmullRomCurve3, Vector3 } from 'three';

useGLTF.preload('/cardtest.glb')

interface BandProps {
  position?: [number, number, number];
  maxSpeed?: number;
  minSpeed?: number;
}

interface ExtendedRigidBody extends RapierRigidBody {
  lerped?: THREE.Vector3;
}

export default function Band({
  position = [0, 0, 0],
  maxSpeed = 50,
  minSpeed = 10,
}: BandProps = {}) {
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

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false)
  const { width, height } = useThree((state) => state.size);

  const { nodes, materials } = useGLTF('/cardtest.glb')

  const [points, setPoints] = useState([
    new THREE.Vector3(position[0], position[1], position[2]),
    new THREE.Vector3(position[0] + 0.5, position[1], position[2]),
    new THREE.Vector3(position[0] + 1, position[1], position[2]),
    new THREE.Vector3(position[0] + 1.5, position[1], position[2]),
  ]);

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

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current!.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
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
        // segments={true}
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
          scale={2
          }
          position={[0, 0.1, -0.05]}
          rotation={[Math.PI * 0.5, 0, 0]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())))
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


