import { memo } from 'react'
import { MOON_RADIUS } from '@/components/scene/sceneConstants'

export const MoonPlaceholder = memo(function MoonPlaceholder() {
  return (
    <mesh>
      <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
      <meshStandardMaterial color={0x8a8d96} roughness={0.88} metalness={0} emissive={0x303038} emissiveIntensity={0.15} />
    </mesh>
  )
})
