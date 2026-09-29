import {
  ArrowUpRight,
} from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { content } from '../data/content'
import type { Project } from '../data/projects'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const Showroom = lazy(() => import('./showroom/Showroom').then(({ Showroom: Component }) => ({ default: Component })))

export function Projects() {
  const [activeProject, setActiveProject] = useState<Project['id']>('kh')

  return (
    <section
      className="section-shell content-section projects-section"
      id="projects"
      aria-labelledby="projects-heading"
      data-project={activeProject}
    >
      <Reveal>
        <SectionHeading
          id="projects-heading"
          eyebrow={content.projectsSection.eyebrow}
          title={content.projectsSection.title}
          description={content.projectsSection.description}
        />
      </Reveal>
      <Reveal>
        <Suspense fallback={<div className="showroom-loading" role="status">Loading project showroom…</div>}>
          <Showroom onProjectChange={setActiveProject} />
        </Suspense>
      </Reveal>
      <div className="more-projects">
        <span>{content.projectsSection.moreProjectsLabel}</span>
        <div className="more-project-links">
          {content.moreProjects.map((project) => (
            <a key={project.title} href={project.href} target="_blank" rel="noreferrer">
              {project.title} <ArrowUpRight size={13} />
            </a>
          ))}
          <a className="all-repos-link" href={content.contact.github} target="_blank" rel="noreferrer">
            {content.projectsSection.moreOnGithub} <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
