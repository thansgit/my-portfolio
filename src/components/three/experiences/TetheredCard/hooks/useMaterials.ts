'use client'

import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useMemo, useRef, useEffect } from 'react'
import { CARD_MATERIAL, CARD_RENDER_ORDER } from '@/components/three/utils/constants'

export interface TextureColorPair {
  texture: string
  color: string
}

export const DEFAULT_TEXTURE_COLOR_PAIRS: TextureColorPair[] = [
  { texture: '1.webp', color: '#32CD32' },
  { texture: '2.webp', color: '#008080' },
  { texture: '3.webp', color: '#FFD700' },
  { texture: '4.webp', color: '#BA55D3' },
  { texture: '5.webp', color: '#DC143C' },
  { texture: '6.webp', color: '#CC5500' },
  { texture: '7.webp', color: '#A0522D' },
  { texture: '8.webp', color: '#4169E1' },
]

interface MaterialSet {
  front: THREE.MeshPhysicalMaterial
  back: THREE.MeshPhysicalMaterial
  backTextures: THREE.Texture[]
}

/**
 * Creates and manages card materials with texture cycling and color pairing
 * When rotation happens, both back texture and front color update together
 */
export const useReflectiveMaterial = (
  sceneRef: React.RefObject<THREE.Object3D | null>,
  options: {
    transparentColor?: THREE.Color | string
    textureIndex?: number
    textureColorPairs?: TextureColorPair[]
  } = {},
) => {
  const normalMap = useLoader(THREE.TextureLoader, '/assets/textures/normal.jpg')
  const cardFrontTexture = useLoader(THREE.TextureLoader, '/assets/textures/front.png')

  const textureColorPairs = options.textureColorPairs || DEFAULT_TEXTURE_COLOR_PAIRS
  const cardBackTextures = textureColorPairs.map((pair) =>
    useLoader(THREE.TextureLoader, `/assets/textures/${pair.texture}`),
  )

  const frontMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const backMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  const colorUniformRef = useRef<THREE.Uniform<THREE.Color>>(new THREE.Uniform(new THREE.Color('#ff6600')))

  // Store the current texture index for persistence when component goes out of view
  const currentTextureIndex = options.textureIndex ?? 0
  const lastTextureIndexRef = useRef<number>(0)

  // Track whether materials have been created
  const materialsCreatedRef = useRef<boolean>(false)

  // Update the stored index when it changes externally
  useEffect(() => {
    lastTextureIndexRef.current = currentTextureIndex
  }, [currentTextureIndex])

  // Configure textures once when loaded
  useEffect(() => {
    if (normalMap && cardFrontTexture && cardBackTextures.every((texture) => texture)) {
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
  }, [normalMap, cardFrontTexture, cardBackTextures])

  const initialColor = useMemo(() => {
    const firstPairColor = textureColorPairs[0]?.color || '#ff6600'
    return new THREE.Color(firstPairColor)
  }, [textureColorPairs])

  useEffect(() => {
    if (colorUniformRef.current) {
      colorUniformRef.current.value.copy(initialColor)
    }
  }, [initialColor])

  const transparentColor = useMemo(() => {
    if (!options.transparentColor) return initialColor
    return options.transparentColor instanceof THREE.Color
      ? options.transparentColor
      : new THREE.Color(options.transparentColor)
  }, [options.transparentColor, initialColor])

  // Create materials only once when textures are loaded
  useEffect(() => {
    if (!normalMap || !cardFrontTexture || cardBackTextures.some((texture) => !texture)) {
      return;
    }

    if (materialsCreatedRef.current) {
      return; // Materials already created
    }

    // Initial color setup
    colorUniformRef.current.value.copy(transparentColor);

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

    const baseMaterialParams = {
      normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      side: THREE.FrontSide,
      transparent: true,
      alphaTest: 0.01,
      alphaToCoverage: true,
      ...CARD_MATERIAL,
    }

    // Create the front material only once
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      ...baseMaterialParams,
      map: cardFrontTexture,
    })
    applyColorShaderModification(frontMaterial)
    frontMaterial.name = 'front-material'
    frontMaterialRef.current = frontMaterial

    // Create the back material only once
    const textureIndex = lastTextureIndexRef.current
    const backMaterial = new THREE.MeshPhysicalMaterial({
      ...baseMaterialParams,
      map: cardBackTextures[textureIndex],
    })
    backMaterial.name = 'back-material'
    backMaterialRef.current = backMaterial

    // Apply initial texture and color
    const currentColor = new THREE.Color(textureColorPairs[textureIndex].color)
    colorUniformRef.current.value.copy(currentColor)
    frontMaterial.needsUpdate = true

    if (backMaterial.map) {
      backMaterial.map.channel = 1
      backMaterial.needsUpdate = true
    }

    materialsCreatedRef.current = true;
  }, [normalMap, cardFrontTexture, cardBackTextures, transparentColor, textureColorPairs]);

  const materials = useMemo<MaterialSet | null>(() => {
    if (!frontMaterialRef.current || !backMaterialRef.current || !cardBackTextures.length) {
      return null;
    }

    return {
      front: frontMaterialRef.current,
      back: backMaterialRef.current,
      backTextures: cardBackTextures,
    }
  }, [cardBackTextures])

  // Update texture and color when texture index changes
  useEffect(() => {
    if (!backMaterialRef.current || !cardBackTextures.length || !colorUniformRef.current) return

    // Keep texture index in bounds (0-7)
    const textureIndex = currentTextureIndex % 8

    // Update back texture
    if (backMaterialRef.current.map) {
      backMaterialRef.current.map = cardBackTextures[textureIndex]
      backMaterialRef.current.map.channel = 1
      backMaterialRef.current.needsUpdate = true
    }

    // Update front color based on corresponding texture
    const newColor = new THREE.Color(textureColorPairs[textureIndex].color)
    colorUniformRef.current.value.copy(newColor)

    if (frontMaterialRef.current) {
      frontMaterialRef.current.needsUpdate = true
    }
  }, [currentTextureIndex, cardBackTextures, textureColorPairs])

  useEffect(() => {
    if (colorUniformRef.current) {
      colorUniformRef.current.value.copy(transparentColor)

      if (frontMaterialRef.current) frontMaterialRef.current.needsUpdate = true
    }
  }, [transparentColor])

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
          }
        }
      }
    })
  }, [materials, sceneRef])

  useEffect(() => {
    return () => {
      if (frontMaterialRef.current) frontMaterialRef.current.dispose()
      if (backMaterialRef.current) backMaterialRef.current.dispose()
    }
  }, [])

  return materials
}

export const createCardColor = (colorString: string): THREE.Color => {
  return new THREE.Color(colorString)
}
