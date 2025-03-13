'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const ShaderBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const { size } = useThree()

  // Luo shader-materiaali Worley-noise shaderilla
  const material = useRef(
    new THREE.ShaderMaterial({
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
            // Konvertoi vUv koordinaatit fragCoord-arvoiksi
            vec2 fragCoord = vUv * iResolution;
            
            //Calculate an intensity
            float t = fworley(fragCoord / 1500.0);
            //Add some gradient
            t *= exp(-length2(abs(0.7*vUv - 1.0)));	
            //Make it blue!
            gl_FragColor = vec4(t * vec3(0.1, 1.1*t, pow(t, 0.5-t)), 1.0);
        }
      `,
      transparent: false, // Tämä on kriittinen asetus - ei läpinäkyvä tausta
      depthWrite: false, // Ei kirjoita syvyyspuskuriin
      depthTest: false, // Ei tee syvyystestausta
      side: THREE.DoubleSide, // Renderöi molemmilta puolilta
      blending: THREE.NormalBlending, // Tärkeä läpinäkyvyyden kannalta
    }),
  )

  // Päivitä resoluutio kun ikkunan koko muuttuu
  useEffect(() => {
    material.current.uniforms.iResolution.value.set(size.width, size.height)
  }, [size])

  // Päivitä aika-uniform joka framessa
  useFrame((_, delta) => {
    timeRef.current += delta
    material.current.uniforms.iTime.value = timeRef.current
  })

  // Aseta meshin sijainti ja renderöintijärjestys
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.z = -100
      meshRef.current.renderOrder = -20000 // Erittäin alhainen renderOrder, jotta tausta on aina takimmaisena
    }
  }, [])

  return (
    <mesh ref={meshRef} frustumCulled={false} position={[0, 0, -100]} renderOrder={-20000}>
      <planeGeometry args={[1000, 1000]} />
      <primitive object={material.current} attach='material' />
    </mesh>
  )
}
