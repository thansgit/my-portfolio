'use client'

import { useTetheredCardContext } from '@/components/three/context'
import { useConfigContext } from '@/components/three/context/ConfigContext'
import {
  ROPE_SEGMENT_LENGTH,
  SEGMENT_PROPS,
  PINHEAD_SIZE,
  PINHEAD_COLOR,
  DRAGGABLE_PLANE_SIZE,
  BALL_COLLIDER_SIZES,
  ROPE_INITIAL_RADIUS,
  ROPE_MIN_RADIUS,
  ROPE_COLOR_STRETCH_SPEED,
  ROPE_RADIUS_STRETCH_SPEED,
} from '@/components/three/utils/constants'
import { ExtendedRigidBody, TetheredCardProps } from '@/components/three/utils/types'
import { useFrame } from '@react-three/fiber'
import { BallCollider, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { CardModel, DraggablePlane, Pinhead, RopeMesh } from './components'
import { useJoints, usePhysicsUpdate, useRotationTracker, useTouchHandling } from './hooks'

export const TetheredCard = ({ position = [0, 0, 0] }: TetheredCardProps = {}) => {
  // Get configuration from context
  const { cardPhysics } = useConfigContext()
  const { ropeColor, ropeRadius, setCardRotationCount, setRopeColor, setRopeRadius } = useTetheredCardContext()

  // Physics settings from config context
  const maxSpeed = cardPhysics.maxSpeed
  const minSpeed = cardPhysics.minSpeed

  // Direct refs for physics bodies - these stay local to the component
  const cardRef = useRef<RapierRigidBody>(null)
  const fixedRef = useRef<RapierRigidBody>(null)
  const j2Ref = useRef<ExtendedRigidBody | null>(null)
  const j3Ref = useRef<RapierRigidBody | null>(null)
  const j4Ref = useRef<RapierRigidBody | null>(null)

  // Local interaction state
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false)
  const [hovered, setHovered] = useState(false)

  // Physics positions calculation
  const restingY = position[1] - 2 // Lower than the fixed point
  const xOffset = -0.5 // Move to the left on X-axis

  // Calculate all joint positions
  const jointPositions = [
    position, // Fixed point - keep original position
    [position[0] + ROPE_SEGMENT_LENGTH + xOffset, restingY, position[2]], // j2
    [position[0] + ROPE_SEGMENT_LENGTH * 2 + xOffset, restingY, position[2]], // j3
    [position[0] + ROPE_SEGMENT_LENGTH * 3 + xOffset, restingY, position[2]], // j4
    [position[0] + ROPE_SEGMENT_LENGTH * 4 + xOffset, restingY, position[2]], // card
  ] as [number, number, number][]

  const finalCardPosition = jointPositions[4]

  // Initialize points for rope physics
  const [points, setPoints] = useState([
    new THREE.Vector3(...jointPositions[0]),
    new THREE.Vector3(...jointPositions[1]),
    new THREE.Vector3(...jointPositions[2]),
    new THREE.Vector3(...jointPositions[3]),
  ])

  // Draggable plane handling
  const planeGroupRef = useRef<THREE.Group>(null)
  const planePosition = useRef<THREE.Vector3>(
    new THREE.Vector3(finalCardPosition[0], finalCardPosition[1], finalCardPosition[2]),
  )

  // Update plane position to follow card
  useFrame(() => {
    if (cardRef.current && planeGroupRef.current) {
      const cardPos = cardRef.current.translation()
      planePosition.current.set(cardPos.x, cardPos.y, cardPos.z)
      planeGroupRef.current.position.copy(planePosition.current)
    }
  })

  // Use the rotation tracker
  const { rotations } = useRotationTracker({
    card: cardRef,
    fixed: fixedRef,
    isDragging: Boolean(dragged),
  })

  // Update rotation count in scene context
  useEffect(() => {
    console.log(`Setting rotation count in TetheredCardContext: ${rotations}`)
    setCardRotationCount(rotations)
  }, [rotations, setCardRotationCount])

  // Calculate rope length for physics
  const restingLength = ROPE_SEGMENT_LENGTH * 5

  // Update rope visuals based on physics simulation
  useEffect(() => {
    if (points.length < 2) return

    const calculateRopeLength = (pts: THREE.Vector3[]): number => {
      let totalLength = 0
      for (let i = 0; i < pts.length - 1; i++) {
        totalLength += pts[i].distanceTo(pts[i + 1])
      }
      return totalLength
    }

    const currentLength = calculateRopeLength(points)
    const stretchRatio = Math.max(1, currentLength / restingLength)

    if (stretchRatio > 1) {
      const colorStretch = Math.min((stretchRatio - 1) / ROPE_COLOR_STRETCH_SPEED, 1)

      const radiusStretch = Math.min((stretchRatio - 1) / ROPE_RADIUS_STRETCH_SPEED, 1)

      const grayValue = Math.floor(colorStretch * 180)
      const newColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`

      const newRadius = ROPE_INITIAL_RADIUS - radiusStretch * (ROPE_INITIAL_RADIUS - ROPE_MIN_RADIUS)

      // Update shared state through individual setters
      setRopeColor(newColor)
      setRopeRadius(newRadius)
    } else {
      // Reset to defaults
      setRopeColor('#000000')
      setRopeRadius(ROPE_INITIAL_RADIUS)
    }
  }, [points, setRopeColor, setRopeRadius, restingLength])

  // Set up physics joints
  useJoints(fixedRef, j2Ref, j3Ref, j4Ref, cardRef, ROPE_SEGMENT_LENGTH)

  // Handle touch events
  useTouchHandling(dragged, hovered)

  // Set up physics
  usePhysicsUpdate({
    position,
    ROPE_SEGMENT_LENGTH,
    segmentProps: SEGMENT_PROPS,
    fixed: fixedRef,
    j2: j2Ref,
    j3: j3Ref,
    j4: j4Ref,
    card: cardRef,
    dragged,
    points,
    setPoints,
    maxSpeed,
    minSpeed,
  })

  return (
    <>
      <RigidBody ref={fixedRef} position={jointPositions[0]} {...SEGMENT_PROPS} type='fixed' />
      <RigidBody position={jointPositions[1]} ref={j2Ref} {...SEGMENT_PROPS}>
        <BallCollider args={[BALL_COLLIDER_SIZES.JOINT_2]} />
      </RigidBody>
      <RigidBody position={jointPositions[2]} ref={j3Ref} {...SEGMENT_PROPS}>
        <BallCollider args={[BALL_COLLIDER_SIZES.JOINT_3]} />
      </RigidBody>
      <RigidBody position={jointPositions[3]} ref={j4Ref} {...SEGMENT_PROPS}>
        <BallCollider args={[BALL_COLLIDER_SIZES.JOINT_4]} />
      </RigidBody>
      <RigidBody
        ref={cardRef}
        {...SEGMENT_PROPS}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        position={finalCardPosition}
      >
        <CardModel nodeRef={cardRef} dragged={dragged} onHover={setHovered} onDrag={setDragged} />
      </RigidBody>

      {/* Invisible draggable plane that follows the card's position but doesn't rotate. */}
      <group ref={planeGroupRef} position={[finalCardPosition[0], finalCardPosition[1], finalCardPosition[2]]}>
        <DraggablePlane
          nodeRef={cardRef}
          dragged={dragged}
          onHover={setHovered}
          onDrag={setDragged}
          size={DRAGGABLE_PLANE_SIZE}
          debug={false}
        />
      </group>
      {/* Add the visual rope mesh */}
      <RopeMesh points={points} color={ropeColor} radius={ropeRadius} />
      <Pinhead
        position={[finalCardPosition[0] - 0.015, finalCardPosition[1] + 2.15, finalCardPosition[2]]}
        color={PINHEAD_COLOR}
        size={PINHEAD_SIZE}
      />
    </>
  )
}
