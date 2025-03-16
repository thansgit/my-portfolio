'use client'

import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useMemo, useRef, useEffect } from 'react'
import { CARD_MATERIAL, CARD_RENDER_ORDER } from '@/components/three/utils/constants'

interface MaterialSet {
  front: THREE.MeshPhysicalMaterial
  back: THREE.MeshPhysicalMaterial
}

export const useReflectiveMaterial = (sceneRef: React.RefObject<THREE.Object3D | null>) => {
  const normalMap = useLoader(THREE.TextureLoader, '/assets/textures/normal.jpg')
  const cardFrontTexture = useLoader(THREE.TextureLoader, '/assets/textures/Frontside.png')
  const cardBackTexture = useLoader(THREE.TextureLoader, '/assets/textures/Backside.png')
  const frontMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const backMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  // Create the materials
  const materials = useMemo<MaterialSet | null>(() => {
    if (!normalMap || !cardFrontTexture || !cardBackTexture) {
      return null
    }

    // Clean up previous materials
    ;[frontMaterialRef.current, backMaterialRef.current].forEach((material: THREE.MeshPhysicalMaterial | null) => {
      if (material) material.dispose()
    })

    // Set up normal map
    normalMap.wrapS = THREE.RepeatWrapping
    normalMap.wrapT = THREE.RepeatWrapping
    normalMap.repeat.set(1, 1)

    const configureCardTexture = (texture: THREE.Texture) => {
      // Mirror texture horizontally and flip upside down
      texture.center.set(0.5, 0.5)
      texture.repeat.set(-1, 1)
      texture.rotation = Math.PI

      return texture
    }

    // Configure textures
    configureCardTexture(cardFrontTexture)
    configureCardTexture(cardBackTexture)

    const createCardMaterial = (map: THREE.Texture) => {
      return new THREE.MeshPhysicalMaterial({
        map,
        normalMap,
        normalScale: new THREE.Vector2(0.5, 0.5),
        side: THREE.FrontSide,
        color: new THREE.Color('#ffffff'),
        ...CARD_MATERIAL,
      })
    }

    // Create materials
    const newFrontMaterial = createCardMaterial(cardFrontTexture)
    const newBackMaterial = createCardMaterial(cardBackTexture)

    frontMaterialRef.current = newFrontMaterial
    backMaterialRef.current = newBackMaterial

    return { front: newFrontMaterial, back: newBackMaterial }
  }, [normalMap, cardFrontTexture, cardBackTexture])

  // Apply materials to the model meshes when materials and scene are ready
  useEffect(() => {
    const scene = sceneRef.current
    if (!materials || !scene) return
    scene.renderOrder = CARD_RENDER_ORDER

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const materialName = child.material.name
          if (materialName.includes('front')) {
            child.material = materials.front
          } else if (materialName.includes('back')) {
            child.material = materials.back
            // Tell Three.js to use the second UV map
            child.material.map.channel = 1
          }
        }
      }
    })
  }, [materials, sceneRef])

  // Cleanup on unmount or dependencies change
  useEffect(() => {
    return () => {
      ;[frontMaterialRef, backMaterialRef].forEach((ref) => {
        if (ref.current) {
          ref.current.dispose()
          ref.current = null
        }
      })
    }
  }, [])

  return materials
}
