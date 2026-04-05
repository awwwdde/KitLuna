import { memo } from 'react'
import { useSceneLayout } from '@/components/scene/SceneLayoutContext'
import { KEY_LIGHT_POSITION } from '@/components/scene/sceneConstants'

/**
 * Ключ смотрит на центр луны (target), fill только слегка подсвечивает тень — контраст как у реального тела.
 */
export const Lights = memo(function Lights() {
  const { moonPosition } = useSceneLayout()
  const t = moonPosition.toArray()

  return (
    <>
      <ambientLight intensity={0.14} color={0x1a2238} />
      <hemisphereLight color={0x6a7a94} groundColor={0x08060a} intensity={0.38} />

      <directionalLight position={KEY_LIGHT_POSITION.toArray()} intensity={4.2} color={0xe8dcc8}>
        <object3D attach="target" position={t} />
      </directionalLight>

      <directionalLight position={[-6, -1.5, -4]} intensity={0.22} color={0x5a78c8}>
        <object3D attach="target" position={t} />
      </directionalLight>

      <pointLight position={[0.5, 1.5, 7]} intensity={0.12} distance={40} decay={2} color={0xc8d4f0} />
    </>
  )
})
