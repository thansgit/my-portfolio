'use client'

import { Particles } from '@/components/three'
import { useSceneContext, useConfigContext } from '@/components/three/hooks'
import {
  ROPE_SEGMENT_LENGTH,
  SEGMENT_PROPS,
  PINHEAD_OFFSET,
  PINHEAD_SIZE,
  PINHEAD_COLOR,
  DRAGGABLE_PLANE_SIZE,
  BALL_COLLIDER_SIZES,
  PINHEAD_GLOW_TIMEOUT,
} from '@/components/three/utils/constants'
import { ExtendedRigidBody, TetheredCardProps } from '@/components/three/utils/types'
import { useFrame } from '@react-three/fiber'
import { BallCollider, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { CardModel, DraggablePlane, Pinhead, RopeMesh } from './components'
import { useJoints, usePhysicsUpdate, useRotationTracker, useTouchHandling } from './hooks'

export const TetheredCard = ({ position = [0, 0, 0], onPinheadStateChange }: TetheredCardProps = {}) => {
  // Get configuration from context
  const config = useConfigContext()
  const {
    setCardPosition,
    setPinheadPosition,
    setCardGlowing,
    incrementCardRotation,
    updateRopeVisuals,
    ropeColor,
    ropeRadius,
  } = useSceneContext()

  // Physics settings from config context
  const maxSpeed = config.cardPhysics.maxSpeed
  const minSpeed = config.cardPhysics.minSpeed

  // Direct refs for physics bodies - these stay local to the component
  const cardRef = useRef<RapierRigidBody>(null)
  const fixedRef = useRef<RapierRigidBody>(null)
  const j2Ref = useRef<ExtendedRigidBody | null>(null)
  const j3Ref = useRef<RapierRigidBody | null>(null)
  const j4Ref = useRef<RapierRigidBody | null>(null)

  // Local interaction state
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false)
  const [hovered, setHovered] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)

  // Physics positions calculation
  const restingY = position[1] - 2 // Lower than the fixed point

  // Calculate all joint positions
  const jointPositions = [
    position, // Fixed point - keep original position
    [position[0] + ROPE_SEGMENT_LENGTH, restingY, position[2]], // j2
    [position[0] + ROPE_SEGMENT_LENGTH * 2, restingY, position[2]], // j3
    [position[0] + ROPE_SEGMENT_LENGTH * 3, restingY, position[2]], // j4
    [position[0] + ROPE_SEGMENT_LENGTH * 4, restingY, position[2]], // card
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

      // Update position in scene context for sharing
      setCardPosition(new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z))
    }
  })

  // Track rotation counters for detecting new rotations
  const lastClockwiseRef = useRef(0)
  const lastCounterClockwiseRef = useRef(0)
  const glowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Use the rotation tracker with rotation detection callback
  const { clockwiseRotations, counterClockwiseRotations } = useRotationTracker({
    card: cardRef,
    fixed: fixedRef,
    isDragging: dragged !== false,
  })

  // Watch for changes in rotations and trigger the glow effect
  useEffect(() => {
    const hasNewRotation =
      clockwiseRotations > lastClockwiseRef.current || counterClockwiseRotations > lastCounterClockwiseRef.current

    lastClockwiseRef.current = clockwiseRotations
    lastCounterClockwiseRef.current = counterClockwiseRotations

    if (hasNewRotation) {
      // Update local state
      setIsGlowing(true)

      // Update shared state through context
      setCardGlowing(true)
      incrementCardRotation()

      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current)
      }

      glowTimeoutRef.current = setTimeout(() => {
        setIsGlowing(false)
        setCardGlowing(false)
      }, PINHEAD_GLOW_TIMEOUT)
    }
  }, [clockwiseRotations, counterClockwiseRotations, setCardGlowing, incrementCardRotation])

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
      const colorStretch = Math.min((stretchRatio - 1) / config.ropeStyling.colorStretchSpeed, 1)

      const radiusStretch = Math.min((stretchRatio - 1) / config.ropeStyling.radiusStretchSpeed, 1)

      const grayValue = Math.floor(colorStretch * 180)
      const newColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`

      const newRadius =
        config.ropeStyling.initialRadius -
        radiusStretch * (config.ropeStyling.initialRadius - config.ropeStyling.minRadius)

      // Update shared state through context
      updateRopeVisuals(newColor, newRadius)
    } else {
      // Reset to defaults
      updateRopeVisuals(config.colors.ropeDefault, config.ropeStyling.initialRadius)
    }
  }, [points, config, updateRopeVisuals, restingLength])

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

  // Pin position offset relative to fixed position
  const pinheadPosition: [number, number, number] = [position[0], position[1] + PINHEAD_OFFSET, position[2]]

  // Update shared state and notify parent component when pinhead state changes
  useEffect(() => {
    if (onPinheadStateChange) {
      onPinheadStateChange(pinheadPosition, isGlowing)
    }

    // Update pinhead position in scene context
    setPinheadPosition(new THREE.Vector3(...pinheadPosition))
  }, [isGlowing, pinheadPosition, onPinheadStateChange, setPinheadPosition])

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
      {/* 
        Invisible draggable plane that follows the card's position but doesn't rotate.
        This provides a larger, consistent touch target even when the card rotates on its z-axis,
        significantly improving the mobile touch experience and preventing the draggable area from
        becoming too small during card rotation.
      */}
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
      <Pinhead position={pinheadPosition} color={PINHEAD_COLOR} size={PINHEAD_SIZE} isGlowing={isGlowing} />
      <Particles
        triggerCount={isGlowing ? 1 : 0}
        position={pinheadPosition}
        particleSize={config.particleSettings.size}
        particleCount={config.particleSettings.count}
        confetti={true}
      />
    </>
  )
}
