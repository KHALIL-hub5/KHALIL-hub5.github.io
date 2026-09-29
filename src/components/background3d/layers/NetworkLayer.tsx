import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { BufferGeometry, Float32BufferAttribute } from 'three'

interface NetworkLayerProps {
  compact: boolean
  lightTheme: boolean
  reducedMotion: boolean
  failover: number
}

interface Edge {
  from: number
  to: number
}

interface NetworkNode {
  x: number
  y: number
  z: number
}

function createNetwork(count: number) {
  const columns = count > 40 ? 8 : 7
  const rows = Math.ceil(count / columns)
  const nodes: NetworkNode[] = Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    return {
      x: (column - (columns - 1) / 2) * 1.75,
      y: ((rows - 1) / 2 - row) * 1.35,
      z: Math.sin(index * 1.71) * 0.38,
    }
  })
  const edgeKeys = new Set<string>()
  const edges: Edge[] = []
  const addEdge = (from: number, to: number) => {
    const start = Math.min(from, to)
    const end = Math.max(from, to)
    const key = `${start}:${end}`
    if (start !== end && !edgeKeys.has(key)) {
      edgeKeys.add(key)
      edges.push({ from: start, to: end })
    }
  }

  for (let index = 0; index < count; index += 1) {
    const row = Math.floor(index / columns)
    const column = index % columns
    if (column + 1 < columns && index + 1 < count) addEdge(index, index + 1)
    if (row + 1 < rows && index + columns < count) addEdge(index, index + columns)
    if (row % 2 === 0 && column % 3 === 0 && column + 1 < columns && index + columns + 1 < count) {
      addEdge(index, index + columns + 1)
    }
  }

  const positions = new Float32Array(edges.length * 6)
  edges.forEach(({ from, to }, index) => {
    const a = nodes[from]
    const b = nodes[to]
    positions.set([a.x, a.y, a.z, b.x, b.y, b.z], index * 6)
  })
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return { nodes, edges, geometry }
}

export const NetworkLayer = forwardRef<Group, NetworkLayerProps>(
  function NetworkLayer({ compact, lightTheme, reducedMotion, failover }, ref) {
    const packets = useRef<Mesh[]>([])
    const nodeMeshes = useRef<(Mesh | null)[]>([])
    const ringMeshes = useRef<(Mesh | null)[]>([])
    const failoverStarted = useRef(-8)
    const seenFailover = useRef(failover)
    const requestedFailover = useRef(false)
    const nodeCount = compact ? 28 : 52
    const dataCenters = compact ? [3, 17, 24] : [3, 28, 51]
    const { nodes, edges, geometry } = useMemo(() => createNetwork(nodeCount), [nodeCount])
    const tint = lightTheme ? '#62838d' : '#5a97a2'
    const packetColor = lightTheme ? '#087f70' : '#b3f6e9'

    useEffect(() => () => geometry.dispose(), [geometry])
    useEffect(() => {
      if (failover !== seenFailover.current) {
        seenFailover.current = failover
        requestedFailover.current = true
      }
    }, [failover])

    useFrame((state) => {
      const time = state.clock.elapsedTime
      if (requestedFailover.current) {
        requestedFailover.current = false
        failoverStarted.current = time
      } else if (time - failoverStarted.current >= 8) {
        failoverStarted.current = time
      }
      const failoverProgress = time - failoverStarted.current
      const isFailover = failoverProgress < 1.8
      const failedNode = failover % dataCenters.length
      const dim = isFailover ? 0.18 + Math.abs(Math.sin(failoverProgress * 3.2)) * 0.25 : 1

      dataCenters.forEach((nodeIndex, index) => {
        const mesh = nodeMeshes.current[nodeIndex]
        const ring = ringMeshes.current[index]
        const isDimmed = isFailover && index === failedNode
        if (mesh) mesh.scale.setScalar(isDimmed ? dim : 1)
        if (ring) {
          ring.scale.setScalar(isDimmed ? 0.7 + dim * 0.3 : 1)
          if (!reducedMotion) ring.rotation.z = time * (index % 2 === 0 ? 0.1 : -0.1)
        }
      })

      packets.current.forEach((packet, index) => {
        const edgeIndex = (index * 7 + Math.floor(time * 1.15)) % edges.length
        let edge = edges[edgeIndex]
        if (isFailover && (edge.from === dataCenters[failedNode] || edge.to === dataCenters[failedNode])) {
          edge = edges.find((candidate) =>
            candidate.from !== dataCenters[failedNode] &&
            candidate.to !== dataCenters[failedNode] &&
            (candidate.from === dataCenters[(failedNode + 1) % 3] ||
              candidate.to === dataCenters[(failedNode + 1) % 3]),
          ) ?? edge
        }
        const amount = reducedMotion ? 0.4 : (time * (0.19 + index % 3 * 0.025) + index * 0.17) % 1
        const from = nodes[edge.from]
        const to = nodes[edge.to]
        packet.position.set(
          from.x + (to.x - from.x) * amount,
          from.y + (to.y - from.y) * amount,
          from.z + (to.z - from.z) * amount,
        )
      })
    })

    return (
      <group ref={ref} position={[1.6, 0, -1.2]}>
        <lineSegments geometry={geometry}>
          <lineBasicMaterial color={tint} transparent opacity={lightTheme ? 0.12 : 0.15} />
        </lineSegments>
        {nodes.map((node, index) => {
          const isDataCenter = dataCenters.includes(index)
          return (
            <mesh
              key={`node-${index}`}
              ref={(mesh) => { nodeMeshes.current[index] = mesh }}
              position={[node.x, node.y, node.z]}
            >
              <sphereGeometry args={[isDataCenter ? 0.09 : 0.045, 8, 8]} />
              <meshBasicMaterial
                color={isDataCenter ? '#14b8a6' : tint}
                transparent
                opacity={isDataCenter ? 0.72 : 0.48}
              />
            </mesh>
          )
        })}
        {dataCenters.map((nodeIndex, index) => {
          const node = nodes[nodeIndex]
          return (
            <mesh
              key={`datacenter-${index}`}
              ref={(mesh) => { ringMeshes.current[index] = mesh }}
              position={[node.x, node.y, node.z]}
              rotation={[0.2, 0, index * 0.65]}
            >
              <torusGeometry args={[0.24, 0.012, 4, 24]} />
              <meshBasicMaterial color="#14b8a6" transparent opacity={0.45} />
            </mesh>
          )
        })}
        {Array.from({ length: compact ? 12 : 24 }, (_, index) => (
          <mesh
            key={`packet-${index}`}
            ref={(mesh) => { if (mesh) packets.current[index] = mesh }}
          >
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial
              color={packetColor}
              transparent
              opacity={0.76}
            />
          </mesh>
        ))}
      </group>
    )
  },
)
