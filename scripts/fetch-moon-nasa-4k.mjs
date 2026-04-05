/**
 * Скачивает NASA CGI Moon Kit — LROC color 4096×2048 (TIFF) и сохраняет как JPEG.
 * Источник: https://svs.gsfc.nasa.gov/4720/ (public domain, credit NASA SVS)
 *
 * Запуск: pnpm run fetch-moon-4k
 */
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outPath = path.join(root, 'public', 'textures', 'planets', 'moon_nasa_lroc_4k.jpg')

const TIFF_URL =
  'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_16bit_srgb_4k.tif'

function follow(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = new URL(res.headers.location, url).href
          res.resume()
          follow(next).then(resolve).catch(reject)
          return
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }
        const chunks = []
        res.on('data', c => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
        res.on('error', reject)
      })
      .on('error', reject)
  })
}

console.log('Скачивание NASA LROC 4K TIFF (~59 MB)...')
const buf = await follow(TIFF_URL)
console.log('Конвертация в JPEG 4K...')
await sharp(buf)
  .jpeg({ quality: 93, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(outPath)
console.log('Готово:', outPath)
