import * as THREE from 'three'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'

interface DraggablePlaneProps {
  nodeRef: React.RefObject<{ translation(): { x: number; y: number; z: number } }>
  dragged: THREE.Vector3 | false
  onHover: (state: boolean) => void
  onDrag: (drag: THREE.Vector3 | false) => void
  size?: number
  debug?: boolean
}

/**
 * DraggablePlane component
 *
 * Provides an invisible (or debug visible) plane for dragging interactions
 * Larger than the actual model to improve touch interactions on mobile
 */
export const DraggablePlane = ({ nodeRef, dragged, onHover, onDrag, size = 1, debug = false }: DraggablePlaneProps) => {
  const vec = new THREE.Vector3()
  const billboardRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Handle cursor appearance based on hover state
  useCursor(hovered, dragged ? 'grabbing' : 'grab')

  // This effect forwards hover state to the parent
  useEffect(() => {
    onHover(hovered)
  }, [hovered, onHover])

  // Make plane always face the camera
  useFrame(({ camera }) => {
    if (billboardRef.current) {
      billboardRef.current.quaternion.copy(camera.quaternion)
    }
  })

  // Handle pointer events
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    if (nodeRef.current) {
      const pos = nodeRef.current.translation()
      vec.set(pos.x, pos.y, pos.z)
      onDrag(new THREE.Vector3().copy(e.point).sub(vec))
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    onDrag(false)
  }

  return (
    <group ref={billboardRef}>
      <mesh
        scale={[size * 0.7, size, 1]}
        position={[0, 0.2, -1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => onDrag(false)}
      >
        <planeGeometry />
        <meshBasicMaterial visible={debug} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
