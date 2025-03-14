'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const ShaderBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const cameraRef = useRef<THREE.Camera | null>(null)
  const { size } = useThree()

  // Luo shader-materiaali Worley-noise shaderilla
  const material = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iAspect: { value: size.width / size.height },
        iScale: { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        uniform float iAspect;
        uniform float iScale;
        varying vec2 vUv;
        
        /* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
        vec3 random3(vec3 c) {
          float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
          vec3 r;
          r.z = fract(512.0*j);
          j *= .125;
          r.x = fract(512.0*j);
          j *= .125;
          r.y = fract(512.0*j);
          return r-0.5;
        }
        
        /* skew constants for 3d simplex functions */
        const float F3 =  0.3333333;
        const float G3 =  0.1666667;
        
        /* 3d simplex noise */
        float simplex3d(vec3 p) {
          /* 1. find current tetrahedron T and it's four vertices */
          /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
          /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/  
          /* calculate s and x */
          vec3 s = floor(p + dot(p, vec3(F3)));
          vec3 x = p - s + dot(s, vec3(G3));
          
          /* calculate i1 and i2 */
          vec3 e = step(vec3(0.0), x - x.yzx);
          vec3 i1 = e*(1.0 - e.zxy);
          vec3 i2 = 1.0 - e.zxy*(1.0 - e);
            
          /* x1, x2, x3 */
          vec3 x1 = x - i1 + G3;
          vec3 x2 = x - i2 + 2.0*G3;
          vec3 x3 = x - 1.0 + 3.0*G3;
          
          /* 2. find four surflets and store them in d */
          vec4 w, d;
          
          /* calculate surflet weights */
          w.x = dot(x, x);
          w.y = dot(x1, x1);
          w.z = dot(x2, x2);
          w.w = dot(x3, x3);
          
          /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
          w = max(0.6 - w, 0.0);
          
          /* calculate surflet components */
          d.x = dot(random3(s), x);
          d.y = dot(random3(s + i1), x1);
          d.z = dot(random3(s + i2), x2);
          d.w = dot(random3(s + 1.0), x3);
          
          /* multiply d by w^4 */
          w *= w;
          w *= w;
          d *= w;
          
          /* 3. return the sum of the four surflets */
          return dot(d, vec4(52.0));
        }
        
        void main() {
          vec2 uv = vUv * iScale;
          vec2 p = uv * iResolution.xy / iResolution.x;
          vec3 p3 = vec3(p, iTime*0.015) + vec3(iTime*0.015, 0.0, 0.0);
          
          float value = pow(abs(simplex3d(p3*2.0)), 1.5);
          float red = 0.5 + 0.5*simplex3d(p3*2.0 + 38274.9);
          float green = abs(0.2+0.5*simplex3d(p3*2.0 + 3824.9));
          float blue = abs(simplex3d(p3*2.0 + 98274.9));
          
          gl_FragColor = vec4(sqrt(value*vec3(red, green, blue)), 1.0);
        }
      `,
      // transparent: false,
      depthWrite: false,
      // depthTest: false,
      // side: THREE.DoubleSide,
      // blending: THREE.NormalBlending,
    }),
  )

  // Päivitä resoluutio kun ikkunan koko muuttuu
  useEffect(() => {
    material.current.uniforms.iResolution.value.set(size.width, size.height)
    material.current.uniforms.iAspect.value = size.width / size.height

    // Aseta sopiva skaalaus näytön koon mukaan
    // material.current.uniforms.iScale.value = 1

    // Päivitä myös meshin koko vastaamaan näyttöä
    if (meshRef.current) {
      updateMeshSize()
    }
  }, [size])

  // Päivitä aika-uniform joka framessa
  useFrame((state, delta) => {
    timeRef.current += delta
    material.current.uniforms.iTime.value = timeRef.current

    if (!cameraRef.current && state.camera) {
      cameraRef.current = state.camera
      updateMeshSize()
    }
  })

  // Laske kameran näkökenttään sopiva meshin koko
  const updateMeshSize = () => {
    if (!meshRef.current || !cameraRef.current) return

    const camera = cameraRef.current as any

    // Määritä etäisyys kamerasta
    const distanceFromCamera = meshRef.current.position.distanceTo(camera.position)

    // Oletuskameran fov on 75 astetta
    let fov = 75

    // Tarkista onko kamera PerspectiveCamera
    if (camera && camera.isPerspectiveCamera) {
      fov = camera.fov
    }

    const aspect = size.width / size.height

    // Laske tason koko, joka täyttää koko näytön kyseisellä etäisyydellä
    const vFov = (fov * Math.PI) / 180 // Muunna radiaaneiksi
    const height = 2 * distanceFromCamera * Math.tan(vFov / 2)
    const width = height * aspect

    // Päivitä geometria
    meshRef.current.scale.set(width, height, 1)
  }

  // Aseta meshin renderöintijärjestys
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.renderOrder = -20000 // Erittäin alhainen renderOrder, jotta tausta on aina takimmaisena
    }
  }, [])

  return (
    <mesh ref={meshRef} frustumCulled={false} renderOrder={-20000}>
      <planeGeometry args={[1, 1]} /> {/* Käytämme scale-arvoa geometrian sijaan */}
      <primitive object={material.current} attach='material' />
    </mesh>
  )
}
