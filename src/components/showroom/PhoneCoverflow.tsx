import type { CSSProperties } from 'react'
import type { Project } from '../../data/projects'
import { PhoneFrame } from './PhoneFrame'

interface PhoneCoverflowProps {
  project: Project
  selectedIndex: number
  onSelect: (index: number) => void
}

export function PhoneCoverflow({ project, selectedIndex, onSelect }: PhoneCoverflowProps) {
  return (
    <div className="showroom-phone-coverflow">
      {project.mobile.map((screen, index) => {
        const offset = index - selectedIndex
        const distance = Math.abs(offset)
        const style: CSSProperties = {
          transform: `translate3d(${780 - 88 + offset * 66}px, ${70 + distance * 14}px, ${-distance * 80}px) rotateY(${-offset * 26}deg) scale(${1 - distance * 0.05})`,
          zIndex: 50 - distance,
          opacity: distance > 3 ? 0 : 1,
          pointerEvents: distance > 3 ? 'none' : 'auto',
          transformOrigin: 'center center',
          '--screen-dim': distance ? Math.min(0.5, 0.15 + distance * 0.14) : 0,
        } as CSSProperties

        return (
          <PhoneFrame
            key={screen.name}
            project={project}
            screen={screen}
            index={index}
            className={offset === 0 ? 'is-selected' : ''}
            style={style}
            onSelect={() => onSelect(index)}
            eager={project.id === 'kh' && index === 0}
          />
        )
      })}
    </div>
  )
}
