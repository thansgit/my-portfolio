'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const ShaderBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const { size } = useThree()

  // Create the shader material with explicit uniforms
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
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
      varying vec2 vUv;

      //Calculate the squared length of a vector
      float length2(vec2 p){
          return dot(p,p);
      }

      //Generate some noise to scatter points.
      float noise(vec2 p){
          return fract(sin(fract(sin(p.x) * (43.13311)) + p.y) * 31.0011);
      }

      float worley(vec2 p) {
          //Set our distance to infinity
          float d = 1e30;
          //For the 9 surrounding grid points
          for (int xo = -1; xo <= 1; ++xo) {
              for (int yo = -1; yo <= 1; ++yo) {
                  //Floor our vec2 and add an offset to create our point
                  vec2 tp = floor(p) + vec2(xo, yo);
                  //Calculate the minimum distance for this grid point
                  //Mix in the noise value too!
                  d = min(d, length2(p - tp - noise(tp)));
              }
          }
          return 3.0*exp(-4.0*abs(2.5*d - 1.0));
      }

      float fworley(vec2 p) {
          //Stack noise layers 
          return sqrt(sqrt(sqrt(
              worley(p*5.0 + 0.05*iTime) *
              sqrt(worley(p * 50.0 + 0.12 + -0.1*iTime)) *
              sqrt(sqrt(worley(p * -10.0 + 0.03*iTime))))));
      }
            
      void main() {
          // Convert vUv to fragCoord (pixel coordinates)
          vec2 fragCoord = vUv * iResolution;
          
          //Calculate an intensity
          float t = fworley(fragCoord / 1500.0);
          
          //Add some gradient
          t *= exp(-length2(abs(0.7*vUv - 1.0)));
          
          //Make it blue!
          gl_FragColor = vec4(t * vec3(0.1, 1.1*t, pow(t, 0.5-t)), 1.0);
      }
    `,
    transparent: true,
  })

  useEffect(() => {
    shaderMaterial.uniforms.iResolution.value.set(size.width, size.height)
  }, [size, shaderMaterial.uniforms])

  useFrame((_, delta) => {
    timeRef.current += delta
    shaderMaterial.uniforms.iTime.value = timeRef.current
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} renderOrder={-2000}>
      <planeGeometry args={[100, 100]} />
      <primitive object={shaderMaterial} attach='material' />
    </mesh>
  )
}
