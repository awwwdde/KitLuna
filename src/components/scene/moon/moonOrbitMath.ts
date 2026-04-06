import * as THREE from 'three'
import {
  MOON_ORBIT_ANGULAR_SPEED,
  MOON_ORBIT_RADIUS_DESKTOP,
  MOON_ORBIT_RADIUS_MOBILE,
} from '@/components/scene/sceneConstants'

const toEarth = new THREE.Vector3()
const uAxis = new THREE.Vector3()
const vAxis = new THREE.Vector3()
const worldUp = new THREE.Vector3(0, 1, 0)

/**
 * Базовая позиция луны по скроллу + небольшое орбитальное смещение вокруг направления к Земле.
 * `out` перезаписывается целиком.
 */
export function computeMoonVisualPosition(
  out: THREE.Vector3,
  moonPosition: THREE.Vector3,
  moonDeep: THREE.Vector3,
  earthPos: THREE.Vector3,
  isMobile: boolean,
  scrollProgress: number,
  elapsedTime: number
): void {
  const t = THREE.MathUtils.smoothstep(scrollProgress, 0.15, 0.9)
  const ease = t * t * (3 - 2 * t)
  out.lerpVectors(moonPosition, moonDeep, ease)

  const orbitEase =
    THREE.MathUtils.smoothstep(scrollProgress, 0.2, 0.55) * 0.28 +
    THREE.MathUtils.smoothstep(scrollProgress, 0.62, 0.97) * 0.72
  const R = (isMobile ? MOON_ORBIT_RADIUS_MOBILE : MOON_ORBIT_RADIUS_DESKTOP) * orbitEase
  const ang = elapsedTime * MOON_ORBIT_ANGULAR_SPEED

  toEarth.copy(earthPos).sub(out)
  if (toEarth.lengthSq() < 1e-8) toEarth.set(1, 0, 0)
  toEarth.normalize()

  uAxis.crossVectors(toEarth, worldUp)
  if (uAxis.lengthSq() < 1e-8) uAxis.set(1, 0, 0).cross(toEarth)
  uAxis.normalize()
  vAxis.crossVectors(uAxis, toEarth).normalize()

  const c = Math.cos(ang)
  const s = Math.sin(ang)
  out.addScaledVector(uAxis, c * R)
  out.addScaledVector(vAxis, s * R)
}
