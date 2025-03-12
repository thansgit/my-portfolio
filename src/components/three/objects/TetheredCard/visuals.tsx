'use client'

import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/assets/models/card.glb', true)

interface RopeMeshProps {
  points: THREE.Vector3[]
  radius?: number
  color?: string
}

// RopeMesh component to create a tubular mesh around the rope points
export const RopeMesh = ({ points, radius = 0.04, color = 'black' }: RopeMeshProps) => {
  const tubeGeometryRef = useRef<THREE.TubeGeometry | null>(null)
  const endSphereGeometryRef = useRef<THREE.SphereGeometry | null>(null)

  const curve = useMemo(() => {
    const curvePoints = [...points]
    return new THREE.CatmullRomCurve3(curvePoints)
  }, [points])

  // Create a tubular geometry along the curve
  const tubeGeometry = useMemo(() => {
    // Dispose of the previous geometry if it exists
    if (tubeGeometryRef.current) {
      tubeGeometryRef.current.dispose()
    }

    const newGeometry = new THREE.TubeGeometry(curve, 32, radius, 8, false)
    tubeGeometryRef.current = newGeometry
    return newGeometry
  }, [curve, radius])

  // Get the start and end points for cap spheres
  const startPoint = useMemo(() => points[0], [points])
  const endPoint = useMemo(() => points[points.length - 1], [points])

  // Clean up geometries when component unmounts
  useEffect(() => {
    return () => {
      if (tubeGeometryRef.current) {
        tubeGeometryRef.current.dispose()
      }
      if (endSphereGeometryRef.current) {
        endSphereGeometryRef.current.dispose()
      }
    }
  }, [])

  return (
    <group>
      {/* Main tube */}
      <mesh>
        <primitive object={tubeGeometry} attach='geometry' />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Cap at the end point */}
      <mesh position={endPoint}>
        <sphereGeometry
          ref={(geometry) => {
            if (endSphereGeometryRef.current && geometry !== endSphereGeometryRef.current) {
              endSphereGeometryRef.current.dispose()
            }
            endSphereGeometryRef.current = geometry
          }}
          args={[radius, 4, 4]}
        />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

interface CardModelProps {
  nodeRef: React.MutableRefObject<any>
  dragged: THREE.Vector3 | false
  onHover: (state: boolean) => void
  onDrag: (drag: THREE.Vector3 | false) => void
}

interface DraggablePlaneProps {
  nodeRef: React.MutableRefObject<any>
  dragged: THREE.Vector3 | false
  onHover: (state: boolean) => void
  onDrag: (drag: THREE.Vector3 | false) => void
  size?: number
  debug?: boolean
}

export const DraggablePlane = ({ nodeRef, dragged, onHover, onDrag, size = 1, debug = false }: DraggablePlaneProps) => {
  const vec = new THREE.Vector3()
  const billboardRef = useRef<THREE.Group>(null)

  // Make the draggable plane always face the camera
  useFrame(({ camera }) => {
    if (billboardRef.current) {
      billboardRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <group ref={billboardRef}>
      <mesh
        scale={[size * 0.7, size, 1]}
        position={[0, +0.2, -1]}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
          onDrag(new THREE.Vector3().copy(e.point).sub(vec.copy(nodeRef.current!.translation())))
        }}
        onPointerUp={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
          onDrag(false)
        }}
        onPointerCancel={() => {
          onDrag(false)
        }}
      >
        <planeGeometry />
        <meshBasicMaterial visible={debug} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export const CardModel = ({ nodeRef, dragged, onHover, onDrag }: CardModelProps) => {
  const { nodes } = useGLTF('/assets/models/card.glb')
  const vec = new THREE.Vector3()

  return (
    <group
      scale={2}
      position={[0, 0.08, -0.03]}
      rotation={[Math.PI * 0.5, 0, 0]}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        onDrag(new THREE.Vector3().copy(e.point).sub(vec.copy(nodeRef.current!.translation())))
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
        onDrag(false)
      }}
      // Use pointer events instead of touch events for better compatibility
      onPointerCancel={() => {
        onDrag(false)
      }}
    >
      <primitive object={nodes.Scene} />
    </group>
  )
}
