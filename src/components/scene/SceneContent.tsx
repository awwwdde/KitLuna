import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SceneLayoutProvider } from '@/components/scene/SceneLayoutContext'
import { AdaptiveCameraFov } from '@/components/scene/camera/AdaptiveCameraFov'
import { CameraRig } from '@/components/scene/camera/CameraRig'
import { Lights } from '@/components/scene/lights/Lights'
import { Earth } from '@/components/scene/earth/Earth'
import { Moon } from '@/components/scene/moon/Moon'
import { StarsBackground } from '@/components/scene/stars/StarsBackground'
import { Particles } from '@/components/scene/particles/Particles'
import { DistantMotes } from '@/components/scene/particles/DistantMotes'
import { AudioManager } from '@/components/scene/audio/AudioManager'
import { AmbientHaze } from '@/components/scene/atmosphere/AmbientHaze'
import { DeepSpaceBackdrop } from '@/components/scene/atmosphere/DeepSpaceBackdrop'
import { MilkyWayBand } from '@/components/scene/atmosphere/MilkyWayBand'

function FogLayer() {
  const { scene } = useThree()
  useLayoutEffect(() => {
    scene.fog = new THREE.FogExp2(0x020202, 0.0019)
    return () => {
      scene.fog = null
    }
  }, [scene])
  return null
}

function SceneWorld() {
  return (
    <>
      <FogLayer />
      <color attach="background" args={['#000000']} />
      <DeepSpaceBackdrop />
      <MilkyWayBand />
      <AmbientHaze />
      <AdaptiveCameraFov />
      <CameraRig />
      <Lights />
      <StarsBackground />
      <Particles />
      <DistantMotes />
      <Moon />
      <Earth />
      <AudioManager />
    </>
  )
}

export function SceneContent() {
  return (
    <SceneLayoutProvider>
      <SceneWorld />
    </SceneLayoutProvider>
  )
}
