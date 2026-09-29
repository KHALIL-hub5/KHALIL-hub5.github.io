import type { CSSProperties } from 'react'
import type { Project, Screen } from '../../data/projects'

interface PhoneFrameProps {
  project: Project
  screen: Screen
  index: number
  style?: CSSProperties
  className?: string
  onSelect?: () => void
  eager?: boolean
  variant?: 'coverflow' | 'mobile-focus'
}

export function PhoneFrame({
  project,
  screen,
  index,
  style,
  className = '',
  onSelect,
  eager = false,
  variant = 'coverflow',
}: PhoneFrameProps) {
  return (
    <button
      className={`showroom-device showroom-phone ${variant === 'mobile-focus' ? 'is-mobile-focus' : ''} ${className}`}
      type="button"
      style={style}
      onClick={onSelect}
      data-screen-index={index}
      tabIndex={-1}
      aria-hidden="true"
      aria-label={`Show ${project.name} mobile screen: ${screen.name}`}
    >
      <span className="showroom-phone-viewport">
        {screen.src && (
          <img
            src={screen.src}
            alt={`${project.name}: ${screen.name} mobile screen`}
            width={screen.width}
            height={screen.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        )}
        <span className="showroom-screen-dim" />
      </span>
      <span className="showroom-phone-side-button" />
      <span className="showroom-phone-depth" aria-hidden="true" />
    </button>
  )
}
