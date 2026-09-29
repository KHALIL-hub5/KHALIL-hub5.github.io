import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import { log } from 'node:console'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')
const referencePath = path.join(projectRoot, 'references', 'Project showroom – 3D preview.html')
const outputRoot = path.join(projectRoot, 'public', 'projects')
const manifestPath = path.join(projectRoot, 'src', 'data', 'project-screens.generated.json')

const projectDirectories = {
  kh: 'khdamli',
  ml: 'medilink-dz',
  un: 'alias-univent',
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function decodeImage(dataUri) {
  const match = /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUri)
  if (!match) {
    throw new Error('Expected an embedded base64 image data URI.')
  }

  return Buffer.from(match[2], 'base64')
}

function extractShotsDocument(html) {
  const marker = 'var SHOTS = '
  const start = html.indexOf(marker)
  if (start === -1) {
    throw new Error(`Could not find "${marker}" in ${path.relative(projectRoot, referencePath)}.`)
  }

  const jsonStart = start + marker.length
  let depth = 0
  let inString = false
  let escaped = false
  let jsonEnd = -1

  for (let index = jsonStart; index < html.length; index += 1) {
    const character = html[index]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (character === '\\') {
        escaped = true
      } else if (character === '"') {
        inString = false
      }
      continue
    }

    if (character === '"') {
      inString = true
    } else if (character === '{') {
      depth += 1
    } else if (character === '}') {
      depth -= 1
      if (depth === 0) {
        jsonEnd = index + 1
        break
      }
    }
  }

  if (jsonEnd === -1) {
    throw new Error('Could not locate the end of the SHOTS JSON in the reference.')
  }

  return JSON.parse(html.slice(jsonStart, jsonEnd))
}

async function saveWebp(dataUri, destination, maxWidth) {
  const buffer = decodeImage(dataUri)
  await mkdir(path.dirname(destination), { recursive: true })

  const result = await sharp(buffer)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(destination)

  return { width: result.width, height: result.height, bytes: result.size }
}

const html = await readFile(referencePath, 'utf8')
const shots = extractShotsDocument(html)
const manifest = {}
let convertedCount = 0
let convertedBytes = 0

for (const [key, images] of Object.entries(shots)) {
  if (key === 'kh_assets') {
    manifest.khdamliAssets = {}
    for (const [assetName, dataUri] of Object.entries(images)) {
      const relativePath = `${projectDirectories.kh}/${assetName}.webp`
      const result = await saveWebp(dataUri, path.join(outputRoot, relativePath), 1000)
      manifest.khdamliAssets[assetName] = { src: `/projects/${relativePath}`, ...result }
      convertedCount += 1
      convertedBytes += result.bytes
    }
    continue
  }

  const [projectKey, platform] = key.split('_')
  const projectDirectory = projectDirectories[projectKey]
  if (!projectDirectory || !['web', 'mobile'].includes(platform) || !Array.isArray(images)) {
    throw new Error(`Unexpected screenshot group "${key}" in the reference.`)
  }

  manifest[key] = []
  for (const image of images) {
    const relativePath = `${projectDirectory}/${platform}/${slugify(image.name)}.webp`
    const maxWidth = platform === 'mobile' ? 480 : 1000
    const result = await saveWebp(image.src, path.join(outputRoot, relativePath), maxWidth)
    manifest[key].push({
      name: image.name,
      src: `/projects/${relativePath}`,
      width: result.width,
      height: result.height,
    })
    convertedCount += 1
    convertedBytes += result.bytes
  }
}

await writeFile(
  manifestPath,
  `${JSON.stringify(manifest, null, 2)}\n`,
)

log(`Converted ${convertedCount} images to WebP (${(convertedBytes / 1024).toFixed(1)} KiB).`)
