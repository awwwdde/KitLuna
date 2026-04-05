import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneLayout } from '@/components/scene/SceneLayoutContext'
import { CAMERA_FOV, MOBILE_CAMERA_FOV } from '@/components/scene/sceneConstants'

export function AdaptiveCameraFov() {
  const camera = useThree(s => s.camera)
  const { isMobile } = useSceneLayout()

  useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = isMobile ? MOBILE_CAMERA_FOV : CAMERA_FOV
      camera.updateProjectionMatrix()
    }
  }, [camera, isMobile])

  return null
}
