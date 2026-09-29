import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react'
import { content } from '../data/content'
import { getExperienceStatus } from '../data/experience'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function Experience() {
  return (
    <section className="section-shell content-section" id="experience" aria-labelledby="experience-heading">
      <Reveal>
        <SectionHeading
          id="experience-heading"
          eyebrow={content.experienceSection.eyebrow}
          title={content.experienceSection.title}
          description={content.experienceSection.description}
        />
      </Reveal>
      <p className="experience-overlap-note">These periods overlap; each card shows its own independent date range.</p>
      <div className="timeline">
        {content.experience.map((item, index) => (
          <Reveal key={`${item.organization}-${item.role}`} className="timeline-item">
            <div className="timeline-marker"><BriefcaseBusiness size={17} /></div>
            <div className="timeline-card">
              <div className="timeline-top">
                <div>
                  <span className="timeline-date" aria-label={item.accessibleDates}>{item.dates}</span>
                  <h3>{item.role}</h3>
                  <p className="timeline-company">{item.organization} <span>·</span> {item.location}</p>
                </div>
                <div className="timeline-meta">
                  <span className="timeline-count">0{index + 1}</span>
                  <span
                    className={`timeline-status status-${getExperienceStatus(item.startDate, item.endDate)}`}
                    aria-label={`${item.accessibleDates}; ${getExperienceStatus(item.startDate, item.endDate)}`}
                  >
                    {getExperienceStatus(item.startDate, item.endDate)}
                  </span>
                </div>
              </div>
              <p className="timeline-duration">{item.duration}</p>
              <ul>
                {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
              {'project' in item && item.projectDescriptionStatus === 'coming-soon' && (
                <p className="experience-status">
                  {item.project}: {content.experienceSection.projectDescriptionComingSoon}
                </p>
              )}
              {'repoUrl' in item && item.repoUrl && (
                <a className="text-link experience-link" href={item.repoUrl} target="_blank" rel="noreferrer">
                  {content.experienceSection.repositoryLink} <ArrowUpRight size={15} />
                </a>
              )}
              {'repoStatus' in item && item.repoStatus === 'coming-soon' && (
                <span className="placeholder-badge">{content.experienceSection.repositoryComingSoon}</span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
