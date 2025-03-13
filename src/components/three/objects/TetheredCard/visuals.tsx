'use client'

import * as THREE from 'three'
import { useMemo, useRef, useEffect, useState } from 'react'
import { ThreeEvent, useFrame, useLoader } from '@react-three/fiber'
import { useGLTF, Environment as DreiEnvironment } from '@react-three/drei'

useGLTF.preload('/assets/models/testcard.glb', true)

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
  const { nodes, materials } = useGLTF('/assets/models/testcard.glb')
  const vec = new THREE.Vector3()
  const groupRef = useRef<THREE.Group>(null)
  const initialRotation = useRef(Math.random() * Math.PI * 2) // Satunnainen alkurotaatio jokaiselle kortille
  const sceneRef = useRef<THREE.Object3D | null>(null) // Tallennetaan viite scene-objektiin

  // Lisätään pieni heilunta kun kortti on lepotilassa
  useFrame((state) => {
    if (sceneRef.current && dragged === false) {
      // Käytetään siniaaltoliikettä pehmeän heilunnan luomiseen
      const time = state.clock.getElapsedTime()

      // Vahvemmat heilunnan parametrit
      const swingAmplitude = 6.28 // Isompi heiluntakulma (radiaaneissa) //6.28 to rotate 360
      const swingFrequency = 0.4 // Hieman nopeampi heilunta

      // Lasketaan heilunnan kulma
      const swingAngle = Math.sin(time * swingFrequency + initialRotation.current) * swingAmplitude

      // Tärkeä muutos: käytämme suoraan scene-noden rotaatiota fysiikkamoottorin sijaan
      sceneRef.current.rotation.z = swingAngle
    } else if (sceneRef.current && dragged !== false) {
      // Kun korttia raahataan, palautetaan rotaatio nollaan pehmeästi
      sceneRef.current.rotation.z *= 0.9 // Vaimennetaan rotaatiota
    }
  })

  // Lataa normaalikartta ja väritekstuuri
  const normalMap = useLoader(THREE.TextureLoader, '/assets/textures/normal.jpg')
  const colorMap = useLoader(THREE.TextureLoader, '/assets/textures/Frontside.png')

  // Luo lasimateriaali
  const glassMaterial = useMemo(() => {
    if (!normalMap || !colorMap) return null

    // Aseta tekstuuriasetukset
    normalMap.wrapS = THREE.RepeatWrapping
    normalMap.wrapT = THREE.RepeatWrapping
    normalMap.repeat.set(1, 1)

    // Aseta väritekstuuri ja käännä se 180 astetta
    colorMap.wrapS = THREE.ClampToEdgeWrapping
    colorMap.wrapT = THREE.ClampToEdgeWrapping
    colorMap.minFilter = THREE.LinearFilter
    colorMap.magFilter = THREE.LinearFilter
    colorMap.premultiplyAlpha = false

    // Peilataan tekstuuri vaakasuunnassa ja käännetään ylösalaisin
    colorMap.center.set(0.5, 0.5) // Asetetaan rotaation keskipiste tekstuurin keskelle
    colorMap.repeat.set(-1, 1) // Negatiivinen x-arvo peilaa tekstuurin vaakasuunnassa
    colorMap.rotation = Math.PI // 180 astetta (ylösalaisin kääntö)

    // Luo materiaaliobjekti
    const material = new THREE.MeshPhysicalMaterial({
      transparent: true,
      transmission: 1,
      thickness: 0.5,
      roughness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      metalness: 0.1,
      ior: 1.5,
      map: colorMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      clearcoatNormalMap: normalMap,
      clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
      side: THREE.FrontSide,
      depthWrite: true,
      depthTest: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      alphaTest: 0.01,
      opacity: 1.0,
      envMapIntensity: 0.8,
      reflectivity: 0.5,
      color: new THREE.Color('#00b5ad'),
      attenuationColor: new THREE.Color('#00b5ad'),
      attenuationDistance: 4.0,
    })

    return material
  }, [normalMap, colorMap])

  // Sovella lasimateriaali mesheihin
  useEffect(() => {
    if (!glassMaterial || !nodes || !nodes.Scene) return

    // Aseta renderöintijärjestys suhteessa taustaan
    nodes.Scene.renderOrder = 10

    // Tallenna viite Scene-objektiin
    sceneRef.current = nodes.Scene

    // Käsittele kaikki meshit
    nodes.Scene.traverse((child: any) => {
      if (child.isMesh) {
        // Tallenna alkuperäinen materiaali
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material
        }

        const materialName = child.material?.name || ''

        // Piilota backmaterial
        if (materialName.toLowerCase().includes('back')) {
          child.visible = false
          child.position.z += 1000
          child.renderOrder = -1
        }
        // Käytä lasia frontmaterialille
        else if (materialName.toLowerCase().includes('front')) {
          child.material = glassMaterial
          child.renderOrder = 100
          child.castShadow = true
          child.receiveShadow = true
        }
      }
    })

    // Puhdistus unmountatessa
    return () => {
      if (glassMaterial) {
        glassMaterial.dispose()
      }

      nodes.Scene.traverse((child: any) => {
        if (child.isMesh && child.userData.originalMaterial) {
          child.material = child.userData.originalMaterial
        }
      })
    }
  }, [glassMaterial, nodes])

  return (
    <group
      ref={groupRef}
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
      onPointerCancel={() => {
        onDrag(false)
      }}
    >
      <primitive object={nodes.Scene} />
    </group>
  )
}
