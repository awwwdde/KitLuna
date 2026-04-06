import { memo } from 'react'
import { EARTH_RADIUS } from '@/components/scene/sceneConstants'

type Props = { radius?: number }

export const EarthPlaceholder = memo(function EarthPlaceholder({ radius = EARTH_RADIUS }: Props) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial
        color={0x2a4d6e}
        roughness={0.9}
        metalness={0}
        emissive={0x0a1828}
        emissiveIntensity={0.08}
        fog={false}
      />
    </mesh>
  )
})
