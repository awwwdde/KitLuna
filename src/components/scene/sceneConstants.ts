import * as THREE from 'three'

/** Луна в первой секции (крупный план); по скроллу уходит в MoonPBR в MOON_POSITION_DEEPSPACE*. */
export const MOON_POSITION = new THREE.Vector3(2.85, -6.35, 0.15)
export const MOON_RADIUS = 6.8

/** Финал скролла: луна заметно дальше — контраст с близкой Землёй. */
export const MOON_POSITION_DEEPSPACE = new THREE.Vector3(5.1, -6.5, -28.5)
export const MOON_POSITION_DEEPSPACE_MOBILE = new THREE.Vector3(0, 0, -17)

/**
 * Земля — одна точка в мире (без анимации позиции): при близкой камере часто за спиной/вне кадра,
 * при отъезде камеры и расширении FOV появляется слева снизу; только вращение, как у луны.
 */
export const EARTH_POSITION = new THREE.Vector3(-10.2, -6.75, 15.8)
/**
 * Мобилка: камера в +Z (~17), луна в 0. Z земли > камеры — за спиной, не между глазами и луной.
 */
export const EARTH_POSITION_MOBILE = new THREE.Vector3(-4.6, -2.6, 26.8)
export const EARTH_RADIUS = 8.1
/** Меньший диск на узком экране + та же логика «не перекрывать луну» при старте. */
export const EARTH_RADIUS_MOBILE = 4.75

/** Сегменты сферы Земли (displacement + bump). */
export const EARTH_SPHERE_SEGMENTS = 240

export const CAMERA_BASE = new THREE.Vector3(0, 0.62, 7.45)
export const CAMERA_FOV = 44
/** Узкий экран: луна целиком в кадре с полями. */
export const MOBILE_CAMERA_FOV = 52
export const CAMERA_LOOK_AT = new THREE.Vector3(0.35, -1.05, 0)

export const KEY_LIGHT_POSITION = new THREE.Vector3(-5.5, 5.2, 16)

/** Сегменты сферы луны (только bump, без displacement). */
export const MOON_SPHERE_SEGMENTS = 160

/** Медленное «орбитальное» смещение вокруг Земли; амплитуда в MoonPBR усиливается к концу скролла. */
export const MOON_ORBIT_RADIUS_DESKTOP = 2.45
export const MOON_ORBIT_RADIUS_MOBILE = 1.35
export const MOON_ORBIT_ANGULAR_SPEED = 0.024

/** Доп. отдаление камеры по Z при scrollProgress = 1 (десктоп). */
export const CAMERA_SCROLL_PULL_Z_DESKTOP = 17
/** То же на мобильном layout. */
export const CAMERA_SCROLL_PULL_Z_MOBILE = 12

/** Расширение FOV при полном скролле (градусы). */
export const CAMERA_SCROLL_FOV_EXTRA = 6
