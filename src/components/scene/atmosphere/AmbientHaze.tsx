import { memo, useMemo } from 'react'
import * as THREE from 'three'

/** Лёгкая серая мгла вокруг сцены + дальний слой глубины. */
export const AmbientHaze = memo(function AmbientHaze() {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x141414,
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )
  const matFar = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x0e1018,
        transparent: true,
        opacity: 0.07,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  return (
    <group renderOrder={-6}>
      <mesh material={mat}>
        <sphereGeometry args={[56, 32, 32]} />
      </mesh>
      <mesh material={matFar}>
        <sphereGeometry args={[78, 24, 24]} />
      </mesh>
    </group>
  )
})
