'use client'

import * as THREE from 'three'
import { useEffect, useMemo } from 'react'
import { createDisposableGeometry } from '@/components/three/utils/threeHelpers'

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
  const curve = useMemo(() => {
    if (!points || points.length < 2) return null
    return new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5)
  }, [points])

  const { geometry: tubeGeometry, dispose } = useMemo(
    () =>
      createDisposableGeometry(() => {
        if (!curve) return null
        return new THREE.TubeGeometry(curve, 64, radius, 8, false)
      }),
    [curve, radius],
  )

  useEffect(() => {
    return () => dispose()
  }, [dispose])

  if (!tubeGeometry) return null

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
