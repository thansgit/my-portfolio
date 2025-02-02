'use client'

import { Environment, Lightformer } from "@react-three/drei"

const Background = () => (
  <Environment background blur={0.75}>
    <color attach="background" args={['black']} />
    {/* Left side lightformers */}
    <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
    {/* Right side lightformers */}
    <Lightformer intensity={2} color="white" position={[0, 1, 5]} rotation={[0, 0, -Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, -Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, -Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer intensity={10} color="white" position={[10, 0, 14]} rotation={[0, -Math.PI / 2, -Math.PI / 3]} scale={[100, 10, 1]} />
  </Environment>
)

export default Background
