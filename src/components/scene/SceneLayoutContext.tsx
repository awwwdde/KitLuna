import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  CAMERA_BASE,
  CAMERA_LOOK_AT,
  MOON_POSITION,
} from '@/components/scene/sceneConstants'

export type SceneLayout = {
  isMobile: boolean
  moonPosition: THREE.Vector3
  cameraBase: THREE.Vector3
  cameraLookAt: THREE.Vector3
}

const defaultLayout: SceneLayout = {
  isMobile: false,
  moonPosition: MOON_POSITION.clone(),
  cameraBase: CAMERA_BASE.clone(),
  cameraLookAt: CAMERA_LOOK_AT.clone(),
}

const SceneLayoutContext = createContext<SceneLayout>(defaultLayout)

const MOBILE_BREAKPOINT_PX = 640

function buildLayout(isMobile: boolean): SceneLayout {
  if (!isMobile) {
    return {
      isMobile,
      moonPosition: MOON_POSITION.clone(),
      cameraBase: CAMERA_BASE.clone(),
      cameraLookAt: CAMERA_LOOK_AT.clone(),
    }
  }
  /* Луна в центре мира; камера дальше + больший FOV (AdaptiveCameraFov) — диск целиком с полями. */
  return {
    isMobile,
    moonPosition: new THREE.Vector3(0, 0, 0),
    cameraBase: new THREE.Vector3(0, 0, 17.2),
    cameraLookAt: new THREE.Vector3(0, 0, 0),
  }
}

export function SceneLayoutProvider({ children }: { children: ReactNode }) {
  const width = useThree(s => s.size.width)
  const isMobile = width < MOBILE_BREAKPOINT_PX
  const layout = useMemo(() => buildLayout(isMobile), [isMobile])
  return <SceneLayoutContext.Provider value={layout}>{children}</SceneLayoutContext.Provider>
}

export function useSceneLayout() {
  return useContext(SceneLayoutContext)
}
