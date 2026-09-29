import type { Project } from '../../data/projects'

interface ScreenPickersProps {
  project: Project
  webIndex: number
  mobileIndex: number
  mobileView: 'web' | 'mobile'
  onWebSelect: (index: number) => void
  onMobileSelect: (index: number) => void
  onMobileViewChange: (view: 'web' | 'mobile') => void
  paused: boolean
  reducedMotion: boolean
  onToggleMotion: () => void
}

function ScreenGroup({
  label,
  screens,
  selectedIndex,
  onSelect,
  className,
}: {
  label: string
  screens: Project['web']
  selectedIndex: number
  onSelect: (index: number) => void
  className: string
}) {
  return (
    <div className={`showroom-picker-group ${className}`} role="group" aria-label={`${label} screens`}>
      <span>{label}</span>
      {screens.map((screen, index) => (
        <button
          key={screen.name}
          className="showroom-picker"
          type="button"
          aria-pressed={selectedIndex === index}
          onClick={() => onSelect(index)}
        >
          {screen.name}{screen.concept ? ' · concept' : ''}
        </button>
      ))}
    </div>
  )
}

export function ScreenPickers({
  project,
  webIndex,
  mobileIndex,
  mobileView,
  onWebSelect,
  onMobileSelect,
  onMobileViewChange,
  paused,
  reducedMotion,
  onToggleMotion,
}: ScreenPickersProps) {
  return (
    <div className="showroom-controls">
      <ScreenGroup label="Web" screens={project.web} selectedIndex={webIndex} onSelect={onWebSelect} className="web-pickers" />
      <ScreenGroup label="Mobile" screens={project.mobile} selectedIndex={mobileIndex} onSelect={onMobileSelect} className="mobile-pickers" />
      <div className="showroom-mobile-view" role="group" aria-label="Preview platform">
        <button type="button" aria-pressed={mobileView === 'web'} onClick={() => onMobileViewChange('web')}>Web view</button>
        <button type="button" aria-pressed={mobileView === 'mobile'} onClick={() => onMobileViewChange('mobile')}>Mobile view</button>
      </div>
      <button
        className="showroom-motion-toggle"
        type="button"
        aria-pressed={paused || reducedMotion}
        disabled={reducedMotion}
        onClick={onToggleMotion}
      >
        <span aria-hidden="true">{paused || reducedMotion ? '▶' : 'Ⅱ'}</span>
        {reducedMotion ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion'}
      </button>
    </div>
  )
}
