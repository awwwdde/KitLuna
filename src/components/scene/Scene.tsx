import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { SceneContent } from '@/components/scene/SceneContent'
import { CAMERA_BASE, CAMERA_FOV } from '@/components/scene/sceneConstants'

export function Scene() {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1

  return (
    <Canvas
      style={{ width: '100%', height: '100%', display: 'block' }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.88,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{
        position: [CAMERA_BASE.x, CAMERA_BASE.y, CAMERA_BASE.z],
        fov: CAMERA_FOV,
        near: 0.08,
        far: 320,
      }}
      dpr={[1, dpr]}
      frameloop="always"
      shadows={false}
    >
      <SceneContent />
    </Canvas>
  )
}
