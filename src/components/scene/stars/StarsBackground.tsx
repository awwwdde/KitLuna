import { memo } from 'react'
import { Stars } from '@react-three/drei'

export const StarsBackground = memo(function StarsBackground() {
  return (
    <group>
      <Stars
        radius={290}
        depth={150}
        count={52000}
        factor={6.6}
        saturation={0.042}
        fade
        speed={0.048}
      />
      {/* Второй слой под углом — плотнее «пояс» как у Млечного Пути */}
      <group rotation={[0.35, -0.85, 0.15]}>
        <Stars
          radius={320}
          depth={165}
          count={30000}
          factor={8}
          saturation={0.026}
          fade
          speed={0.04}
        />
      </group>
      {/* Дальний мелкий слой — глубина поля */}
      <group rotation={[-0.2, 1.1, 0.08]}>
        <Stars
          radius={400}
          depth={200}
          count={12000}
          factor={3.2}
          saturation={0.02}
          fade
          speed={0.022}
        />
      </group>
    </group>
  )
})
