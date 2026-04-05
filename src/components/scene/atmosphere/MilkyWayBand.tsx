import { memo, useEffect, useMemo } from 'react'
import * as THREE from 'three'

function makeMilkyWayTexture() {
  const w = 1024
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, w, h)

  const g = ctx.createLinearGradient(0, h * 0.5, w, h * 0.5)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(0.25, 'rgba(55,52,48,0.12)')
  g.addColorStop(0.42, 'rgba(140,128,118,0.28)')
  g.addColorStop(0.5, 'rgba(200,188,175,0.42)')
  g.addColorStop(0.58, 'rgba(130,120,110,0.26)')
  g.addColorStop(0.75, 'rgba(45,42,40,0.1)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = 'screen'
  for (let i = 0; i < 4200; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = Math.random() * 1.8
    const a = Math.random() * 0.35
    ctx.fillStyle = `rgba(220,215,205,${a})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

/** Широкая полоса звёздной пыли — мягкое «Млечный путь» на чёрном небе. */
export const MilkyWayBand = memo(function MilkyWayBand() {
  const map = useMemo(() => makeMilkyWayTexture(), [])

  const mat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      map: map ?? undefined,
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    if (!map) m.color.setHex(0x2a2825)
    return m
  }, [map])

  useEffect(() => {
    return () => {
      map?.dispose()
      mat.dispose()
    }
  }, [map, mat])

  return (
    <mesh
      position={[12, 18, -95]}
      rotation={[-0.95, 0.55, 0.35]}
      scale={[240, 90, 1]}
      renderOrder={-9}
      material={mat}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
    </mesh>
  )
})
