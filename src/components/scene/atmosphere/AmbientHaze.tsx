import { memo, useMemo } from 'react'
import * as THREE from 'three'

/** Лёгкая серая мгла вокруг сцены. */
export const AmbientHaze = memo(function AmbientHaze() {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x141414,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  return (
    <mesh material={mat} renderOrder={-6}>
      <sphereGeometry args={[56, 32, 32]} />
    </mesh>
  )
})
