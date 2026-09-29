import type { Project } from '../../data/projects'

const positions = [
  { left: -30, top: 60, depth: 130 },
  { left: 400, top: 20, depth: 150 },
  { left: 560, top: 500, depth: 120 },
]

interface LabelsProps {
  project: Project
}

export function Labels({ project }: LabelsProps) {
  return (
    <>
      {project.labels.map((label, index) => {
        const position = positions[index] ?? { left: 40 + index * 150, top: 28, depth: 100 }
        return (
          <span
            className="showroom-floating-label"
            key={label}
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
              transform: `translateZ(${position.depth}px)`,
              animationDelay: `${index * -1.7}s`,
            }}
          >
            {label}
          </span>
        )
      })}
      <span className="showroom-kind-label web-label">
        Web{project.id === 'kh' ? ' · concept' : ''}
      </span>
      <span className="showroom-kind-label mobile-label">Mobile</span>
    </>
  )
}
