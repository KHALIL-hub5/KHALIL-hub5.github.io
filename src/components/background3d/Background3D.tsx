import { Component, lazy, Suspense, useCallback, useEffect, useState, type ErrorInfo, type ReactNode } from 'react'

const SceneCanvas = lazy(() => import('./SceneCanvas'))

interface BoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface BoundaryState {
  failed: boolean
}

class SceneErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The 3D background could not be rendered.', error, info)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return context !== null
  } catch {
    return false
  }
}

export function Background3D() {
  const [enabled, setEnabled] = useState(() => window.localStorage.getItem('portfolio-background') !== 'off')
  const [canvasMounted, setCanvasMounted] = useState(enabled)
  const [webglAvailable, setWebglAvailable] = useState(false)
  const handleContextLost = useCallback(() => setWebglAvailable(false), [])

  useEffect(() => {
    setWebglAvailable(supportsWebGL())
  }, [])

  function toggleBackground() {
    const next = !enabled
    window.localStorage.setItem('portfolio-background', next ? 'on' : 'off')
    if (next) setCanvasMounted(true)
    setEnabled(next)
  }

  return (
    <>
      <div className={`background-3d ${enabled ? '' : 'background-3d-disabled'}`} aria-hidden="true">
        {canvasMounted && webglAvailable && (
          <SceneErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <SceneCanvas enabled={enabled} onContextLost={handleContextLost} />
            </Suspense>
          </SceneErrorBoundary>
        )}
        <div className="background-3d-fallback" />
        <div className="background-3d-vignette" />
      </div>
      <button
        className="background-animation-toggle"
        type="button"
        onClick={toggleBackground}
        aria-pressed={enabled}
        aria-label={`${enabled ? 'Turn off' : 'Turn on'} background animation`}
        title={`${enabled ? 'Turn off' : 'Turn on'} background animation`}
      >
        <span className="background-toggle-indicator" aria-hidden="true" />
        <span>Background {enabled ? 'on' : 'off'}</span>
      </button>
    </>
  )
}
