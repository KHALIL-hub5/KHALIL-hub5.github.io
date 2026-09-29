import type { CSSProperties } from 'react'
import type { Project } from '../../data/projects'
import { BrowserFrame } from './BrowserFrame'

interface WebDeckProps {
  project: Project
  selectedIndex: number
}

export function WebDeck({ project, selectedIndex }: WebDeckProps) {
  return (
    <div className="showroom-web-deck">
      {project.web.map((screen, index) => {
        const offset = index - selectedIndex
        const style: CSSProperties = offset < 0
          ? {
              transform: 'translate3d(-160px, 120px, -40px) rotateY(20deg)',
              opacity: 0,
              pointerEvents: 'none',
              zIndex: 0,
            }
          : {
              transform: `translate3d(${40 + offset * 34}px, ${120 - offset * 24}px, ${-offset * 95}px) rotateY(18deg) rotateX(2deg)`,
              opacity: 1,
              pointerEvents: 'auto',
              zIndex: 50 - offset,
              transformOrigin: 'left center',
              '--screen-dim': offset > 0 ? Math.min(0.55, 0.2 + offset * 0.16) : 0,
            } as CSSProperties

        return (
          <BrowserFrame
            key={screen.name}
            project={project}
            screen={screen}
            className={`showroom-web-card ${offset === 0 ? 'is-selected' : ''}`}
            style={style}
            eager={project.id === 'kh' && index === 0}
          />
        )
      })}
    </div>
  )
}
