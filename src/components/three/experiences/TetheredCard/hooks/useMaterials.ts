'use client'

import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useMemo, useRef, useEffect } from 'react'
import { CARD_MATERIAL, CARD_RENDER_ORDER } from '@/components/three/utils/constants'

interface MaterialSet {
  front: THREE.MeshPhysicalMaterial
  back: THREE.MeshPhysicalMaterial
  backTextures: THREE.Texture[]
}

/**
 * Hook that manages reflective materials for the card component.
 * Creates and manages front and back materials with proper shader modifications
 * and handles rotation-based texture swapping through 8 sequential textures
 */
export const useReflectiveMaterial = (
  sceneRef: React.RefObject<THREE.Object3D | null>,
  options: { transparentColor?: THREE.Color | string, rotationCount?: number } = {},
) => {
  // Load all textures
  const normalMap = useLoader(THREE.TextureLoader, '/assets/textures/normal.jpg')
  const cardFrontTexture = useLoader(THREE.TextureLoader, '/assets/textures/front.png')
  
  // Load all 8 back textures
  const cardBackTextures = [
    useLoader(THREE.TextureLoader, '/assets/textures/1.webp'),
    useLoader(THREE.TextureLoader, '/assets/textures/2.webp'),
    useLoader(THREE.TextureLoader, '/assets/textures/3.webp'),
    useLoader(THREE.TextureLoader, '/assets/textures/4.webp'),
    useLoader(THREE.TextureLoader, '/assets/textures/5.webp'),
    useLoader(THREE.TextureLoader, '/assets/textures/6.webp'),
    useLoader(THREE.TextureLoader, '/assets/textures/7.webp'),
    useLoader(THREE.TextureLoader, '/assets/textures/8.webp')
  ]

  // Material references for disposal handling
  const frontMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const backMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  // Color uniform for shader modifications
  const colorUniformRef = useRef<THREE.Uniform<THREE.Color>>(new THREE.Uniform(new THREE.Color('#ff6600')))

  // Extract rotation count from options
  const rotationCount = options.rotationCount
  
  // Track the current texture index, persistent between renders
  const currentTextureIndex = useRef<number>(0)
  
  // Previous rotation count to detect changes
  const prevRotationCount = useRef<number | undefined>(undefined)

  // Configure all textures once
  useEffect(() => {
    if (normalMap && cardFrontTexture && cardBackTextures.every(texture => texture)) {
      normalMap.wrapS = THREE.RepeatWrapping
      normalMap.wrapT = THREE.RepeatWrapping
      normalMap.repeat.set(1, 1)

      const configureCardTexture = (texture: THREE.Texture) => {
        texture.center.set(0.5, 0.5)
        texture.repeat.set(-1, 1)
        texture.rotation = Math.PI
        texture.format = THREE.RGBAFormat
        texture.premultiplyAlpha = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.anisotropy = 16
      }

      configureCardTexture(cardFrontTexture)
      cardBackTextures.forEach(configureCardTexture)
    }
  }, [normalMap, cardFrontTexture, ...cardBackTextures])

  // Parse transparent color option
  const transparentColor = useMemo(() => {
    if (!options.transparentColor) return new THREE.Color('#ff6600')
    return options.transparentColor instanceof THREE.Color
      ? options.transparentColor
      : new THREE.Color(options.transparentColor)
  }, [options.transparentColor])

  // Create all materials
  const materials = useMemo<MaterialSet | null>(() => {
    if (!normalMap || !cardFrontTexture || cardBackTextures.some(texture => !texture)) {
      return null
    }

    // Dispose previous materials
    if (frontMaterialRef.current) frontMaterialRef.current.dispose()
    if (backMaterialRef.current) backMaterialRef.current.dispose()

    // Update color uniform
    colorUniformRef.current.value.copy(transparentColor)

    // Helper function for shader modifications
    const applyColorShaderModification = (material: THREE.MeshPhysicalMaterial) => {
      material.onBeforeCompile = (shader) => {
        shader.uniforms.fillColor = colorUniformRef.current

        shader.fragmentShader = 'uniform vec3 fillColor;\n' + shader.fragmentShader

        const mapColorPattern = '#include <map_fragment>'
        const customMapFragment = `
  vec4 texelColor = texture2D( map, vMapUv );
  
  float alphaThreshold = 0.5;
  float smoothingRange = 0.1; 
  
  if (texelColor.a < alphaThreshold + smoothingRange) {
    float blendFactor = smoothstep(alphaThreshold - smoothingRange, alphaThreshold + smoothingRange, texelColor.a);
    texelColor.rgb = mix(fillColor, texelColor.rgb, blendFactor);
    texelColor.a = max(texelColor.a, 1.0 - blendFactor); 
  }
  
  diffuseColor *= texelColor;
`
        shader.fragmentShader = shader.fragmentShader.replace(mapColorPattern, customMapFragment)
      }
    }

    // Create base material parameters
    const baseMaterialParams = {
      normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      side: THREE.FrontSide,
      transparent: true,
      alphaTest: 0.01,
      alphaToCoverage: true,
      ...CARD_MATERIAL,
    }

    // Create front material
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      ...baseMaterialParams,
      map: cardFrontTexture,
    })
    applyColorShaderModification(frontMaterial)
    frontMaterial.name = 'front-material'
    frontMaterialRef.current = frontMaterial

    // Create a single back material with the first texture
    const backMaterial = new THREE.MeshPhysicalMaterial({
      ...baseMaterialParams,
      map: cardBackTextures[0],
    })
    applyColorShaderModification(backMaterial)
    backMaterial.name = 'back-material'
    backMaterialRef.current = backMaterial
    
    // Make sure to set the texture channel for the back UV mapping
    if (backMaterial.map) {
      backMaterial.map.channel = 1
    }

    return {
      front: frontMaterial,
      back: backMaterial,
      backTextures: cardBackTextures
    }
  }, [normalMap, cardFrontTexture, ...cardBackTextures, transparentColor])

  // Apply materials and handle texture cycling based on rotation count
  useEffect(() => {
    const scene = sceneRef.current
    if (!materials || !scene) return

    // Set render order for proper transparency
    scene.renderOrder = CARD_RENDER_ORDER

    // If rotation count changed, advance to the next texture
    if (rotationCount !== undefined && prevRotationCount.current !== undefined && 
        rotationCount !== prevRotationCount.current) {
      // Advance to next texture in sequence
      currentTextureIndex.current = (currentTextureIndex.current + 1) % 8
      console.log(`Advancing to texture index: ${currentTextureIndex.current + 1}`)
      
      // Update the texture on the existing material (more efficient than swapping materials)
      if (materials.back && materials.back.map) {
        materials.back.map = materials.backTextures[currentTextureIndex.current]
        // Make sure to maintain the texture channel for the back UV mapping
        materials.back.map.channel = 1
        materials.back.needsUpdate = true
      }
    }
    
    // Update previous rotation count
    prevRotationCount.current = rotationCount
    
    // Apply materials to all meshes in the scene
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const materialName = child.material.name
          if (materialName.includes('front')) {
            child.material = materials.front
          } else if (materialName.includes('back')) {
            // Use the single back material with updated texture
            child.material = materials.back
          }
        }
      }
    })
  }, [materials, sceneRef, rotationCount])

  // Update color when transparent color changes
  useEffect(() => {
    if (colorUniformRef.current) {
      colorUniformRef.current.value.copy(transparentColor)

      // Update all materials to use the new color
      if (frontMaterialRef.current) frontMaterialRef.current.needsUpdate = true
      if (backMaterialRef.current) backMaterialRef.current.needsUpdate = true
    }
  }, [transparentColor])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frontMaterialRef.current) frontMaterialRef.current.dispose()
      if (backMaterialRef.current) backMaterialRef.current.dispose()
    }
  }, [])
}

// Helper function to create a Three.js color from a string
export const createCardColor = (colorString: string): THREE.Color => {
  return new THREE.Color(colorString)
}
