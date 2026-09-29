import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { BufferGeometry, Float32BufferAttribute } from 'three'

interface DataLayerProps {
  compact: boolean
  lightTheme: boolean
  reducedMotion: boolean
}

const CYLINDERS = [
  [-4.7, 1.2, -0.2],
  [-2.9, -1.7, 0.4],
  [-1.1, 1.4, -0.1],
  [1.1, -1.6, 0.3],
  [2.9, 1.3, -0.3],
  [4.7, -1.1, 0.2],
] as const

function makeGridGeometry() {
  const vertices: number[] = []
  for (let index = 0; index <= 12; index += 1) {
    const offset = -6 + index
    vertices.push(offset, 0, -3, offset, 0, 3)
    vertices.push(-6, 0, offset / 2, 6, 0, offset / 2)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  return geometry
}

export const DataLayer = forwardRef<Group, DataLayerProps>(
  function DataLayer({ compact, lightTheme, reducedMotion }, ref) {
    const streams = useRef<Mesh[]>([])
    const streamLines = useMemo(() => {
      const positions: number[] = []
      for (let index = 0; index < CYLINDERS.length - 1; index += 1) {
        const start = CYLINDERS[index]
        const end = CYLINDERS[index + 1]
        positions.push(start[0], start[1], start[2], end[0], end[1], end[2])
      }
      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
      return geometry
    }, [])
    const gridGeometry = useMemo(makeGridGeometry, [])
    const tint = lightTheme ? '#62837d' : '#659b92'

    useEffect(() => () => {
      streamLines.dispose()
      gridGeometry.dispose()
    }, [gridGeometry, streamLines])

    useFrame((state) => {
      streams.current.forEach((stream, index) => {
        const from = CYLINDERS[index % (CYLINDERS.length - 1)]
        const to = CYLINDERS[(index % (CYLINDERS.length - 1)) + 1]
        const progress = reducedMotion ? 0.5 : (state.clock.elapsedTime * 0.16 + index * 0.21) % 1
        stream.position.set(
          from[0] + (to[0] - from[0]) * progress,
          from[1] + (to[1] - from[1]) * progress,
          from[2] + (to[2] - from[2]) * progress,
        )
      })
    })

    return (
      <group ref={ref} position={[0, 0, -6.2]}>
        {[-1.7, 0, 1.7].map((y, index) => (
          <lineSegments
            key={`plane-${index}`}
            geometry={gridGeometry}
            position={[0, y, 0]}
            scale={[1, 0.45, 1]}
          >
            <lineBasicMaterial color={tint} transparent opacity={0.14} />
          </lineSegments>
        ))}
        {CYLINDERS.slice(0, compact ? 5 : CYLINDERS.length).map(([x, y, z], index) => (
          <group key={`database-${index}`} position={[x, y, z]}>
            <mesh>
              <cylinderGeometry args={[0.52, 0.52, 0.9, 20, 1, true]} />
              <meshBasicMaterial color={index % 2 ? tint : '#14b8a6'} transparent opacity={0.22} wireframe />
            </mesh>
            {[-0.45, 0.45].map((height) => (
              <mesh key={height} position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.51, 0.012, 4, 20]} />
                <meshBasicMaterial color="#14b8a6" transparent opacity={0.4} />
              </mesh>
            ))}
          </group>
        ))}
        <lineSegments geometry={streamLines}>
          <lineBasicMaterial color={tint} transparent opacity={0.2} />
        </lineSegments>
        {Array.from({ length: compact ? 4 : 8 }, (_, index) => (
          <mesh
            key={`stream-${index}`}
            ref={(mesh) => { if (mesh) streams.current[index] = mesh }}
          >
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial color="#14b8a6" transparent opacity={0.82} />
          </mesh>
        ))}
      </group>
    )
  },
)
