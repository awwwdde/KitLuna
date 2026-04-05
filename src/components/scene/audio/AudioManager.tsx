import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAudioStore } from '@/store/useAudioStore'

const AMBIENT_URLS = ['/audio/space-ambient.mp3', '/audio/ambient.mp3'] as const
const TARGET_VOLUME = 0.22

function loadBuffer(loader: THREE.AudioLoader, url: string): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, err => reject(err ?? new Error(String(url))))
  })
}

/** Космический дрон: низ + лёгкая «ионосфера», плавный fade для loop. */
function makeSpaceDroneBuffer(ctx: AudioContext): AudioBuffer {
  const seconds = 18
  const rate = ctx.sampleRate
  const frames = Math.floor(rate * seconds)
  const buffer = ctx.createBuffer(2, frames, rate)

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch)
    let lp1 = 0
    let lp2 = 0
    let hp = 0
    for (let i = 0; i < frames; i++) {
      const t = i / rate
      const w = Math.random() * 2 - 1
      lp1 = lp1 * 0.997 + w * 0.003
      const rumble = Math.sin(t * 2.1 + ch * 0.4) * 0.04 + Math.sin(t * 0.37) * 0.06
      lp2 = lp2 * 0.994 + w * 0.006
      const hiss = lp2 * 0.045
      hp = hp * 0.88 + (w - hp) * 0.12
      data[i] = lp1 * 0.09 + rumble * 0.35 + hiss + hp * 0.02
    }
    const edge = Math.floor(rate * 0.5)
    for (let i = 0; i < edge; i++) {
      const f = i / edge
      data[i] *= f
      data[frames - 1 - i] *= f
    }
  }
  return buffer
}

/**
 * Амбиент через THREE.Audio + AudioListener на камере.
 * Старт после `unlock()`; вкл/выкл — `soundOn` в store.
 */
export function AudioManager() {
  const { camera } = useThree()
  const soundRef = useRef<THREE.Audio | null>(null)
  const unlocked = useAudioStore(s => s.unlocked)
  const soundOn = useAudioStore(s => s.soundOn)
  const setPlaying = useAudioStore(s => s.setPlaying)

  useEffect(() => {
    const listener = new THREE.AudioListener()
    camera.add(listener)

    const sound = new THREE.Audio(listener)
    soundRef.current = sound

    const ctx = listener.context as AudioContext
    let cancelled = false

    const finishSetup = (buf: AudioBuffer) => {
      if (cancelled) return
      sound.setBuffer(buf)
      sound.setLoop(true)
      sound.setVolume(TARGET_VOLUME)
      sound.setDetune(-65)
    }

    const loader = new THREE.AudioLoader()
    ;(async () => {
      let buf: AudioBuffer | null = null
      for (const url of AMBIENT_URLS) {
        if (cancelled) return
        try {
          buf = await loadBuffer(loader, url)
          break
        } catch {
          /* try next */
        }
      }
      if (cancelled) return
      finishSetup(buf ?? makeSpaceDroneBuffer(ctx))
    })()

    return () => {
      cancelled = true
      sound.stop()
      camera.remove(listener)
      soundRef.current = null
    }
  }, [camera])

  useEffect(() => {
    if (!unlocked) return
    const sound = soundRef.current
    if (!sound) return

    let raf = 0
    let alive = true

    const apply = () => {
      if (!alive) return
      if (!sound.buffer) {
        raf = requestAnimationFrame(apply)
        return
      }
      const ctx = sound.context as AudioContext
      void ctx.resume().then(() => {
        if (!alive) return
        if (soundOn) {
          if (!sound.isPlaying) {
            sound.setVolume(TARGET_VOLUME)
            sound.play()
            setPlaying(true)
          }
        } else {
          if (sound.isPlaying) sound.stop()
          setPlaying(false)
        }
      })
    }

    apply()
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [unlocked, soundOn, setPlaying])

  return null
}
