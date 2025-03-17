'use client'

import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useMemo, useRef, useEffect } from 'react'
import { CARD_MATERIAL, CARD_RENDER_ORDER } from '@/components/three/utils/constants'

interface MaterialSet {
  front: THREE.MeshPhysicalMaterial
  back: THREE.MeshPhysicalMaterial
}

interface MaterialOptions {
  transparentColor?: THREE.Color | string
}

export const useReflectiveMaterial = (
  sceneRef: React.RefObject<THREE.Object3D | null>,
  options: MaterialOptions = {},
) => {
  const normalMap = useLoader(THREE.TextureLoader, '/assets/textures/normal.jpg')
  const cardFrontTexture = useLoader(THREE.TextureLoader, '/assets/textures/front.png')
  const cardBackTexture = useLoader(THREE.TextureLoader, '/assets/textures/back1.png')
  const frontMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const backMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const colorUniformRef = useRef<THREE.Uniform<THREE.Color>>(new THREE.Uniform(new THREE.Color('#ff6600')))

  // Convert string to THREE.Color if needed
  const transparentColor = useMemo(() => {
    if (!options.transparentColor) return new THREE.Color('#ff6600')
    return options.transparentColor instanceof THREE.Color
      ? options.transparentColor
      : new THREE.Color(options.transparentColor)
  }, [options.transparentColor])

  // Update color uniform when color changes
  useEffect(() => {
    if (colorUniformRef.current) {
      colorUniformRef.current.value.copy(transparentColor)
      console.log('Color updated to:', transparentColor.getHexString())

      // Trigger material update
      if (frontMaterialRef.current) {
        frontMaterialRef.current.needsUpdate = true
      }
    }
  }, [transparentColor])

  // Create the materials
  const materials = useMemo<MaterialSet | null>(() => {
    if (!normalMap || !cardFrontTexture || !cardBackTexture) {
      return null
    }

    // Clean up previous materials
    if (frontMaterialRef.current) frontMaterialRef.current.dispose()
    if (backMaterialRef.current) backMaterialRef.current.dispose()

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

    // Ensure proper texture formats for transparency
    cardFrontTexture.format = THREE.RGBAFormat
    cardFrontTexture.premultiplyAlpha = false
    cardBackTexture.format = THREE.RGBAFormat
    cardBackTexture.premultiplyAlpha = false

    // Initialize the color uniform
    colorUniformRef.current.value.copy(transparentColor)

    // Set texture filtering for better quality (function to avoid code duplication)
    const configureTextureQuality = (texture: THREE.Texture) => {
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.anisotropy = 16 // Higher anisotropy for sharper edges
    }

    // Apply quality settings to both textures
    configureTextureQuality(cardFrontTexture)
    configureTextureQuality(cardBackTexture)

    // Shared shader modifier function for both materials
    const applyColorShaderModification = (material: THREE.MeshPhysicalMaterial) => {
      material.onBeforeCompile = (shader) => {
        // Add our custom uniform
        shader.uniforms.fillColor = colorUniformRef.current

        // Add uniform declaration to the fragment shader
        shader.fragmentShader = 'uniform vec3 fillColor;\n' + shader.fragmentShader

        // Replace the fragment shader's map color calculation to apply our color to transparent areas
        const mapColorPattern = '#include <map_fragment>'
        const customMapFragment = `
  vec4 texelColor = texture2D( map, vMapUv );
  
  // Apply custom fill color to transparent areas with smooth transition
  float alphaThreshold = 0.5;
  float smoothingRange = 0.1; // Controls the width of transition
  
  if (texelColor.a < alphaThreshold + smoothingRange) {
    // Create a smooth transition between original texture and fill color
    float blendFactor = smoothstep(alphaThreshold - smoothingRange, alphaThreshold + smoothingRange, texelColor.a);
    texelColor.rgb = mix(fillColor, texelColor.rgb, blendFactor);
    texelColor.a = max(texelColor.a, 1.0 - blendFactor); // Ensure edges have some alpha
  }
  
  diffuseColor *= texelColor;
`

        // Replace the map fragment
        shader.fragmentShader = shader.fragmentShader.replace(mapColorPattern, customMapFragment)
      }
    }

    // Create front material with custom shader modification
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: cardFrontTexture,
      normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      side: THREE.FrontSide,
      transparent: true,
      alphaTest: 0.01,
      alphaToCoverage: true,
      ...CARD_MATERIAL,
    })

    // Apply shader modification to front material
    applyColorShaderModification(frontMaterial)

    // Create back material with same modifications
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: cardBackTexture,
      normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      side: THREE.FrontSide,
      transparent: true,
      alphaTest: 0.01,
      alphaToCoverage: true,
      ...CARD_MATERIAL,
    })

    // Apply shader modification to back material
    applyColorShaderModification(backMaterial)

    frontMaterialRef.current = frontMaterial
    backMaterialRef.current = backMaterial

    return { front: frontMaterial, back: backMaterial }
  }, [normalMap, cardFrontTexture, cardBackTexture, transparentColor])

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
            if (child.material.map) {
              child.material.map.channel = 1
            }
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
          if (ref.current.map) ref.current.map.dispose()
          ref.current.dispose()
          ref.current = null
        }
      })
    }
  }, [])

  return materials
}

// Export a utility function to easily create a color for the hook
export const createCardColor = (colorString: string): THREE.Color => {
  return new THREE.Color(colorString)
}
