function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  if (base === '/') return path.startsWith('/') ? path : `/${path}`
  const b = base.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

/**
 * NASA Scientific Visualization Studio — CGI Moon Kit (LROC WAC natural color).
 * https://svs.gsfc.nasa.gov/4720/ — public domain, credit NASA SVS.
 *
 * `moon_nasa_lroc_4k.jpg` — из `pnpm run fetch-moon-4k` (TIFF 4096×2048 → JPEG).
 * `moon_nasa_lroc_2k.jpg` — официальный JPEG 2048×1024 с того же сайта.
 */
export const MOON_ALBEDO_CANDIDATES = [
  publicUrl('/textures/planets/moon_nasa_lroc_4k.jpg'),
  publicUrl('/textures/planets/moon_nasa_lroc_2k.jpg'),
  publicUrl('/textures/planets/moon_8192.jpg'),
  publicUrl('/textures/planets/moon_4096.jpg'),
  publicUrl('/textures/planets/moon_2048.jpg'),
  publicUrl('/textures/planets/moon_1024.jpg'),
] as const

/** Земля: локальный файл или fallback (текстура из примеров three.js). */
export const EARTH_ALBEDO_CANDIDATES = [
  publicUrl('/textures/planets/earth_2k.jpg'),
  'https://raw.githubusercontent.com/mrdoob/three.js/r168/examples/textures/planets/earth_atmos_2048.jpg',
] as const

/**
 * Карта рельефа / топология (grayscale, linear) — bump + displacement.
 * three-globe: earth-topology.png (рельеф суши/дна).
 */
export const EARTH_HEIGHT_CANDIDATES = [
  publicUrl('/textures/planets/earth_topology.png'),
  publicUrl('/textures/planets/earth_bump.jpg'),
  'https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-topology.png',
] as const
