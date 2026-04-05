import { memo } from 'react'
import { Stars } from '@react-three/drei'

export const StarsBackground = memo(function StarsBackground() {
  return (
    <group>
      <Stars
        radius={280}
        depth={140}
        count={52000}
        factor={6.5}
        saturation={0.04}
        fade
        speed={0.048}
      />
      {/* Второй слой под углом — плотнее «пояс» как у Млечного Пути */}
      <group rotation={[0.35, -0.85, 0.15]}>
        <Stars
          radius={320}
          depth={160}
          count={28000}
          factor={8}
          saturation={0.025}
          fade
          speed={0.04}
        />
      </group>
    </group>
  )
})
