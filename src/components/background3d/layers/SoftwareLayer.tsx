import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { CanvasTexture, LinearFilter, Sprite, SpriteMaterial } from 'three'

const GLYPHS = ['{ }', '</>', '=>', ';', '()', '[]', 'const', 'async', 'git', '&&', '01', 'npm']

interface SoftwareLayerProps {
  compact: boolean
  lightTheme: boolean
  reducedMotion: boolean
}

function createGlyphMaterials(lightTheme: boolean) {
  const columns = 4
  const rows = 3
  const cellWidth = 128
  const cellHeight = 64
  const canvas = document.createElement('canvas')
  canvas.width = columns * cellWidth
  canvas.height = rows * cellHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable for the background glyphs.')

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  GLYPHS.forEach((glyph, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    context.font = `${glyph.length > 4 ? '600 22px' : '600 35px'} "SFMono-Regular", Consolas, monospace`
    context.fillStyle = '#ffffff'
    context.fillText(glyph, column * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2)
  })

  const atlas = new CanvasTexture(canvas)
  atlas.minFilter = LinearFilter
  atlas.magFilter = LinearFilter
  atlas.generateMipmaps = false
  const materials = GLYPHS.map((_, index) => {
    const map = atlas.clone()
    const column = index % columns
    const row = Math.floor(index / columns)
    map.repeat.set(1 / columns, 1 / rows)
    map.offset.set(column / columns, 1 - (row + 1) / rows)
    map.minFilter = LinearFilter
    map.magFilter = LinearFilter
    map.generateMipmaps = false
    map.needsUpdate = true
    return new SpriteMaterial({
      map,
      color: lightTheme ? '#557b77' : '#80cfc3',
      transparent: true,
      depthWrite: false,
      opacity: 0.48,
    })
  })
  return { atlas, materials }
}

export const SoftwareLayer = forwardRef<Group, SoftwareLayerProps>(
  function SoftwareLayer({ compact, lightTheme, reducedMotion }, ref) {
    const drift = useRef<Group>(null)
    const spriteCount = compact ? 18 : 32
    const { atlas, materials } = useMemo(() => createGlyphMaterials(lightTheme), [lightTheme])
    const sprites = useMemo(
      () => Array.from({ length: spriteCount }, (_, index) => {
        const sprite = new Sprite(materials[index % materials.length])
        const angle = index * 2.399
        const x = Math.sin(angle) * (3.2 + (index % 5) * 0.88)
        const y = Math.cos(angle * 1.17) * (1.7 + (index % 4) * 0.55)
        const z = ((index % 7) - 3) * 0.43
        const size = GLYPHS[index % GLYPHS.length].length > 4 ? 0.54 : 0.78
        sprite.position.set(x, y, z)
        sprite.scale.set(size, size * 0.64, 1)
        sprite.material.opacity = 0.34 + (index % 4) * 0.08
        return sprite
      }),
      [materials, spriteCount],
    )

    useEffect(() => () => {
      materials.forEach((material: SpriteMaterial) => {
        material.map?.dispose()
        material.dispose()
      })
      atlas.dispose()
    }, [atlas, materials])

    useFrame((state, delta) => {
      if (!drift.current || reducedMotion) return
      drift.current.rotation.y += delta * 0.008
      drift.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.025
    })

    return (
      <group ref={ref} position={[0, 0, -4]}>
        <group ref={drift}>
          {sprites.map((sprite, index) => (
            <primitive key={`glyph-${index}`} object={sprite} />
          ))}
        </group>
      </group>
    )
  },
)
