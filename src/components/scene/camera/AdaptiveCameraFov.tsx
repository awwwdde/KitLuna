import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useSceneLayout } from '@/components/scene/SceneLayoutContext'
import {
  CAMERA_FOV,
  CAMERA_SCROLL_FOV_EXTRA,
  MOBILE_CAMERA_FOV,
} from '@/components/scene/sceneConstants'
import { useScrollStore } from '@/store/useScrollStore'

export function AdaptiveCameraFov() {
  const camera = useThree(s => s.camera)
  const { isMobile } = useSceneLayout()
  const baseFov = useRef(isMobile ? MOBILE_CAMERA_FOV : CAMERA_FOV)

  useLayoutEffect(() => {
    baseFov.current = isMobile ? MOBILE_CAMERA_FOV : CAMERA_FOV
  }, [isMobile])

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    const p = useScrollStore.getState().scrollProgress
    camera.fov = baseFov.current + p * CAMERA_SCROLL_FOV_EXTRA
    camera.updateProjectionMatrix()
  })

  return null
}
