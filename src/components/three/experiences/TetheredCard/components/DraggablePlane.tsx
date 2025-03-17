import * as THREE from 'three'
import { Billboard } from '@react-three/drei'
import { useDragHandlers, useHoverState } from '../hooks/useControls'

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
  const { hovered, setHovered } = useHoverState(onHover, Boolean(dragged))
  const { handlePointerDown, handlePointerUp, handlePointerCancel } = useDragHandlers(nodeRef, onDrag)

  return (
    <Billboard>
      <mesh
        scale={[size * 0.7, size, 1]}
        position={[0, 0.2, -1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <planeGeometry />
        <meshBasicMaterial visible={debug} side={THREE.DoubleSide} />
      </mesh>
    </Billboard>
  )
}
