'use client'

import * as THREE from 'three'
import { useRef, useEffect, useMemo } from 'react'

interface RopeMeshProps {
  points: THREE.Vector3[]
  color?: string
  radius?: number
}

/**
 * RopeMesh component
 *
 * Creates a smooth tube geometry connecting a series of points
 * Features automatic geometry and material cleanup
 */
export const RopeMesh = ({ points, color = '#000000', radius = 0.03 }: RopeMeshProps) => {
  // Refs to manage disposal
  const tubeGeometryRef = useRef<THREE.TubeGeometry | null>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null)

  // Create the curve from the points
  const curve = useMemo(() => {
    // Need at least 2 points to create a curve
    if (!points || points.length < 2) {
      return null
    }
    return new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5)
  }, [points])

  // Create the tube geometry
  const tubeGeometry = useMemo(() => {
    if (!curve) return null

    // Clean up previous geometry
    if (tubeGeometryRef.current) {
      tubeGeometryRef.current.dispose()
    }

    const newGeometry = new THREE.TubeGeometry(curve, 64, radius, 8, false)
    tubeGeometryRef.current = newGeometry
    return newGeometry
  }, [curve, radius])

  // Create material
  const material = useMemo(() => {
    // Clean up previous material
    if (materialRef.current) {
      materialRef.current.dispose()
    }

    const newMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1,
    })

    materialRef.current = newMaterial
    return newMaterial
  }, [color])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tubeGeometryRef.current) {
        tubeGeometryRef.current.dispose()
        tubeGeometryRef.current = null
      }

      if (materialRef.current) {
        materialRef.current.dispose()
        materialRef.current = null
      }
    }
  }, [])

  // Don't render if no valid geometry
  if (!tubeGeometry) return null

  return <mesh geometry={tubeGeometry} material={material} />
}
