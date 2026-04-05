import { memo, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const N = 800

/** Второй слой — дальние искры, теплее. */
export const DistantMotes = memo(function DistantMotes() {
  const ref = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const u = Math.random()
      const v = Math.random()
      const th = u * Math.PI * 2
      const ph = Math.acos(2 * v - 1)
      const r = 18 + Math.random() * 55
      const sp = Math.sin(ph)
      pos[i * 3] = r * sp * Math.cos(th)
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.55
      pos[i * 3 + 2] = r * sp * Math.sin(th)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xc4b8a8,
      size: 0.045,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    return { geometry: geo, material: mat }
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = -clock.elapsedTime * 0.006
  })

  return <points ref={ref} geometry={geometry} material={material} renderOrder={-2} />
})
