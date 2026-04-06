import { useFrame } from '@react-three/fiber'
import { memo, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneLayout } from '@/components/scene/SceneLayoutContext'
import {
  EARTH_POSITION,
  EARTH_POSITION_MOBILE,
  KEY_LIGHT_POSITION,
  MOON_POSITION_DEEPSPACE,
  MOON_POSITION_DEEPSPACE_MOBILE,
} from '@/components/scene/sceneConstants'
import { computeMoonVisualPosition } from '@/components/scene/moon/moonOrbitMath'
import { useScrollStore } from '@/store/useScrollStore'

/**
 * Ключ смотрит на центр луны (target), fill только слегка подсвечивает тень — контраст как у реального тела.
 * Target двигается вместе с луной, когда она уходит вглубь по скроллу.
 */
export const Lights = memo(function Lights() {
  const { moonPosition, isMobile } = useSceneLayout()
  const moonDeep = useMemo(
    () => (isMobile ? MOON_POSITION_DEEPSPACE_MOBILE : MOON_POSITION_DEEPSPACE).clone(),
    [isMobile]
  )
  const keyTargetRef = useRef<THREE.Object3D>(null)
  const fillTargetRef = useRef<THREE.Object3D>(null)
  const earthTargetRef = useRef<THREE.Object3D>(null)
  const tmp = useRef(new THREE.Vector3())

  const earthCenter = useMemo(
    () => (isMobile ? EARTH_POSITION_MOBILE : EARTH_POSITION).clone(),
    [isMobile]
  )

  const earthSunPosition = useMemo(() => {
    const off = isMobile ? new THREE.Vector3(11, 9, 10) : new THREE.Vector3(30, 20, 26)
    return earthCenter.clone().add(off).toArray() as [number, number, number]
  }, [isMobile, earthCenter])

  useLayoutEffect(() => {
    keyTargetRef.current?.position.copy(moonPosition)
    fillTargetRef.current?.position.copy(moonPosition)
    earthTargetRef.current?.position.copy(earthCenter)
  }, [moonPosition, earthCenter])

  useFrame(({ clock }) => {
    const p = useScrollStore.getState().scrollProgress
    computeMoonVisualPosition(
      tmp.current,
      moonPosition,
      moonDeep,
      earthCenter,
      isMobile,
      p,
      clock.elapsedTime
    )
    keyTargetRef.current?.position.copy(tmp.current)
    fillTargetRef.current?.position.copy(tmp.current)
  })

  return (
    <>
      <ambientLight intensity={0.17} color={0x1c2438} />
      <hemisphereLight color={0x6f8298} groundColor={0x0a0810} intensity={0.42} />

      {/* Луна: основной ключ + холодный fill */}
      <directionalLight position={KEY_LIGHT_POSITION.toArray()} intensity={3.85} color={0xe8dcc8}>
        <object3D ref={keyTargetRef} attach="target" />
      </directionalLight>

      <directionalLight position={[-6, -1.5, -4]} intensity={0.26} color={0x5a78c8}>
        <object3D ref={fillTargetRef} attach="target" />
      </directionalLight>

      {/* Земля: отдельный «солнечный» ключ с той стороны, откуда смотрит камера — диск не в полной тени */}
      <directionalLight position={earthSunPosition} intensity={3.1} color={0xfff3e4}>
        <object3D ref={earthTargetRef} attach="target" />
      </directionalLight>

      <pointLight position={[0.5, 1.5, 7]} intensity={0.14} distance={44} decay={2} color={0xc8d4f0} />
    </>
  )
})
