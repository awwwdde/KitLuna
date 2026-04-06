import { memo, useMemo } from 'react'
import * as THREE from 'three'

/** Два слоя нейтральной мглы — чёрно-серый туман без синевы. */
export const DeepSpaceBackdrop = memo(function DeepSpaceBackdrop() {
  const outer = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x0c0c0c,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )
  const inner = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x080808,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )
  const mid = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x0a0a0c,
        transparent: true,
        opacity: 0.09,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  return (
    <group renderOrder={-8}>
      <mesh material={outer}>
        <sphereGeometry args={[120, 32, 32]} />
      </mesh>
      <mesh material={mid}>
        <sphereGeometry args={[96, 28, 28]} />
      </mesh>
      <mesh material={inner}>
        <sphereGeometry args={[72, 24, 24]} />
      </mesh>
    </group>
  )
})
