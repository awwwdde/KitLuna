import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { MoonPlaceholder } from '@/components/scene/moon/MoonPlaceholder'
import { useSceneLayout } from '@/components/scene/SceneLayoutContext'
import {
  EARTH_POSITION,
  EARTH_POSITION_MOBILE,
  MOON_POSITION_DEEPSPACE,
  MOON_POSITION_DEEPSPACE_MOBILE,
  MOON_RADIUS,
  MOON_SPHERE_SEGMENTS,
} from '@/components/scene/sceneConstants'
import { computeMoonVisualPosition } from '@/components/scene/moon/moonOrbitMath'
import { MOON_ALBEDO_CANDIDATES } from '@/components/scene/texturePaths'
import { useScrollStore } from '@/store/useScrollStore'

type MapsState = { map: THREE.Texture }

function loadTexture(loader: THREE.TextureLoader, url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, err => reject(err ?? new Error(url)))
  })
}

async function loadFirstAlbedo(loader: THREE.TextureLoader): Promise<THREE.Texture> {
  let lastErr: unknown
  for (const url of MOON_ALBEDO_CANDIDATES) {
    try {
      return await loadTexture(loader, url)
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr ?? new Error('Нет доступного albedo')
}

function configureTexture(t: THREE.Texture, anisotropy: number, srgb: boolean) {
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace
  t.anisotropy = anisotropy
  t.generateMipmaps = true
  t.minFilter = THREE.LinearMipmapLinearFilter
  t.magFilter = THREE.LinearFilter
  t.wrapS = THREE.ClampToEdgeWrapping
  t.wrapT = THREE.ClampToEdgeWrapping
  t.flipY = true
  t.needsUpdate = true
}

/**
 * Луна: без displacement — нет «гор». Лёгкий bump по albedo: мелкие кратеры и шлаковая зернистость.
 */
export const Moon = memo(function Moon() {
  const { gl } = useThree()
  const { moonPosition, isMobile } = useSceneLayout()
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const moonDeep = useMemo(
    () => (isMobile ? MOON_POSITION_DEEPSPACE_MOBILE : MOON_POSITION_DEEPSPACE).clone(),
    [isMobile]
  )
  const earthPos = useMemo(
    () => (isMobile ? EARTH_POSITION_MOBILE : EARTH_POSITION).clone(),
    [isMobile]
  )
  const [maps, setMaps] = useState<MapsState | null>(null)
  const [mapFailed, setMapFailed] = useState(false)

  const maxAniso = useMemo(
    () => gl.capabilities.getMaxAnisotropy?.() ?? 8,
    [gl]
  )

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let cancelled = false

    loadFirstAlbedo(loader)
      .then(map => {
        if (cancelled) {
          map.dispose()
          return
        }
        configureTexture(map, maxAniso, true)
        setMaps({ map })
      })
      .catch(err => {
        console.warn('[Moon] albedo:', err)
        if (!cancelled) setMapFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [maxAniso])

  const material = useMemo(() => {
    if (!maps?.map) return null
    return new THREE.MeshStandardMaterial({
      map: maps.map,
      color: new THREE.Color(0xb8b8c0),
      roughness: 0.99,
      metalness: 0,
      bumpMap: maps.map,
      bumpScale: 0.045,
      emissive: new THREE.Color(0x020305),
      emissiveIntensity: 0.012,
    })
  }, [maps])

  useLayoutEffect(() => {
    const g = groupRef.current
    if (g) g.position.copy(moonPosition)
  }, [moonPosition])

  useFrame((state, delta) => {
    const p = useScrollStore.getState().scrollProgress
    const g = groupRef.current
    if (g) {
      computeMoonVisualPosition(
        g.position,
        moonPosition,
        moonDeep,
        earthPos,
        isMobile,
        p,
        state.clock.elapsedTime
      )
    }

    const m = meshRef.current
    if (m) m.rotation.y += 0.006 * delta
  })

  useEffect(() => {
    return () => {
      material?.dispose()
      maps?.map.dispose()
    }
  }, [material, maps])

  if (mapFailed || !material) {
    return (
      <group ref={groupRef}>
        <MoonPlaceholder />
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[MOON_RADIUS, MOON_SPHERE_SEGMENTS, MOON_SPHERE_SEGMENTS]} />
      </mesh>
      <mesh scale={1.009} renderOrder={2}>
        <sphereGeometry args={[MOON_RADIUS, 80, 80]} />
        <meshBasicMaterial
          color="#7a90c0"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
})
