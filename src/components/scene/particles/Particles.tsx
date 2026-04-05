import { memo, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const N = 1100

/** Пыль ближе к луне — мягкое свечение. */
export const Particles = memo(function Particles() {
  const ref = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const u = Math.random()
      const v = Math.random()
      const th = u * Math.PI * 2
      const ph = Math.acos(2 * v - 1)
      const r = 2.2 + Math.random() * 16
      const sp = Math.sin(ph)
      pos[i * 3] = r * sp * Math.cos(th)
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.9
      pos[i * 3 + 2] = r * sp * Math.sin(th)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xa8b8e0,
      size: 0.032,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    return { geometry: geo, material: mat }
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.01
  })

  return <points ref={ref} geometry={geometry} material={material} />
})
