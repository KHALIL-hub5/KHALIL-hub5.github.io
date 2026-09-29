import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Project, Screen } from '../../data/projects'

interface BrowserFrameProps {
  project: Project
  screen: Screen
  className?: string
  style?: CSSProperties
  eager?: boolean
}

export function BrowserFrame({ project, screen, className = '', style, eager = false }: BrowserFrameProps) {
  const Concept = screen.component
  const viewportRef = useRef<HTMLDivElement>(null)
  const [conceptScale, setConceptScale] = useState(0.47)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!screen.concept || !viewport) return
    const updateScale = () => setConceptScale(viewport.getBoundingClientRect().width / screen.width)
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [screen.concept, screen.width])

  return (
    <div className={`showroom-device showroom-browser ${className}`} style={style}>
      <div className="showroom-browser-chrome">
        <i /><i /><i />
        <span>{project.name}{screen.concept ? ' · Web concept' : ''}</span>
      </div>
      <div
        ref={viewportRef}
        className={`showroom-browser-viewport ${screen.concept ? 'is-concept' : ''}`}
        style={screen.concept ? { aspectRatio: `${screen.width} / ${screen.height}` } : undefined}
      >
        {Concept ? (
          <div
            className="showroom-concept-canvas"
            role="img"
            aria-label={`${project.name}: ${screen.name} web concept`}
            style={{ '--concept-scale': conceptScale } as CSSProperties}
          >
            <Concept />
          </div>
        ) : screen.src ? (
          <img
            src={screen.src}
            alt={`${project.name}: ${screen.name} web screen`}
            width={screen.width}
            height={screen.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        ) : null}
        <span className="showroom-screen-dim" />
      </div>
      <span className="showroom-browser-depth" aria-hidden="true" />
    </div>
  )
}
