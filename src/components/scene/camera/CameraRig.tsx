import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { useSceneLayout } from '@/components/scene/SceneLayoutContext'
import {
  CAMERA_SCROLL_PULL_Z_DESKTOP,
  CAMERA_SCROLL_PULL_Z_MOBILE,
} from '@/components/scene/sceneConstants'
import { useScrollStore } from '@/store/useScrollStore'

/** Меньше дрейфа при крупном плане — кадр стабильнее. */
const DRIFT = { x: 0.05, y: 0.035, z: 0.045 }

/**
 * Камера отделена от мешей: крупный план луны + лёгкий дрейф.
 */
export function CameraRig() {
  const { camera } = useThree()
  const { cameraBase, cameraLookAt, isMobile } = useSceneLayout()
  const phase = useRef(Math.random() * Math.PI * 2)

  const smooth = useRef(cameraBase.clone())
  const lookSmooth = useRef(cameraLookAt.clone())

  useLayoutEffect(() => {
    smooth.current.copy(cameraBase)
    lookSmooth.current.copy(cameraLookAt)
  }, [isMobile, cameraBase, cameraLookAt])

  useFrame((state, dt) => {
    const driftMul = isMobile ? 0.22 : 1
    const t = state.clock.elapsedTime + phase.current
    const ax = Math.sin(t * 0.048) * DRIFT.x * driftMul
    const ay = Math.sin(t * 0.032) * DRIFT.y * driftMul
    const az = Math.cos(t * 0.041) * DRIFT.z * driftMul

    const pull = useScrollStore.getState().scrollProgress
    const pullZ = pull * (isMobile ? CAMERA_SCROLL_PULL_Z_MOBILE : CAMERA_SCROLL_PULL_Z_DESKTOP)

    const tx = cameraBase.x + ax
    const ty = cameraBase.y + ay
    const tz = cameraBase.z + az + pullZ

    const k = 1 - Math.exp(-2.6 * dt)
    const s = smooth.current
    const l = lookSmooth.current
    s.x += (tx - s.x) * k
    s.y += (ty - s.y) * k
    s.z += (tz - s.z) * k

    l.x += (cameraLookAt.x - l.x) * k
    l.y += (cameraLookAt.y - l.y) * k
    l.z += (cameraLookAt.z - l.z) * k

    camera.position.copy(s)
    camera.lookAt(l)
  })

  return null
}
