'use client'

import { Particles, Pinhead } from '@/components/three'
import { useJoints, usePhysicsUpdate, useRotationTracker, useTouchHandling } from '@/components/three/hooks'
import {
  ROPE_COLOR_STRETCH_SPEED,
  ROPE_INITIAL_RADIUS,
  ROPE_MIN_RADIUS,
  ROPE_RADIUS_STRETCH_SPEED,
  ROPE_SEGMENT_LENGTH,
  SEGMENT_PROPS,
} from '@/components/three/utils/constants'
import { ExtendedRigidBody, TetheredCardProps } from '@/components/three/utils/types'
import { useFrame } from '@react-three/fiber'
import { BallCollider, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { CardModel, DraggablePlane, RopeMesh } from './visuals'

export const TetheredCard = ({
  position = [0, 0, 0],
  maxSpeed = 50,
  minSpeed = 10,
  onPinheadStateChange,
  debug = false,
  glassColor = '#88ccff',
  distortionStrength = 0.5,
  refractionRatio = 0.98,
}: TetheredCardProps = {}) => {
  const card = useRef<RapierRigidBody>(null)
  const fixed = useRef<RapierRigidBody>(null)
  const j2 = useRef<ExtendedRigidBody | null>(null)
  const j3 = useRef<RapierRigidBody | null>(null)
  const j4 = useRef<RapierRigidBody | null>(null)

  // Calculate resting positions based on physics simulation
  const restingY = position[1] - 2 // Lower than the fixed point

  // Calculate all joint positions in one go to reduce repetition
  const jointPositions = [
    position, // Fixed point - keep original position
    [position[0] + ROPE_SEGMENT_LENGTH, restingY, position[2]], // j2
    [position[0] + ROPE_SEGMENT_LENGTH * 2, restingY, position[2]], // j3
    [position[0] + ROPE_SEGMENT_LENGTH * 3, restingY, position[2]], // j4
    [position[0] + ROPE_SEGMENT_LENGTH * 4, restingY, position[2]], // card
  ] as [number, number, number][]

  // For clarity
  const finalCardPosition = jointPositions[4]

  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)
  const glowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const lastClockwiseRef = useRef(0)
  const lastCounterClockwiseRef = useRef(0)

  const [rotationCounter, setRotationCounter] = useState(0)

  // Initialize points with the pre-calculated resting positions
  const [points, setPoints] = useState([
    new THREE.Vector3(...jointPositions[0]),
    new THREE.Vector3(...jointPositions[1]),
    new THREE.Vector3(...jointPositions[2]),
    new THREE.Vector3(...jointPositions[3]),
  ])

  const [ropeColor, setRopeColor] = useState('#000000')
  const [ropeRadius, setRopeRadius] = useState(ROPE_INITIAL_RADIUS)

  const planeGroupRef = useRef<THREE.Group>(null)

  const planePosition = useRef<THREE.Vector3>(
    new THREE.Vector3(finalCardPosition[0], finalCardPosition[1], finalCardPosition[2]),
  )

  useFrame(() => {
    if (card.current && planeGroupRef.current) {
      const cardPos = card.current.translation()
      planePosition.current.set(cardPos.x, cardPos.y, cardPos.z)
      planeGroupRef.current.position.copy(planePosition.current)
    }
  })

  // Use the rotation tracker with rotation detection callback
  const { clockwiseRotations, counterClockwiseRotations } = useRotationTracker({
    card,
    fixed,
    isDragging: dragged !== false,
  })

  // Watch for changes in rotations and trigger the glow effect
  useEffect(() => {
    const hasNewRotation =
      clockwiseRotations > lastClockwiseRef.current || counterClockwiseRotations > lastCounterClockwiseRef.current

    lastClockwiseRef.current = clockwiseRotations
    lastCounterClockwiseRef.current = counterClockwiseRotations

    if (hasNewRotation) {
      setIsGlowing(true)
      setRotationCounter((prev) => prev + 1)

      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current)
      }

      glowTimeoutRef.current = setTimeout(() => {
        setIsGlowing(false)
      }, 1500)
    }

    return () => {
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current)
      }
    }
  }, [clockwiseRotations, counterClockwiseRotations])

  useJoints(fixed, j2, j3, j4, card, ROPE_SEGMENT_LENGTH)
  useTouchHandling(dragged, hovered)

  const calculateRopeLength = (pts: THREE.Vector3[]): number => {
    let totalLength = 0
    for (let i = 0; i < pts.length - 1; i++) {
      totalLength += pts[i].distanceTo(pts[i + 1])
    }
    return totalLength
  }

  const restingLength = ROPE_SEGMENT_LENGTH * 5

  useEffect(() => {
    const currentLength = calculateRopeLength(points)
    const stretchRatio = Math.max(1, currentLength / restingLength)

    if (stretchRatio > 1) {
      const colorStretch = Math.min((stretchRatio - 1) / ROPE_COLOR_STRETCH_SPEED, 1)
      const radiusStretch = Math.min((stretchRatio - 1) / ROPE_RADIUS_STRETCH_SPEED, 1)

      const grayValue = Math.floor(colorStretch * 180)
      setRopeColor(`rgb(${grayValue}, ${grayValue}, ${grayValue})`)

      const newRadius = ROPE_INITIAL_RADIUS - radiusStretch * (ROPE_INITIAL_RADIUS - ROPE_MIN_RADIUS)
      setRopeRadius(newRadius)
    } else {
      setRopeColor('#000000')
      setRopeRadius(ROPE_INITIAL_RADIUS)
    }
  }, [points])

  // Create the card model element with glass effect
  const cardModelElement = useMemo(
    () => (
      <CardModel
        nodeRef={card}
        dragged={dragged}
        onHover={hover}
        onDrag={drag}
        glassColor={glassColor}
        distortionStrength={distortionStrength}
        refractionRatio={refractionRatio}
      />
    ),
    [card, dragged, hover, drag, glassColor, distortionStrength, refractionRatio],
  )

  usePhysicsUpdate({
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
  })

  // Pin position offset relative to fixed position
  const pinOffset = 0.18
  const pinheadPosition: [number, number, number] = [position[0], position[1] + pinOffset, position[2]]

  // Notify parent component when pinhead state changes
  useEffect(() => {
    if (onPinheadStateChange) {
      onPinheadStateChange(pinheadPosition, isGlowing)
    }
  }, [isGlowing, pinheadPosition, onPinheadStateChange])

  return (
    <>
      <RigidBody ref={fixed} position={jointPositions[0]} {...SEGMENT_PROPS} type='fixed' />
      <RigidBody position={jointPositions[1]} ref={j2} {...SEGMENT_PROPS}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={jointPositions[2]} ref={j3} {...SEGMENT_PROPS}>
        <BallCollider args={[0.05]} />
      </RigidBody>
      <RigidBody position={jointPositions[3]} ref={j4} {...SEGMENT_PROPS}>
        <BallCollider args={[0.05]} />
      </RigidBody>
      <RigidBody
        ref={card}
        {...SEGMENT_PROPS}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        position={finalCardPosition}
      >
        {cardModelElement}
      </RigidBody>
      {/* 
        Invisible draggable plane that follows the card's position but doesn't rotate.
        This provides a larger, consistent touch target even when the card rotates on its z-axis,
        significantly improving the mobile touch experience and preventing the draggable area from
        becoming too small during card rotation.
      */}{' '}
      <group ref={planeGroupRef} position={[finalCardPosition[0], finalCardPosition[1], finalCardPosition[2]]}>
        <DraggablePlane
          nodeRef={card}
          dragged={dragged}
          onHover={hover}
          onDrag={drag}
          size={2.5} // Larger drag area for better mobile experience
          debug={false}
        />
      </group>
      {/* Add the visual rope mesh */}
      <RopeMesh points={points} color={ropeColor} radius={ropeRadius} />
      <Pinhead position={pinheadPosition} color='red' size={0.08} isGlowing={isGlowing} />
      <Particles
        triggerCount={rotationCounter}
        position={pinheadPosition}
        particleSize={0.075}
        particleCount={200}
        confetti={true}
      />
    </>
  )
}
