import { Lenis } from 'lenis/react'
import { Scene } from '@/components/scene/Scene'
import { ScrollBridge } from '@/components/layout/ScrollBridge'
import { ImmersiveOverlays } from '@/components/ui/ImmersiveOverlays'
import { StorySections } from '@/components/sections/StorySections'
import { Header } from '@/ui/shell/Header'
import styles from './App.module.css'

export default function App() {
  return (
    <Lenis
      className="h-[100dvh] max-h-[100dvh] w-full overflow-y-auto overscroll-y-contain"
      options={{
        lerp: 0.052,
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: true,
        syncTouchLerp: 0.055,
        touchMultiplier: 1,
        touchInertiaExponent: 1.35,
      }}
    >
      <ScrollBridge />
      <div className={styles.app}>
        <div className={styles.canvasLayer}>
          <Scene />
        </div>
        <ImmersiveOverlays />
        <StorySections />
        <Header />
      </div>
    </Lenis>
  )
}
