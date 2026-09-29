import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

type LayerId = 'ui' | 'api' | 'db'

const LAYER_DETAILS: Array<{ id: LayerId; name: string; technologies: string }> = [
  { id: 'ui', name: 'Interface', technologies: 'React, React Native' },
  { id: 'api', name: 'API', technologies: 'Node.js, NestJS, Express' },
  { id: 'db', name: 'Database', technologies: 'PostgreSQL + Prisma' },
]

const initialReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ProjectPhonePreview() {
  const [stackDragging, setStackDragging] = useState(false)
  const [liftedLayer, setLiftedLayer] = useState<LayerId | null>(null)
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion)
  const [paused, setPaused] = useState(initialReducedMotion)
  const stackRotatorRef = useRef<HTMLDivElement | null>(null)
  const stackDrag = useRef<{ pointerId: number; x: number; y: number } | null>(null)
  const stackRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches)
      if (event.matches) setPaused(true)
    }
    preference.addEventListener('change', updateMotionPreference)
    return () => preference.removeEventListener('change', updateMotionPreference)
  }, [])

  function handleStackPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (paused || reducedMotion || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.preventDefault()
    stackDrag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
    setStackDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleStackPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = stackDrag.current
    if (paused || reducedMotion || drag?.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.x
    const deltaY = event.clientY - drag.y
    drag.x = event.clientX
    drag.y = event.clientY
    stackRotation.current.x += deltaY * 0.8
    stackRotation.current.y += deltaX * 0.8
    stackRotatorRef.current?.style.setProperty('--rx', `${stackRotation.current.x}deg`)
    stackRotatorRef.current?.style.setProperty('--ry', `${stackRotation.current.y}deg`)
  }

  function finishStackPointerDrag(event: PointerEvent<HTMLDivElement>) {
    if (stackDrag.current?.pointerId !== event.pointerId) return
    stackDrag.current = null
    setStackDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleStackKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (paused || reducedMotion) return
    const step = event.shiftKey ? 24 : 8
    if (event.key === 'ArrowUp') stackRotation.current.x -= step
    else if (event.key === 'ArrowDown') stackRotation.current.x += step
    else if (event.key === 'ArrowLeft') stackRotation.current.y -= step
    else if (event.key === 'ArrowRight') stackRotation.current.y += step
    else return

    event.preventDefault()
    stackRotatorRef.current?.style.setProperty('--rx', `${stackRotation.current.x}deg`)
    stackRotatorRef.current?.style.setProperty('--ry', `${stackRotation.current.y}deg`)
  }

  return (
    <section
      className={`project-preview ${paused ? 'preview-paused' : ''} ${reducedMotion ? 'preview-reduced-motion' : ''}`}
      id="full-stack-layers"
      aria-labelledby="project-preview-heading"
    >
      <header className="project-preview-header">
        <div className="project-preview-copy">
          <span className="eyebrow">Interactive project preview</span>
          <h3 id="project-preview-heading">The full-stack layers</h3>
          <p>A closer look at the layers behind a full-stack application.</p>
        </div>
        <button
          className="preview-motion-toggle"
          type="button"
          disabled={reducedMotion}
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          {paused && !reducedMotion ? <Play size={15} /> : <Pause size={15} />}
          {reducedMotion ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion'}
        </button>
      </header>

      <div id="project-scene-panel" className="project-preview-body scene-0">
        <aside className="scene-info" aria-label="Full-stack architecture layers">
          <h4>Application layers</h4>
          <p>Hover or focus a layer to lift it from the stack.</p>
          <ul className="scene-layer-list">
            {LAYER_DETAILS.map((layer) => (
              <li key={layer.id}>
                <button
                  type="button"
                  className={`scene-layer-button layer-${layer.id} ${liftedLayer === layer.id ? 'is-active' : ''}`}
                  onPointerEnter={() => setLiftedLayer(layer.id)}
                  onPointerLeave={(event) => {
                    if (event.pointerType !== 'touch') setLiftedLayer(null)
                  }}
                  onFocus={() => setLiftedLayer(layer.id)}
                  onBlur={() => setLiftedLayer(null)}
                  onClick={() => setLiftedLayer((current) => current === layer.id ? null : layer.id)}
                  aria-label={`${layer.name}: ${layer.technologies}; preview the ${layer.name.toLowerCase()} layer`}
                >
                  <strong>{layer.name}</strong><span>{layer.technologies}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div
          onPointerDown={handleStackPointerDown}
          onPointerMove={handleStackPointerMove}
          onPointerUp={finishStackPointerDrag}
          onPointerCancel={finishStackPointerDrag}
          onLostPointerCapture={finishStackPointerDrag}
          onKeyDown={handleStackKeyDown}
          tabIndex={paused || reducedMotion ? -1 : 0}
          role="group"
          aria-roledescription="rotatable 3D preview"
          aria-label="Full-stack layers. Drag to rotate, or use the arrow keys. Hold Shift for larger steps."
          className={`scene-stage stack-stage ${stackDragging ? 'is-dragging' : ''}`}
        >
          <div ref={stackRotatorRef} className="stack-rotator" aria-hidden="true">
            <div className="stack-cake">
              <div className="stack-beams" aria-hidden="true"><i /><i /><i /></div>
              {[...LAYER_DETAILS].reverse().map((layer) => (
                <div
                  key={layer.id}
                  className={`stack-slab slab-${layer.id} ${liftedLayer === layer.id ? 'is-lifted' : ''}`}
                  aria-hidden="true"
                >
                  <div className="stack-slab-content">
                    <h5>{layer.name} - {layer.technologies}</h5>
                    {layer.id === 'ui' && (
                      <div className="stack-wire">
                        <i /><i /><div>{Array.from({ length: 3 }, (_, index) => <b key={index} />)}</div>
                      </div>
                    )}
                    {layer.id === 'api' && (
                      <div className="stack-routes">
                        <span><b>POST</b> /auth/login</span>
                        <span><b>GET</b> /workers</span>
                        <span><b>POST</b> /appointments</span>
                        <span><b>GET</b> /trainings</span>
                      </div>
                    )}
                    {layer.id === 'db' && (
                      <div className="stack-table-rows">
                        {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="stack-packet-set" aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => <i key={index} className={`stack-packet packet-${index}`} />)}
              </div>
            </div>
          </div>
          <span className="scene-stage-hint">Drag to rotate - Arrow keys to turn - Data packets travel between layers.</span>
        </div>
      </div>
    </section>
  )
}
