import { ArrowLeft, ArrowRight, Check, Pause, Play, Smartphone } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'

const SCENES = [
  { id: 0, label: 'The full-stack layers', title: 'The full-stack layers' },
  { id: 1, label: 'Web and mobile together', title: 'Web and mobile together' },
  { id: 2, label: 'Interactive project phone', title: 'Interactive project phone' },
] as const

const SCREENS = [
  { id: 'role', label: 'KHdamli: role' },
  { id: 'profile', label: 'KHdamli: worker' },
  { id: 'medilink', label: 'MediLink-DZ' },
] as const

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const PAYMENT_METHODS = ['Cash', 'Baridimob', 'CCP']
const HEALTHCARE_CATEGORIES = ['Medicines', 'Pharmacies', 'Practices', 'Rentals']

type ScreenId = (typeof SCREENS)[number]['id']
type Role = 'Client' | 'Worker'
type LayerId = 'ui' | 'api' | 'db'

const LAYER_DETAILS: Array<{ id: LayerId; name: string; technologies: string }> = [
  { id: 'ui', name: 'Interface', technologies: 'React, React Native' },
  { id: 'api', name: 'API', technologies: 'Node.js, NestJS, Express' },
  { id: 'db', name: 'Database', technologies: 'PostgreSQL + Prisma' },
]

const DEFAULT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']

const initialReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ProjectPhonePreview() {
  const [activeScene, setActiveScene] = useState(0)
  const [screen, setScreen] = useState<ScreenId>('role')
  const [role, setRole] = useState<Role | null>(null)
  const [category, setCategory] = useState('Plumbing')
  const [healthcareCategory, setHealthcareCategory] = useState('Medicines')
  const [days, setDays] = useState<string[]>(DEFAULT_DAYS)
  const [paymentMethods, setPaymentMethods] = useState<string[]>(PAYMENT_METHODS)
  const [saved, setSaved] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [stackDragging, setStackDragging] = useState(false)
  const [liftedLayer, setLiftedLayer] = useState<LayerId | null>(null)
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion)
  const [paused, setPaused] = useState(initialReducedMotion)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
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

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (paused || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -8,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 10,
    })
  }

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

  function toggleValue(value: string, current: string[], update: (next: string[]) => void) {
    update(current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
    setSaved(false)
  }

  function selectScene(index: number) {
    setActiveScene(index)
    setTilt({ x: 0, y: 0 })
  }

  function handleSceneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const next = (activeScene + direction + SCENES.length) % SCENES.length
    selectScene(next)
    tabRefs.current[next]?.focus()
  }

  function openWorkerProfile() {
    setRole('Worker')
    setSaved(false)
    setScreen('profile')
  }

  const tiltStyle = {
    '--tilt-x': `${tilt.x}deg`,
    '--tilt-y': `${tilt.y}deg`,
  } as CSSProperties
  return (
    <section
      className={`project-preview ${paused ? 'preview-paused' : ''} ${reducedMotion ? 'preview-reduced-motion' : ''}`}
      aria-labelledby="project-preview-heading"
    >
      <header className="project-preview-header">
        <div className="project-preview-copy">
          <span className="eyebrow">Interactive project preview</span>
          <h3 id="project-preview-heading">{SCENES[activeScene].title}</h3>
          <p>
            {activeScene === 0 && 'A closer look at the layers behind a full-stack application.'}
            {activeScene === 1 && 'See a web interface and mobile app exchange data through one API.'}
            {activeScene === 2 && 'Switch screens, choose a role, and explore the onboarding prototype.'}
          </p>
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
        <div
          className="project-scene-tabs"
          role="tablist"
          aria-label="Interactive project scenes"
          onKeyDown={handleSceneKeyDown}
        >
          {SCENES.map((scene, index) => (
            <button
              key={scene.id}
              ref={(element) => { tabRefs.current[index] = element }}
              className="project-scene-tab"
              type="button"
              role="tab"
              id={`project-scene-tab-${index}`}
              aria-selected={activeScene === index}
              aria-controls="project-scene-panel"
              tabIndex={activeScene === index ? 0 : -1}
              onClick={() => selectScene(index)}
            >
              {scene.label}
            </button>
          ))}
        </div>
      </header>

      <div
        id="project-scene-panel"
        className={`project-preview-body scene-${activeScene}`}
        role="tabpanel"
        aria-labelledby={`project-scene-tab-${activeScene}`}
      >
        {activeScene === 0 && (
          <>
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
                      onPointerLeave={() => setLiftedLayer(null)}
                      onFocus={() => setLiftedLayer(layer.id)}
                      onBlur={() => setLiftedLayer(null)}
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
              <div
                ref={stackRotatorRef}
                className="stack-rotator"
                aria-hidden="true"
              >
                  <div className="stack-cake">
                    <div className="stack-beams" aria-hidden="true"><i /><i /><i /></div>
                    {([...LAYER_DETAILS].reverse()).map((layer) => (
                      <div
                        key={layer.id}
                        className={`stack-slab slab-${layer.id} ${liftedLayer === layer.id ? 'is-lifted' : ''}`}
                        aria-hidden="true"
                      >
                        <div className="stack-slab-content">
                          <h5>{layer.name} · {layer.technologies}</h5>
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
              <span className="scene-stage-hint">Drag to rotate · Arrow keys to turn · Data packets travel between layers.</span>
            </div>
          </>
        )}

        {activeScene === 1 && (
          <>
            <aside className="scene-info">
              <h4>Web and mobile together</h4>
              <p>A web experience and a mobile app communicate through the same API.</p>
              <div className="scene-stack-tags"><span>Web</span><span>Mobile</span><span>API</span></div>
              <h5>Try the mobile role selection</h5>
              <p>Select an onboarding role to see how the mobile screen responds.</p>
              <div className="scene-role-actions">
                <button type="button" aria-pressed={role === 'Client'} onClick={() => { setRole('Client'); setScreen('role') }}>
                  Client
                </button>
                <button type="button" aria-pressed={role === 'Worker'} onClick={openWorkerProfile}>
                  Worker
                </button>
              </div>
              <p className="scene-side-note">The screen is a portfolio preview, not a live service.</p>
            </aside>
            <div
              className="scene-stage duo-stage"
              role="group"
              aria-label="Web and mobile product preview connected through an API"
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTilt({ x: 0, y: 0 })}
              style={tiltStyle}
            >
              <div className="duo-scene">
                <div className="mock-browser">
                  <div className="mock-browser-bar"><i /><i /><i /><span>MediLink-DZ</span></div>
                  <div className="mock-browser-content">
                    <div className="mock-browser-nav"><strong>Medi<span>Link</span></strong><span>Sign in</span></div>
                    <div className="mock-search">Search medicines, pharmacies, practices…</div>
                    <div className="mock-web-tiles">
                      {HEALTHCARE_CATEGORIES.map((item, index) => <span key={item} className={`web-tile-${index}`}>{item}</span>)}
                    </div>
                  </div>
                </div>
                <div className="api-cube" aria-label="Rotating API cube">
                  <span className="cube-face cube-front">API</span><span className="cube-face cube-back">JSON</span>
                  <span className="cube-face cube-right">REST</span><span className="cube-face cube-left">API</span>
                  <span className="cube-face cube-top">HTTP</span><span className="cube-face cube-bottom">200</span>
                </div>
                <div className="data-stream stream-left" aria-hidden="true"><i /><i /><i /></div>
                <div className="data-stream stream-right" aria-hidden="true"><i /><i /><i /></div>
                <div className="duo-phone">
                  <div className="duo-phone-screen">
                    <div className="duo-phone-brand"><Smartphone size={13} /> KHdamli</div>
                    {screen === 'profile' ? (
                      <>
                        <h5>Set up your profile</h5>
                        <p>Worker</p>
                        <span className="duo-phone-field">Service category <b>{category}</b></span>
                        <span className="duo-phone-field">Working days <b>{days.length} selected</b></span>
                        <button type="button" className="duo-phone-action" onClick={() => setSaved(true)}>
                          {saved ? 'Profile saved' : 'Save profile'}
                        </button>
                      </>
                    ) : (
                      <>
                        <h5>Choose your role</h5>
                        <button className="duo-role-client" type="button" onClick={() => setRole('Client')}>I need a service<small>Client</small></button>
                        <button className="duo-role-worker" type="button" onClick={openWorkerProfile}>I offer a service<small>Worker</small></button>
                      </>
                    )}
                  </div>
                </div>
                <span className="scene-stage-hint">Browser ⇄ API ⇄ mobile app</span>
              </div>
            </div>
          </>
        )}

        {activeScene === 2 && (
          <>
            <aside className="scene-info phone-preview-info">
              <h4>Interactive project phone</h4>
              <p>Choose a screen, select a role, and try the sample profile controls.</p>
              <div className="project-preview-note">This is an illustrative prototype. Choices are local to this preview and are not submitted.</div>
            </aside>
            <div
              className="scene-stage phone-stage"
              role="group"
              aria-label="Interactive project phone preview"
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTilt({ x: 0, y: 0 })}
              style={tiltStyle}
            >
              <div className="project-screen-tabs phone-screen-tabs" role="group" aria-label="Choose a phone preview screen">
                {SCREENS.map((item) => (
                  <button
                    key={item.id}
                    className="project-screen-tab"
                    type="button"
                    aria-pressed={screen === item.id}
                    onClick={() => {
                      if (item.id === 'profile') setRole('Worker')
                      setScreen(item.id)
                      setSaved(false)
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="preview-phone" style={{ transform: `rotateX(var(--tilt-x)) rotateY(var(--tilt-y))` }}>
                <div className="preview-phone-glow" aria-hidden="true" />
                <div className="preview-phone-screen">
                  <div className="preview-phone-status" aria-hidden="true">
                    <span>9:41</span><span><i /><i /><i /></span>
                  </div>
                  <div className="preview-phone-brand"><Smartphone size={15} /> {screen === 'medilink' ? 'MediLink-DZ' : 'KHdamli'}</div>

                  {screen === 'role' && (
                    <div className="phone-screen-content">
                      <h4>Choose your role</h4>
                      <p>Tell us how you want to use KHdamli.</p>
                      <button
                        className={`role-choice role-client ${role === 'Client' ? 'selected' : ''}`}
                        type="button"
                        aria-pressed={role === 'Client'}
                        onClick={() => { setRole('Client'); setSaved(false) }}
                      >
                        I need a service <small>Client</small>
                      </button>
                      <button
                        className={`role-choice role-worker ${role === 'Worker' ? 'selected' : ''}`}
                        type="button"
                        aria-pressed={role === 'Worker'}
                        onClick={openWorkerProfile}
                      >
                        I offer a service <small>Worker</small>
                      </button>
                      <button className="phone-primary-action" type="button" disabled={!role} onClick={() => setScreen('profile')}>
                        Continue <ArrowRight size={14} />
                      </button>
                      {!role && <span className="phone-field-hint">Choose a role to continue.</span>}
                    </div>
                  )}

                  {screen === 'profile' && (
                    <div className="phone-screen-content">
                      <button className="phone-back" type="button" onClick={() => setScreen('role')}>
                        <ArrowLeft size={13} /> Change role{role ? ` · ${role}` : ''}
                      </button>
                      <h4>Set up your profile</h4>
                      <label className="phone-field">
                        <span>Service category</span>
                        <select value={category} onChange={(event) => { setCategory(event.target.value); setSaved(false) }}>
                          {['Plumbing', 'Electrical work', 'Home repair', 'Other'].map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                      <fieldset className="phone-field phone-choice-field">
                        <legend>Working days</legend>
                        <div className="phone-chips">
                          {DAYS.map((day) => (
                            <button
                              key={day}
                              className={days.includes(day) ? 'selected' : ''}
                              type="button"
                              aria-pressed={days.includes(day)}
                              onClick={() => toggleValue(day, days, setDays)}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className="phone-field phone-choice-field">
                        <legend>Payment methods</legend>
                        <div className="phone-chips phone-payments">
                          {PAYMENT_METHODS.map((method) => (
                            <button
                              key={method}
                              className={paymentMethods.includes(method) ? 'selected' : ''}
                              type="button"
                              aria-pressed={paymentMethods.includes(method)}
                              onClick={() => toggleValue(method, paymentMethods, setPaymentMethods)}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <button className="phone-primary-action" type="button" onClick={() => setSaved(true)}>
                        {saved ? <><Check size={14} /> Saved in preview</> : 'Save preview'}
                      </button>
                      {saved && <span className="phone-field-hint" role="status">Profile choices saved in this preview only.</span>}
                    </div>
                  )}

                  {screen === 'medilink' && (
                    <div className="phone-screen-content">
                      <h4>Healthcare in Algeria</h4>
                      <p>Find what you need in one place.</p>
                      <div className="healthcare-tiles">
                        {HEALTHCARE_CATEGORIES.map((item, index) => (
                          <button
                            key={item}
                            className={healthcareCategory === item ? 'selected' : ''}
                            type="button"
                            aria-pressed={healthcareCategory === item}
                            onClick={() => setHealthcareCategory(item)}
                          >
                            <span className={`healthcare-tile-icon tile-${index}`} aria-hidden="true" />
                            {item}
                          </button>
                        ))}
                      </div>
                      <p className="phone-field-hint" aria-live="polite">Selected: {healthcareCategory}</p>
                    </div>
                  )}
                </div>
              </div>
              <span className="scene-stage-hint">Move your pointer to tilt the phone.</span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
