import * as THREE from 'three'

export const MOON_POSITION = new THREE.Vector3(2.85, -6.35, 0.15)
export const MOON_RADIUS = 6.8

export const CAMERA_BASE = new THREE.Vector3(0, 0.62, 7.45)
export const CAMERA_FOV = 44
/** Узкий экран: луна целиком в кадре с полями. */
export const MOBILE_CAMERA_FOV = 52
export const CAMERA_LOOK_AT = new THREE.Vector3(0.35, -1.05, 0)

export const KEY_LIGHT_POSITION = new THREE.Vector3(-5.5, 5.2, 16)

/** Сегменты сферы (без displacement — bump + albedo). */
export const MOON_SPHERE_SEGMENTS = 160
