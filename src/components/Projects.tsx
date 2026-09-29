import {
  ArrowUpRight,
  Bot,
  Github,
  HeartPulse,
  Network,
  Server,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import { lazy, Suspense, useMemo, useState } from 'react'
import { content, type ProjectCategory, type ProjectIcon } from '../data/content'
import type { Project } from '../data/projects'
import { ProjectPhonePreview } from './ProjectPhonePreview'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const Showroom = lazy(() => import('./showroom/Showroom').then(({ Showroom: Component }) => ({ default: Component })))

const projectIcons: Record<ProjectIcon, LucideIcon> = {
  smartphone: Smartphone,
  healthcare: HeartPulse,
  bot: Bot,
  server: Server,
  network: Network,
}

export function Projects() {
  const [activeProject, setActiveProject] = useState<Project['id']>('kh')
  const filters: Array<typeof content.projectsSection.allFilter | ProjectCategory> = [
    content.projectsSection.allFilter,
    ...content.projectCategories,
  ]
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>(
    content.projectsSection.allFilter,
  )
  const visibleProjects = useMemo(
    () => activeFilter === content.projectsSection.allFilter
      ? content.projects
      : content.projects.filter((project) =>
          project.categories.some((category) => category === activeFilter),
        ),
    [activeFilter],
  )
  const gridVariant = visibleProjects.length === 1
    ? 'project-grid-solo'
    : visibleProjects.length === 2
      ? 'project-grid-pair'
      : ''

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
      <div className="project-filters" role="group" aria-label={content.projectsSection.filterGroupLabel}>
        {filters.map((filter) => (
          <button
            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className={`project-grid ${gridVariant}`} aria-live="polite">
        {visibleProjects.map((project) => {
          const Icon = projectIcons[project.icon]
          const projectNumber = content.projects.indexOf(project) + 1

          return (
            <Reveal key={project.id} className={`project-card ${project.featured && visibleProjects.length > 2 ? 'project-featured' : ''}`}>
              <div className={`project-art project-art-${(projectNumber - 1) % 5}`} aria-hidden="true">
                <span className="project-art-index">{String(projectNumber).padStart(2, '0')}</span>
                <Icon className="project-art-icon" strokeWidth={1.2} />
                <span className="project-art-pattern" />
              </div>
              <div className="project-card-content">
                <div className="project-title-row">
                  <h3>{project.title}</h3>
                  <span className="project-category">{project.categories[0]}</span>
                </div>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
                <div className="project-card-footer">
                  {project.repoUrl ? (
                    <a className="project-link" href={project.repoUrl} target="_blank" rel="noreferrer">
                      <Github size={16} /> {content.projectsSection.githubAction} <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <span className={`repository-status ${project.status === 'private' ? 'private' : ''}`}>
                      {project.status === 'private'
                        ? content.projectsSection.repositoryStatus.private
                        : content.projectsSection.repositoryStatus.comingSoon}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
      <Reveal>
        <ProjectPhonePreview />
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
