import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { projects, type Project } from '../../data/projects'

interface ProjectTabsProps {
  activeProject: Project
  onSelect: (project: Project) => void
}

export function ProjectTabs({ activeProject, onSelect }: ProjectTabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + projects.length) % projects.length
    onSelect(projects[nextIndex])
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="showroom-project-tabs" role="tablist" aria-label="Projects">
      {projects.map((project, index) => (
        <button
          key={project.id}
          className="showroom-project-tab"
          type="button"
          role="tab"
          id={`showroom-tab-${project.id}`}
          aria-selected={activeProject.id === project.id}
          aria-controls="showroom-project-panel"
          tabIndex={activeProject.id === project.id ? 0 : -1}
          style={{ '--project-dot': project.palette.primary } as CSSProperties}
          ref={(element) => { tabRefs.current[index] = element }}
          onClick={() => onSelect(project)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <strong><i />{project.name}</strong>
          <span>{project.tagline}</span>
        </button>
      ))}
    </div>
  )
}
