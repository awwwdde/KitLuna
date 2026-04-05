import { Scene } from '@/components/scene/Scene'
import { GlassPanel } from '@/ui/GlassPanel'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.canvasLayer}>
        <Scene />
      </div>
      <GlassPanel />
    </div>
  )
}
