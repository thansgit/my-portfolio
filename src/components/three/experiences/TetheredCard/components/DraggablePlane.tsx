import * as THREE from 'three'
import { Billboard } from '@react-three/drei'
import { useDragHandlersWithFaceDetection, useHoverState } from '../hooks/useControls'
import { useCardFaceTracking } from '../hooks/useCardFaceTracking'

interface DraggablePlaneProps {
  nodeRef: React.RefObject<{ translation(): { x: number; y: number; z: number } }>
  dragged: THREE.Vector3 | false
  onHover: (state: boolean) => void
  onDrag: (drag: THREE.Vector3 | false) => void
  onFacingChange?: (isFrontFacing: boolean) => void
  size?: number
}

/**
 * DraggablePlane component
 *
 * Provides an invisible (or debug visible) plane for dragging interactions
 * Larger than the actual model to improve touch interactions on mobile
 */
export const DraggablePlane = ({
  nodeRef,
  dragged,
  onHover,
  onDrag,
  onFacingChange,
  size = 1,
}: DraggablePlaneProps) => {
  const { hovered, setHovered } = useHoverState(onHover, Boolean(dragged))
  const { checkFacing } = useCardFaceTracking({ cardRef: nodeRef as any })
  const { handlePointerDown, handlePointerUp, handlePointerCancel } = useDragHandlersWithFaceDetection(
    nodeRef,
    onDrag,
    checkFacing,
    onFacingChange,
  )

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
        <meshBasicMaterial visible={false} side={THREE.DoubleSide} />
      </mesh>
    </Billboard>
  )
}
