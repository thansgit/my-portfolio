'use client'

import * as THREE from 'three'
import { useRef, useState } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint, RapierRigidBody } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useTexture } from '@react-three/drei'

//Had to add this to fix typescript error Property 'meshLineGeometry' does not exist on type 'JSX.IntrinsicElements'.ts(2339)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any
      meshLineMaterial: any
    }
  }
}

extend({ MeshLineGeometry, MeshLineMaterial })

interface BandProps {
  position?: [number, number, number];
}

export default function Band({ position = [-3, 4, 0] }: BandProps = {}) {
    // References for the band and the joints
    const band = useRef<THREE.Mesh | null>(null)
    const fixed = useRef<RapierRigidBody>(null)
    const j1 = useRef<RapierRigidBody | null>(null)
    const j2 = useRef<RapierRigidBody | null>(null)
    const j3 = useRef<RapierRigidBody | null>(null)

    const card = useRef<RapierRigidBody>(null)
    const vec = new THREE.Vector3()
    const ang = new THREE.Vector3()
    const rot = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const [dragged, drag] = useState<THREE.Vector3 | false>(false);

    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

    // Canvas size
    const { width, height } = useThree((state) => state.size)
    // A Catmull-Rom curve
    const [curve] = useState(() => new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
    ]))

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])

    useFrame((state) => {
      if (dragged) {
        vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
        dir.copy(vec).sub(state.camera.position).normalize()
        vec.add(dir.multiplyScalar(state.camera.position.length()))
        card.current!.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
      }
    // Calculate Catmull curve      
          curve.points[0].copy(j3.current!.translation());
          curve.points[1].copy(j2.current!.translation());
          curve.points[2].copy(j1.current!.translation());
          curve.points[3].copy(fixed.current!.translation());
          (band.current!.geometry as MeshLineGeometry).setPoints(curve.getPoints(32))

    

          // Tilt the card back towards the screen
          ang.copy(card.current!.angvel())
          rot.copy(card.current!.rotation())
          card.current!.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
            
    })

    const [bandTexture, cardTexture] = useTexture([
      '/bandplaceholder.jpg',
      '/cardplaceholder.jpg'  // Add your card texture in public folder
    ])

    bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping
    bandTexture.repeat.set(1, 1) 
    cardTexture.wrapS = cardTexture.wrapT = THREE.RepeatWrapping
    cardTexture.repeat.set(1, 1) 

       return (
    <>
      <RigidBody ref={fixed} type="fixed" position={position}/>
      <RigidBody position={[position[0] + 0.5, position[1], position[2]]} ref={j1}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={[position[0] + 1, position[1], position[2]]} ref={j2}>
        <BallCollider args={[0.1]} />
      </RigidBody >
      <RigidBody position={[position[0] + 1.5, position[1], position[2]]} ref={j3}>
        <BallCollider args={[0.1]} />
      </RigidBody >
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" resolution={[width, height]} lineWidth={1} map={bandTexture} useMap={1} />
      </mesh>
      <RigidBody ref={card} type={dragged ? 'kinematicPosition' : 'dynamic'} position={[position[0] + 2, position[1], position[2]]}>
        <CuboidCollider args={[0.8, 1.125, 0.01]} />
        <mesh
          onPointerUp={(e) => drag(false)}
          onPointerDown={(e) => drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())))}>
          <planeGeometry args={[0.8 * 2, 1.125 * 2]} />
          <meshBasicMaterial color="white" side={THREE.DoubleSide} map={cardTexture}/>
        </mesh>
      </RigidBody>
    </>
  )

}