import { memo, useEffect, useMemo } from 'react'
import * as THREE from 'three'

/**
 * Equirectangular 2:1 — на внутренней сфере без рёбер плоскости.
 * Полоса галактики у «экватора» текстуры, полюса чёрные → закрывает весь купол неба.
 */
function makeMilkyWayEquirectTexture() {
  const w = 4096
  const h = 2048
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, w, h)

  const mid = h * 0.5
  const g = ctx.createLinearGradient(0, mid, w, mid)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(0.06, 'rgba(38,36,34,0.06)')
  g.addColorStop(0.2, 'rgba(95,88,80,0.16)')
  g.addColorStop(0.42, 'rgba(165,152,138,0.36)')
  g.addColorStop(0.5, 'rgba(220,208,192,0.48)')
  g.addColorStop(0.58, 'rgba(150,140,128,0.3)')
  g.addColorStop(0.8, 'rgba(52,48,44,0.1)')
  g.addColorStop(0.94, 'rgba(22,20,18,0.03)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = 'screen'
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * w
    const y = mid + (Math.random() - 0.5) * h * 0.42
    const r = Math.random() * 1.2 + 0.12
    const a = Math.random() * 0.26
    ctx.fillStyle = `rgba(230,222,210,${a})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = Math.random() * 0.55 + 0.05
    const a = Math.random() * 0.12
    ctx.fillStyle = `rgba(200,198,220,${a})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  /* Вертикальное затухание к полюсам сферы */
  ctx.globalCompositeOperation = 'destination-in'
  const vg = ctx.createLinearGradient(0, 0, 0, h)
  vg.addColorStop(0, 'rgba(255,255,255,0)')
  vg.addColorStop(0.12, 'rgba(255,255,255,0.35)')
  vg.addColorStop(0.22, 'rgba(255,255,255,1)')
  vg.addColorStop(0.78, 'rgba(255,255,255,1)')
  vg.addColorStop(0.88, 'rgba(255,255,255,0.35)')
  vg.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, w, h)

  /* Стык equirect по U: мягкие края */
  ctx.globalCompositeOperation = 'destination-in'
  const hg = ctx.createLinearGradient(0, 0, w, 0)
  hg.addColorStop(0, 'rgba(255,255,255,0)')
  hg.addColorStop(0.035, 'rgba(255,255,255,1)')
  hg.addColorStop(0.965, 'rgba(255,255,255,1)')
  hg.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = hg
  ctx.fillRect(0, 0, w, h)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.flipY = true
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}

const SKY_RADIUS = 620

/** Млечный Путь на внутренней сфере — без обрезанных рёбер плоскости. */
export const MilkyWayBand = memo(function MilkyWayBand() {
  const map = useMemo(() => makeMilkyWayEquirectTexture(), [])

  const matMain = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      map: map ?? undefined,
      color: 0xffffff,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    })
    if (!map) m.color.setHex(0x2a2825)
    return m
  }, [map])

  const matSoft = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      map: map ?? undefined,
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    })
    if (!map) m.color.setHex(0x2a2825)
    return m
  }, [map])

  useEffect(() => {
    return () => {
      matMain.map = null
      matSoft.map = null
      matMain.dispose()
      matSoft.dispose()
      map?.dispose()
    }
  }, [map, matMain, matSoft])

  return (
    <group renderOrder={-10}>
      <mesh rotation={[0.12, 0.72, 0]} material={matMain}>
        <sphereGeometry args={[SKY_RADIUS, 64, 32]} />
      </mesh>
      <mesh rotation={[0.04, -0.38, 0.08]} material={matSoft}>
        <sphereGeometry args={[SKY_RADIUS * 0.97, 48, 24]} />
      </mesh>
    </group>
  )
})
