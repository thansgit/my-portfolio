'use client'

import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useMemo, useRef, useEffect } from 'react'
import { CARD_MATERIAL } from '@/components/three/utils/constants'

export const useReflectiveMaterial = () => {
  const normalMap = useLoader(THREE.TextureLoader, '/assets/textures/normal.jpg')
  const colorMap = useLoader(THREE.TextureLoader, '/assets/textures/2.png')
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  // Create the material
  const material = useMemo(() => {
    if (!normalMap || !colorMap) return null

    // Clean up previous material if it exists
    if (materialRef.current) {
      materialRef.current.dispose()
    }

    // Set up normal map
    normalMap.wrapS = THREE.RepeatWrapping
    normalMap.wrapT = THREE.RepeatWrapping
    normalMap.repeat.set(1, 1)

    // Set up color map
    colorMap.wrapS = THREE.ClampToEdgeWrapping
    colorMap.wrapT = THREE.ClampToEdgeWrapping
    colorMap.minFilter = THREE.LinearFilter
    colorMap.magFilter = THREE.LinearFilter
    colorMap.premultiplyAlpha = false

    // Mirror texture horizontally and flip upside down
    colorMap.center.set(0.5, 0.5)
    colorMap.repeat.set(-1, 1)
    colorMap.rotation = Math.PI

    // Create the material - making it more visible with stronger base color
    const newMaterial = new THREE.MeshPhysicalMaterial({
      map: colorMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      side: THREE.FrontSide,
      color: new THREE.Color('#ffffff'), // Add white base color
      ...CARD_MATERIAL,
    })

    materialRef.current = newMaterial
    return newMaterial
  }, [normalMap, colorMap])

  // Cleanup on unmount or dependencies change
  useEffect(() => {
    return () => {
      if (materialRef.current) {
        materialRef.current.dispose()
        materialRef.current = null
      }
    }
  }, [])

  return material
}
