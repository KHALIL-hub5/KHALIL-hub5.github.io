import { ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../../data/projects'

export function ProjectInfo({ project }: { project: Project }) {
  return (
    <div className="showroom-info">
      <div className="showroom-info-card showroom-project-summary">
        <div>
          <span className="showroom-info-eyebrow">Project</span>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
        </div>
        {project.repoUrl && (
          <a className="showroom-repo-link" href={project.repoUrl} target="_blank" rel="noreferrer">
            <Github size={16} /> View on GitHub <ArrowUpRight size={15} />
          </a>
        )}
        {project.repoStatus === 'private' && <span className="showroom-repo-badge">Code on request</span>}
        {project.repoStatus === 'soon' && <span className="showroom-repo-badge">Repository coming soon</span>}
      </div>
      <div className="showroom-info-card">
        <h4>Who it is for</h4>
        <p>{project.audience}</p>
        <ul className="showroom-platform-status">
          <li><b>Web:</b> {project.id === 'kh' ? 'Concept screens' : 'Screens available'}</li>
          <li><b>Mobile:</b> Screens available</li>
        </ul>
      </div>
      <div className="showroom-info-card showroom-design-card">
        <h4>Its own design</h4>
        <p>{project.stack}</p>
        <div className="showroom-palette" aria-label={`Project palette: ${project.palette.colors.join(', ')}`}>
          {project.palette.colors.map((color) => (
            <span key={color} style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      </div>
    </div>
  )
}
