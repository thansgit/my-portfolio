'use client'

import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import { ThreeEvent, useFrame, useLoader } from '@react-three/fiber'
import { useGLTF, useCursor } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

// Preload the model for better performance
useGLTF.preload('/assets/models/testcard1.glb', true)

// Type definitions for the GLTF model
type GLTFResult = GLTF & {
  nodes: {
    Scene: THREE.Group & {
      traverse: (callback: (object: THREE.Object3D) => void) => void
    }
  }
  materials: Record<string, THREE.Material>
}

// Custom hook for creating a glass material with proper cleanup
const useGlassMaterial = () => {
  const normalMap = useLoader(THREE.TextureLoader, '/assets/textures/normal.jpg')
  const colorMap = useLoader(THREE.TextureLoader, '/assets/textures/2.png')

  return useMemo(() => {
    if (!normalMap || !colorMap) return null

    normalMap.wrapS = THREE.RepeatWrapping
    normalMap.wrapT = THREE.RepeatWrapping
    normalMap.repeat.set(1, 1)

    colorMap.wrapS = THREE.ClampToEdgeWrapping
    colorMap.wrapT = THREE.ClampToEdgeWrapping
    colorMap.minFilter = THREE.LinearFilter
    colorMap.magFilter = THREE.LinearFilter
    colorMap.premultiplyAlpha = false

    // Mirror texture horizontally and flip upside down
    colorMap.center.set(0.5, 0.5)
    colorMap.repeat.set(-1, 1)
    colorMap.rotation = Math.PI

    const material = new THREE.MeshPhysicalMaterial({
      transparent: true,
      transmission: 0.9,
      thickness: 0,
      roughness: 0.2,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.6,
      metalness: 0,
      ior: 1.5,
      map: colorMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      clearcoatNormalMap: normalMap,
      clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
      side: THREE.FrontSide,
      opacity: 0.9,
      reflectivity: 0.2,
      color: new THREE.Color('F0FFFF'),
      attenuationColor: new THREE.Color('F0FFFF'),
    })

    return material
  }, [normalMap, colorMap])
}

interface RopeMeshProps {
  points: THREE.Vector3[]
  radius?: number
  color?: string
}

// RopeMesh component to create a tubular mesh around the rope points
export const RopeMesh = ({ points, radius = 0.04, color = 'black' }: RopeMeshProps) => {
  const tubeGeometryRef = useRef<THREE.TubeGeometry | null>(null)
  const endSphereGeometryRef = useRef<THREE.SphereGeometry | null>(null)

  // Create a curve from points
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([...points])
  }, [points])

  // Create tube geometry around the curve
  const tubeGeometry = useMemo(() => {
    if (tubeGeometryRef.current) {
      tubeGeometryRef.current.dispose()
    }

    const newGeometry = new THREE.TubeGeometry(curve, 16, radius, 8, false)
    tubeGeometryRef.current = newGeometry
    return newGeometry
  }, [curve, radius])

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

interface InteractivePlaneProps {
  nodeRef: React.RefObject<{ translation(): { x: number; y: number; z: number } }>
  dragged: THREE.Vector3 | false
  onHover: (state: boolean) => void
  onDrag: (drag: THREE.Vector3 | false) => void
  size?: number
  debug?: boolean
}

export const DraggablePlane = ({
  nodeRef,
  dragged,
  onHover,
  onDrag,
  size = 1,
  debug = false,
}: InteractivePlaneProps) => {
  const vec = new THREE.Vector3()
  const billboardRef = useRef<THREE.Group>(null)

  // Handle cursor appearance based on hover state
  useCursor(false)

  // Make plane always face the camera
  useFrame(({ camera }) => {
    if (billboardRef.current) {
      billboardRef.current.quaternion.copy(camera.quaternion)
    }
  })

  // Handle pointer events
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    if (nodeRef.current) {
      const pos = nodeRef.current.translation()
      vec.set(pos.x, pos.y, pos.z)
      onDrag(new THREE.Vector3().copy(e.point).sub(vec))
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    onDrag(false)
  }

  return (
    <group ref={billboardRef}>
      <mesh
        scale={[size * 0.7, size, 1]}
        position={[0, 0.2, -1]}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => onDrag(false)}
      >
        <planeGeometry />
        <meshBasicMaterial visible={debug} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

interface CardModelProps {
  nodeRef: React.RefObject<{ translation(): { x: number; y: number; z: number } }>
  dragged: THREE.Vector3 | false
  onHover: (state: boolean) => void
  onDrag: (drag: THREE.Vector3 | false) => void
  glassColor?: string
  distortionStrength?: number
  refractionRatio?: number
}

export const CardModel = ({ nodeRef, dragged, onHover, onDrag }: CardModelProps) => {
  const { nodes } = useGLTF('/assets/models/testcard1.glb') as GLTFResult
  const vec = new THREE.Vector3()
  const groupRef = useRef<THREE.Group>(null)
  const initialRotation = useRef(Math.random() * Math.PI * 2)
  const sceneRef = useRef<THREE.Object3D | null>(null)

  // Use custom hook for glass material
  const glassMaterial = useGlassMaterial()

  // Handle cursor appearance based on hover state
  useCursor(false)

  // Add gentle swinging motion when card is at rest
  useFrame((state) => {
    if (!sceneRef.current) return

    if (dragged === false) {
      const time = state.clock.getElapsedTime()
      const swingAmplitude = 0.4
      const swingFrequency = 0.4
      const swingAngle = Math.sin(time * swingFrequency + initialRotation.current) * swingAmplitude
      sceneRef.current.rotation.z = swingAngle
    } else {
      // Smoothly dampen rotation when card is dragged
      sceneRef.current.rotation.z *= 0.9
    }
  })

  // Handle pointer events
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    if (nodeRef.current) {
      const pos = nodeRef.current.translation()
      vec.set(pos.x, pos.y, pos.z)
      onDrag(new THREE.Vector3().copy(e.point).sub(vec))
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    onDrag(false)
  }

  // Apply materials to the model meshes
  useEffect(() => {
    if (!glassMaterial || !nodes || !nodes.Scene) return

    nodes.Scene.renderOrder = 10
    sceneRef.current = nodes.Scene

    nodes.Scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      // Store original material for cleanup
      if (!child.userData.originalMaterial) {
        child.userData.originalMaterial = child.material
      }

      const materialName = child.material?.name || ''

      if (materialName.toLowerCase().includes('back')) {
        // Hide back material
        child.visible = false
        child.position.z += 1000
        child.renderOrder = -1
      } else if (materialName.toLowerCase().includes('front')) {
        // Apply glass material to front
        child.material = glassMaterial
        child.renderOrder = 100
      }
    })

    // Cleanup on unmount
    return () => {
      if (glassMaterial) {
        glassMaterial.dispose()
      }

      nodes.Scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh) || !child.userData.originalMaterial) return
        child.material = child.userData.originalMaterial
      })
    }
  }, [glassMaterial, nodes])

  return (
    <group
      ref={groupRef}
      scale={2}
      position={[0, 0.3, 0]}
      rotation={[Math.PI * 0.5, 0, 0]}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => onDrag(false)}
    >
      <primitive object={nodes.Scene} />
    </group>
  )
}
