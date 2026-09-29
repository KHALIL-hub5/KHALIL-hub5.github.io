import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload } from '@react-three/drei/core/Preload'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Group, Material, Mesh } from 'three'
import { DataLayer } from './layers/DataLayer'
import { NetworkLayer } from './layers/NetworkLayer'
import { SoftwareLayer } from './layers/SoftwareLayer'

interface SceneCanvasProps {
  enabled: boolean
  onContextLost: () => void
}

type Emphasis = 'all' | 'software' | 'network' | 'data'

const SECTION_EMPHASIS: Record<string, Emphasis> = {
  home: 'all',
  about: 'data',
  skills: 'software',
  experience: 'network',
  projects: 'software',
  contact: 'data',
}

function SceneController({ enabled }: { enabled: boolean }) {
  const root = useRef<Group>(null)
  const layers = useRef<Record<Exclude<Emphasis, 'all'>, Group | null>>({
    software: null,
    network: null,
    data: null,
  })
  const cameraTarget = useRef({ x: 0, y: 0, z: 12 })
  const [emphasis, setEmphasis] = useState<Emphasis>('all')
  const [lightTheme, setLightTheme] = useState(document.documentElement.classList.contains('light'))
  const [failover, setFailover] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [smallScene, setSmallScene] = useState(
    window.innerWidth < 700 || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4),
  )
  const [active, setActive] = useState(!document.hidden)
  const emphasisRef = useRef(emphasis)
  const pointer = useRef({ x: 0, y: 0 })
  const scrollProgress = useRef(0)

  const handlePointer = useCallback((event: PointerEvent) => {
    if (event.pointerType !== 'touch') {
      pointer.current.x = event.clientX / window.innerWidth * 2 - 1
      pointer.current.y = -(event.clientY / window.innerHeight * 2 - 1)
    }
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLightTheme(document.documentElement.classList.contains('light'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const sections = Object.keys(SECTION_EMPHASIS)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const visibility = new Map<string, number>()
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const wasVisible = (visibility.get(entry.target.id) ?? 0) > 0
        visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        if (entry.target.id === 'experience' && entry.isIntersecting && !wasVisible) {
          setFailover((current) => current + 1)
        }
      }
      const current = [...visibility.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'home'
      setEmphasis(SECTION_EMPHASIS[current] ?? 'all')
    }, { threshold: [0.1, 0.25, 0.5] })
    sections.forEach((section) => sectionObserver.observe(section))

    const updateScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.current = scrollable > 0 ? window.scrollY / scrollable : 0
    }
    const updateVisibility = () => setActive(!document.hidden)
    const updateMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    const updateSize = () => setSmallScene(
      window.innerWidth < 700 || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4),
    )
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

    updateScroll()
    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateSize)
    document.addEventListener('visibilitychange', updateVisibility)
    motionPreference.addEventListener('change', updateMotion)

    return () => {
      observer.disconnect()
      sectionObserver.disconnect()
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateSize)
      document.removeEventListener('visibilitychange', updateVisibility)
      motionPreference.removeEventListener('change', updateMotion)
    }
  }, [handlePointer])

  useEffect(() => {
    emphasisRef.current = emphasis
  }, [emphasis])

  useFrame((state, delta) => {
    if (!root.current) return
    const elapsed = state.clock.elapsedTime
    const idleDrift = reducedMotion ? 0 : Math.sin(elapsed * 0.12) * 0.08
    const parallax = reducedMotion ? 0 : 0.2
    const goal = cameraTarget.current
    goal.x = pointer.current.x * parallax
    goal.y = pointer.current.y * parallax + idleDrift
    goal.z = 12 - scrollProgress.current * 0.8
    state.camera.position.x += (goal.x - state.camera.position.x) * Math.min(1, delta * 1.5)
    state.camera.position.y += (goal.y - state.camera.position.y) * Math.min(1, delta * 1.5)
    state.camera.position.z += (goal.z - state.camera.position.z) * Math.min(1, delta * 1.5)
    state.camera.lookAt(0, 0, 0)

    const activeEmphasis = emphasisRef.current
    const targets = activeEmphasis === 'all'
      ? { software: 0.62, network: 0.55, data: 0.58 }
      : { software: 0.22, network: 0.22, data: 0.22 }
    if (activeEmphasis !== 'all') targets[activeEmphasis] = 0.9

    for (const name of ['software', 'network', 'data'] as const) {
      const layer = layers.current[name]
      if (!layer) continue
      const currentOpacity = (layer.userData.opacity as number | undefined) ?? targets[name]
      const opacity = currentOpacity + (targets[name] - currentOpacity) * Math.min(1, delta * 1.2)
      layer.userData.opacity = opacity
      const scale = 0.96 + opacity * 0.05
      layer.scale.setScalar(scale)
      layer.traverse((object) => {
        const display = object as Mesh & { isSprite?: boolean }
        if (!display.isMesh && !display.isSprite) return
        const materials = Array.isArray(display.material) ? display.material : [display.material]
        materials.forEach((material: Material) => {
          const baseOpacity = (material.userData.baseOpacity as number | undefined) ?? material.opacity
          material.userData.baseOpacity = baseOpacity
          material.opacity = baseOpacity * opacity
        })
      })
    }
  })

  const attachLayer = useCallback((name: Exclude<Emphasis, 'all'>) => (group: Group | null) => {
    layers.current[name] = group
    if (group && group.userData.opacity === undefined) group.userData.opacity = 0.55
  }, [])

  return (
    <>
      <fog attach="fog" args={[lightTheme ? '#f4f7f5' : '#101818', 14, 38]} />
      <ambientLight intensity={lightTheme ? 0.8 : 0.65} />
      <group ref={root}>
        <SoftwareLayer
          ref={attachLayer('software')}
          compact={smallScene}
          lightTheme={lightTheme}
          reducedMotion={reducedMotion}
        />
        <NetworkLayer
          ref={attachLayer('network')}
          compact={smallScene}
          lightTheme={lightTheme}
          reducedMotion={reducedMotion}
          failover={failover}
        />
        <DataLayer
          ref={attachLayer('data')}
          compact={smallScene}
          lightTheme={lightTheme}
          reducedMotion={reducedMotion}
        />
      </group>
      <SceneInvalidator active={enabled && active && !reducedMotion} />
    </>
  )
}

function SceneInvalidator({ active }: { active: boolean }) {
  const setFrameloop = useMemo(() => active ? 'always' : 'demand', [active])
  const { setFrameloop: applyFrameloop } = useThree()

  useEffect(() => {
    applyFrameloop(setFrameloop)
  }, [applyFrameloop, setFrameloop])

  return null
}

export default function SceneCanvas({ enabled, onContextLost }: SceneCanvasProps) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.5]}
      frameloop={enabled && !reducedMotion ? 'always' : 'demand'}
      camera={{ position: [0, 0, 12], fov: 48, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.domElement.setAttribute('aria-hidden', 'true')
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
          onContextLost()
        }, { once: true })
      }}
    >
      <SceneController enabled={enabled} />
      <Preload all />
    </Canvas>
  )
}
