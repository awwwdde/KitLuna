import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { EarthPlaceholder } from '@/components/scene/earth/EarthPlaceholder'
import { useSceneLayout } from '@/components/scene/SceneLayoutContext'
import {
  EARTH_POSITION,
  EARTH_POSITION_MOBILE,
  EARTH_RADIUS,
  EARTH_RADIUS_MOBILE,
  EARTH_SPHERE_SEGMENTS,
} from '@/components/scene/sceneConstants'
import { EARTH_ALBEDO_CANDIDATES, EARTH_HEIGHT_CANDIDATES } from '@/components/scene/texturePaths'

type MapsState = {
  map: THREE.Texture
  height: THREE.Texture
  heightIsDedicated: boolean
}

function loadTexture(loader: THREE.TextureLoader, url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, err => reject(err ?? new Error(url)))
  })
}

async function loadFirstAlbedo(loader: THREE.TextureLoader): Promise<THREE.Texture> {
  let lastErr: unknown
  for (const url of EARTH_ALBEDO_CANDIDATES) {
    try {
      return await loadTexture(loader, url)
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr ?? new Error('Нет доступной карты Земли')
}

async function loadEarthHeight(
  loader: THREE.TextureLoader,
  albedo: THREE.Texture,
  anisotropy: number
): Promise<{ height: THREE.Texture; heightIsDedicated: boolean }> {
  for (const url of EARTH_HEIGHT_CANDIDATES) {
    try {
      const t = await loadTexture(loader, url)
      configureHeightTexture(t, anisotropy)
      return { height: t, heightIsDedicated: true }
    } catch {
      /* next */
    }
  }
  return { height: albedo, heightIsDedicated: false }
}

function configureTexture(t: THREE.Texture, anisotropy: number) {
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = anisotropy
  t.generateMipmaps = true
  t.minFilter = THREE.LinearMipmapLinearFilter
  t.magFilter = THREE.LinearFilter
  t.wrapS = THREE.ClampToEdgeWrapping
  t.wrapT = THREE.ClampToEdgeWrapping
  t.flipY = true
  t.needsUpdate = true
}

function configureHeightTexture(t: THREE.Texture, anisotropy: number) {
  t.colorSpace = THREE.LinearSRGBColorSpace
  t.anisotropy = anisotropy
  t.generateMipmaps = true
  t.minFilter = THREE.LinearMipmapLinearFilter
  t.magFilter = THREE.LinearFilter
  t.wrapS = THREE.ClampToEdgeWrapping
  t.wrapT = THREE.ClampToEdgeWrapping
  t.flipY = true
  t.needsUpdate = true
}

/** Земля: albedo + топология (рельеф), displacement + bump. */
export const Earth = memo(function Earth() {
  const { gl } = useThree()
  const { isMobile } = useSceneLayout()
  const meshRef = useRef<THREE.Mesh>(null)
  const placeholderGroupRef = useRef<THREE.Group>(null)
  const [maps, setMaps] = useState<MapsState | null>(null)
  const [mapFailed, setMapFailed] = useState(false)

  const maxAniso = useMemo(() => gl.capabilities.getMaxAnisotropy?.() ?? 8, [gl])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let cancelled = false

    ;(async () => {
      try {
        const map = await loadFirstAlbedo(loader)
        if (cancelled) {
          map.dispose()
          return
        }
        configureTexture(map, maxAniso)
        const { height, heightIsDedicated } = await loadEarthHeight(loader, map, maxAniso)
        if (cancelled) {
          map.dispose()
          if (heightIsDedicated) height.dispose()
          return
        }
        setMaps({ map, height, heightIsDedicated })
      } catch (err) {
        console.warn('[Earth] textures:', err)
        if (!cancelled) setMapFailed(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [maxAniso])

  const material = useMemo(() => {
    if (!maps) return null
    const { map, height, heightIsDedicated } = maps
    return new THREE.MeshStandardMaterial({
      map,
      color: new THREE.Color(0xffffff),
      roughness: 0.5,
      metalness: 0.06,
      bumpMap: height,
      bumpScale: heightIsDedicated ? 0.42 : 0.36,
      displacementMap: height,
      displacementScale: heightIsDedicated ? 0.125 : 0.06,
      displacementBias: heightIsDedicated ? -0.025 : -0.012,
      emissive: new THREE.Color(0x061020),
      emissiveIntensity: 0.045,
      fog: false,
    })
  }, [maps])

  const earthRadius = isMobile ? EARTH_RADIUS_MOBILE : EARTH_RADIUS

  const pos = useMemo(
    () =>
      (isMobile ? EARTH_POSITION_MOBILE : EARTH_POSITION).toArray() as [
        number,
        number,
        number,
      ],
    [isMobile]
  )

  useFrame((_, delta) => {
    const m = meshRef.current
    if (m) m.rotation.y += 0.0045 * delta
    const pg = placeholderGroupRef.current
    if (pg) pg.rotation.y += 0.0045 * delta
  })

  useEffect(() => {
    return () => {
      material?.dispose()
      if (!maps) return
      maps.map.dispose()
      if (maps.heightIsDedicated) maps.height.dispose()
    }
  }, [material, maps])

  const earthLights = (
    <>
      <pointLight position={[22, 9, 17]} intensity={2.45} distance={120} decay={2} color={0xfff4e6} />
      <pointLight position={[17, 5, 15]} intensity={1.25} distance={105} decay={2} color={0xffe8c8} />
      <pointLight position={[-7, -1, -6]} intensity={0.22} distance={75} decay={2} color={0x6a8ec8} />
      <pointLight position={[4, 16, 11]} intensity={0.55} distance={110} decay={2} color={0xd0e4ff} />
    </>
  )

  if (mapFailed || !material) {
    return (
      <group position={pos}>
        {earthLights}
        <group ref={placeholderGroupRef}>
          <EarthPlaceholder radius={earthRadius} />
        </group>
      </group>
    )
  }

  return (
    <group position={pos}>
      {earthLights}
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[earthRadius, EARTH_SPHERE_SEGMENTS, EARTH_SPHERE_SEGMENTS]} />
      </mesh>
      <mesh scale={1.012} renderOrder={2}>
        <sphereGeometry args={[earthRadius, 72, 72]} />
        <meshBasicMaterial
          color="#5a8ad8"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </mesh>
    </group>
  )
})
