import { useCallback } from 'react'
import type Lenis from 'lenis'
import { useLenis } from 'lenis/react'
import { useScrollStore } from '@/store/useScrollStore'

/** Синхронизация Lenis → zustand для камеры и UI. */
export function ScrollBridge() {
  const onScroll = useCallback((lenis: Lenis) => {
    useScrollStore.getState().setScrollProgress(lenis.progress)
  }, [])

  useLenis(onScroll, [onScroll])
  return null
}
