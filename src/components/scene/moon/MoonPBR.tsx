import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { MoonPlaceholder } from '@/components/scene/moon/MoonPlaceholder'
import { useSceneLayout } from '@/components/scene/SceneLayoutContext'
import { MOON_RADIUS, MOON_SPHERE_SEGMENTS } from '@/components/scene/sceneConstants'
import { MOON_ALBEDO_CANDIDATES } from '@/components/scene/texturePaths'

type MapsState = {
  map: THREE.Texture
}

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
 * Луна NASA LROC (CGI Moon Kit): одна карта для albedo, bump и displacement — без «земных» normal.
 */
export const Moon = memo(function Moon() {
  const { gl } = useThree()
  const { moonPosition } = useSceneLayout()
  const meshRef = useRef<THREE.Mesh>(null)
  const [maps, setMaps] = useState<MapsState | null>(null)
  const [mapFailed, setMapFailed] = useState(false)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let cancelled = false

    loadFirstAlbedo(loader)
      .then(map => {
        if (cancelled) {
          map.dispose()
          return
        }
        setMaps({ map })
      })
      .catch(err => {
        console.warn('[Moon] albedo:', err)
        if (!cancelled) setMapFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const maxAniso = useMemo(
    () => gl.capabilities.getMaxAnisotropy?.() ?? 8,
    [gl]
  )

  useLayoutEffect(() => {
    if (!maps?.map) return
    configureTexture(maps.map, maxAniso, true)
  }, [maps, maxAniso])

  const material = useMemo(() => {
    if (!maps?.map) return null
    return new THREE.MeshStandardMaterial({
      map: maps.map,
      color: new THREE.Color(0xb8b8c0),
      roughness: 0.98,
      metalness: 0,
      bumpMap: maps.map,
      bumpScale: 0.1,
      emissive: new THREE.Color(0x020305),
      emissiveIntensity: 0.012,
    })
  }, [maps])

  useFrame((_, delta) => {
    const m = meshRef.current
    if (m) m.rotation.y += 0.006 * delta
  })

  useEffect(() => {
    return () => {
      material?.dispose()
      maps?.map.dispose()
    }
  }, [material, maps])

  const pos: [number, number, number] = [moonPosition.x, moonPosition.y, moonPosition.z]

  if (mapFailed || !material) {
    return (
      <group position={pos}>
        <MoonPlaceholder />
      </group>
    )
  }

  return (
    <group position={pos}>
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
